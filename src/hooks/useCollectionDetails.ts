import { useState, useEffect } from 'react'
import { fetchJSON, API_BASE_URL } from '../utils/api'
import type { Collection } from './useCollections'


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

const ASSET_FAVORITES_KEY = 'tala_favorite_assets';

export function useCollectionDetails(collectionId: string | null, assetSearchQuery: string = '', page: number = 1, perPage: number = 50) {
  const [collection, setCollection] = useState<CollectionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getFavs = (): string[] => {
    try {
      const stored = localStorage.getItem(ASSET_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveFavs = (favs: string[]) => {
    localStorage.setItem(ASSET_FAVORITES_KEY, JSON.stringify(favs));
  };

  const fetchDetails = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const colResponse = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${id}`);
      const colData = colResponse?.data || colResponse;
      
      if (!colData) {
        setCollection(null);
        return;
      }

      let assets: Asset[] = [];
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
          q: assetSearchQuery
        });
        
        const assetsResponse = await fetchJSON<any>(`${API_BASE_URL}/api/assets/collection/${id}?${queryParams.toString()}`);
        const rawAssets = assetsResponse?.data || assetsResponse;
        const assetsArray = Array.isArray(rawAssets) ? rawAssets : (rawAssets?.data || []);
        
        const favs = getFavs();

        assets = assetsArray.map((a: any) => {
          let type: Asset['type'] = 'Document';
          const mime = (a.assetType || a.type || '').toLowerCase();
          if (mime.includes('audio')) type = 'Audio';
          else if (mime.includes('video')) type = 'Video';
          else if (mime.includes('image')) type = 'Image';

          return {
            id: a.id || a._id,
            name: a.assetName || a.name || 'Untitled Asset',
            creator: a.creator || 'System',
            updatedAt: a.updatedAt || a.createdAt || a.updated_at,
            type,
            metadata: a.metadata || '',
            tags: Array.isArray(a.tags) ? a.tags : [],
            url: a.assetShortUrl || a.assetLongUrl || a.url,
            isFavorite: favs.includes(a.id || a._id)
          };
        });
      } catch(e) {
        console.warn('Failed to fetch assets:', e);
      }

      setCollection(prev => {
        const newCollectionData = {
          id: colData.id || colData._id,
          title: colData.title || 'Untitled Collection',
          description: colData.description || '',
          assetCount: colData.assetCount !== undefined ? colData.assetCount : (page === 1 ? assets.length : (prev?.assetCount || assets.length)),
          updatedAt: colData.updatedAt || colData.createdAt || colData.updated_at,
          ownerId: colData.userId || colData.ownerId,
        };

        if (page === 1 || !prev) {
          return { ...newCollectionData, assets };
        } else {
          const combinedAssets = [...prev.assets, ...assets];
          const seen = new Set();
          const uniqueAssets = combinedAssets.filter(a => {
            if (seen.has(a.id)) return false;
            seen.add(a.id);
            return true;
          });
          return { ...newCollectionData, assets: uniqueAssets };
        }
      });
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
  }, [collectionId, assetSearchQuery, page, perPage])

  const toggleAssetFavorite = async (assetId: string) => {
    const favs = getFavs();
    const newFavs = favs.includes(assetId) ? favs.filter(f => f !== assetId) : [...favs, assetId];
    saveFavs(newFavs);

    setCollection(prev => prev ? {
      ...prev,
      assets: prev.assets.map(a => a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a)
    } : null);
    return { success: true };
  }

  const updateAsset = async (assetId: string, data: Partial<Asset>) => {
    if (!collection) return { success: false }
    try {
      const updateDto: any = {};
      if (data.name) updateDto.assetName = data.name;

      await fetchJSON(`${API_BASE_URL}/api/assets/${assetId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateDto)
      })
      
      setCollection(prev => prev ? {
        ...prev,
        assets: prev.assets.map(a => a.id === assetId ? { ...a, ...data } : a)
      } : null)
      return { success: true }
    } catch (err: any) {
      console.error('Error updating asset:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteAsset = async (assetId: string) => {
    if (!collection) return { success: false }
    try {
      await fetchJSON(`${API_BASE_URL}/api/assets/${assetId}`, { method: 'DELETE' })
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

  const addAssets = async (_newAssets: Asset[]) => {
    if (collectionId) await fetchDetails(collectionId);
    return { success: true }
  }

  return { collection, isLoading, error, toggleAssetFavorite, deleteAsset, addAssets, updateAsset, refetch: () => collectionId && fetchDetails(collectionId) }
}
