import { useState, useEffect } from 'react'
import { fetchJSON } from '../utils/api'
import type { Collection } from './useCollections'

const API_BASE_URL = 'https://tala-dev-api-26jt.onrender.com'

export interface Asset {
  id: string
  name: string
  creator?: string
  updatedAt?: string
  type: 'Audio' | 'Video' | 'Image' | 'Document'
  metadata?: string
  tags: string[]
  url?: string
  isFavorite?: boolean
}

export interface CollectionDetails extends Collection {
  assets: Asset[]
}

export function useCollectionDetails(collectionId: string | null) {
  const [collection, setCollection] = useState<CollectionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetails = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch collection record
      const colResponse = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${id}`);
      const colData = colResponse?.data;
      
      let assets: Asset[] = [];
      try {
        // Fetch paginated assets specifically for this collection
        const assetsResponse = await fetchJSON<any>(`${API_BASE_URL}/api/assets/collection/${id}`);
        const rawAssets = assetsResponse?.data?.data || assetsResponse?.data || [];
        
        // Use a Map to deduplicate by ID
        const deduplicatedMap = new Map<string, any>();
        
        rawAssets.forEach((a: any, index: number) => {
          const id = a.id || a._id || `asset-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          if (!deduplicatedMap.has(id)) {
            deduplicatedMap.set(id, { ...a, id });
          }
        });

        assets = Array.from(deduplicatedMap.values());
      } catch(e) {
        console.warn('Failed to fetch assets, might not exist yet from backend:', e);
      }

      if (colData) {
        const collectionWithId = {
          ...colData,
          id: colData.id || colData._id || id
        };
        setCollection({ ...collectionWithId, assets });
      } else {
        setCollection(null);
      }
    } catch (err: any) {
      console.error('Error fetching collection details:', err)
      setError(err.message || 'Failed to fetch collection details')
      setCollection(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (collectionId) {
      fetchDetails(collectionId)
    } else {
      setCollection(null)
    }
  }, [collectionId])

  const toggleAssetFavorite = async (assetId: string) => {
    if (!collection) return { success: false }
    try {
      const asset = collection.assets.find(a => a.id === assetId)
      if (!asset) return { success: false }
      
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${collectionId}/assets/${assetId}/favorite`, {
        method: 'PATCH',
        body: JSON.stringify({ isFavorite: !asset.isFavorite })
      })
      const updated = response?.data;
      if (updated) {
        setCollection(prev => prev ? {
          ...prev,
          assets: prev.assets.map(a => a.id === assetId ? updated : a)
        } : null)
      }
      return { success: true }
    } catch (err: any) {
      console.error('Error toggling asset favorite:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteAsset = async (assetId: string) => {
    if (!collection) return { success: false }
    try {
      await fetchJSON(`${API_BASE_URL}/api/collections/${collectionId}/assets/${assetId}`, { method: 'DELETE' })
      setCollection(prev => prev ? {
        ...prev,
        assets: prev.assets.filter(a => a.id !== assetId)
      } : null)
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting asset:', err)
      return { success: false, error: err.message }
    }
  }

  const addAssets = async (newAssets: Asset[]) => {
    if (!collection) return { success: false }
    try {
      for (const asset of newAssets) {
        await fetchJSON(`${API_BASE_URL}/api/collections/${collectionId}/assets`, {
          method: 'POST',
          body: JSON.stringify(asset)
        })
      }
      if (collectionId) {
        await fetchDetails(collectionId);
      }
      return { success: true }
    } catch (err: any) {
      console.error('Error adding assets:', err)
      return { success: false, error: err.message }
    }
  }

  return { collection, isLoading, error, toggleAssetFavorite, deleteAsset, addAssets, refetch: () => collectionId && fetchDetails(collectionId) }
}
