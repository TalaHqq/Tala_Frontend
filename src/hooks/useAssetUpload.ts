import { useState } from 'react';
import { fetchJSON } from '../utils/api';

const API_BASE_URL = 'https://tala-dev-api-26jt.onrender.com';
const PART_SIZE = 5 * 1024 * 1024; // 5 MB minimum

export interface UploadProgress {
  progress: number;
  status: 'Initiating' | 'Uploading' | 'Completing' | 'Done' | 'Error';
  error?: string;
}

export function useAssetUpload() {
  const [uploadState, setUploadState] = useState<Record<string, UploadProgress>>({});

  const uploadAsset = async (file: File, collectionId: string, trackId: string) => {
    setUploadState(prev => ({ ...prev, [trackId]: { progress: 0, status: 'Initiating' } }));

    let uploadId: string | undefined;
    let key: string | undefined;

    try {
      const partCount = Math.ceil(file.size / PART_SIZE) || 1; // at least 1 part for 0-byte files
      
      // 1. Initiate Upload
      const initResponse = await fetchJSON<any>(`${API_BASE_URL}/api/upload/initiate`, {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          partCount,
          collectionId
        })
      });

      const initData = initResponse?.data;
      if (!initData || !initData.uploadId || !initData.key || !initData.presignedUrls) {
        throw new Error('Invalid response from upload/initiate endpoint');
      }

      uploadId = initData.uploadId;
      key = initData.key;
      const presignedUrls: string[] = initData.presignedUrls;

      setUploadState(prev => ({ ...prev, [trackId]: { progress: 10, status: 'Uploading' } }));

      // 2. Direct Part Upload to S3
      const parts: { partNumber: number; eTag: string }[] = [];
      
      // Upload chunks in parallel for better performance, but limit concurrency if file is huge.
      // For simplicity and stability in this prototype, we'll do Promise.all() mapping.
      const uploadPromises = presignedUrls.map(async (url, index) => {
        const start = index * PART_SIZE;
        const end = Math.min(start + PART_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Native fetch specifically for S3. No Auth headers.
        const chunkResponse = await fetch(url, {
          method: 'PUT',
          body: chunk
        });

        if (!chunkResponse.ok) {
          throw new Error(`Failed to upload chunk ${index + 1}`);
        }

        // Get ETag from S3 response
        let eTag = chunkResponse.headers.get('ETag');
        if (!eTag) {
          // If ETag is missing (e.g. CORS issue), we might need to rely on alternative methods,
          // but strictly adhering to S3 standards, the ETag should be exposed.
          throw new Error(`Missing ETag header after uploading chunk ${index + 1}`);
        }

        eTag = eTag.replace(/"/g, ''); // S3 ETags are enclosed in quotes
        
        parts.push({ partNumber: index + 1, eTag });
      });

      await Promise.all(uploadPromises);
      
      // Sort parts because Promises finish out of order
      parts.sort((a, b) => a.partNumber - b.partNumber);

      setUploadState(prev => ({ ...prev, [trackId]: { progress: 90, status: 'Completing' } }));

      // 3. Complete Upload
      const completeResponse = await fetchJSON<any>(`${API_BASE_URL}/api/upload/complete`, {
        method: 'POST',
        body: JSON.stringify({
          uploadId,
          key,
          contentType: file.type || 'application/octet-stream',
          collectionId,
          parts
        })
      });

      setUploadState(prev => ({ ...prev, [trackId]: { progress: 100, status: 'Done' } }));
      return { success: true, asset: completeResponse?.data };

    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadState(prev => ({ 
        ...prev, 
        [trackId]: { progress: 0, status: 'Error', error: error.message } 
      }));

      // Abort upload if we got an uploadId safely
      if (uploadId && key) {
        try {
          await fetchJSON(`${API_BASE_URL}/api/upload/abort`, {
            method: 'POST',
            body: JSON.stringify({ uploadId, key })
          });
        } catch (abortError) {
          console.error('Failed to abort upload cleanly:', abortError);
        }
      }

      return { success: false, error: error.message };
    }
  };

  return { uploadAsset, uploadState };
}
