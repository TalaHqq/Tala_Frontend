import { useState, useEffect } from 'react'
import { fetchJSON } from '../utils/api'

const API_BASE_URL = 'https://tala-dev-api-26jt.onrender.com'

export interface Collection {
  id: string
  title: string
  description?: string
  assetCount?: number
  updatedAt?: string
  isFavorite?: boolean
  ownerId?: string
}


export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections`);
      const rawData = response?.data || [];
      
      // Use a Map to deduplicate by ID
      const deduplicatedMap = new Map<string, any>();
      
      rawData.forEach((c: any, index: number) => {
        const id = c.id || c._id || `coll-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!deduplicatedMap.has(id)) {
          deduplicatedMap.set(id, { ...c, id });
        }
      });

      const collectionsArray = Array.from(deduplicatedMap.values());
      setCollections(collectionsArray);
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      // Fallback to empty array
      setCollections([]);
      setError(err.message || 'Failed to retrieve collections');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const createCollection = async (title: string, _description: string) => {
    try {
      // Backend CollectionsDto only accepts title
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/create`, {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      const rawCollection = response?.data;
      if (!rawCollection) throw new Error('No data returned')
      
      const newId = rawCollection.id || rawCollection._id || `coll-new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newCollection = {
        ...rawCollection,
        id: newId
      };

      setCollections(prev => {
        // Prevent adding a duplicate if it already exists in the state
        if (prev.some(c => c.id === newId)) return prev;
        return [newCollection, ...prev];
      });
      return { success: true, collection: newCollection }
    } catch (err: any) {
      console.error('Error creating collection:', err)
      return { success: false, error: err.message || 'Failed to create collection' }
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      await fetchJSON(`${API_BASE_URL}/api/collections/${id}`, { method: 'DELETE' })
      setCollections(prev => prev.filter(c => c.id !== id))
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting collection:', err)
      return { success: false, error: err.message };
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const collection = collections.find(c => c.id === id)
      if (!collection) return { success: false }
      
      // Note: Backend alignment might be needed here if favorite endpoint doesn't exist
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${id}/favorite`, {
        method: 'PATCH',
        body: JSON.stringify({ isFavorite: !collection.isFavorite })
      })
      const updated = response?.data;
      if (updated) {
        setCollections(prev => prev.map(c => c.id === id ? updated : c))
      }
      return { success: true }
    } catch (err: any) {
      console.error('Error toggling favorite:', err)
      return { success: false, error: err.message };
    }
  }

  const renameCollection = async (id: string, title: string) => {
    try {
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title })
      })
      const updated = response?.data;
      if (updated) {
        setCollections(prev => prev.map(c => c.id === id ? updated : c))
      }
      return { success: true }
    } catch (err: any) {
      console.error('Error renaming collection:', err)
      return { success: false, error: err.message };
    }
  }

  return { collections, isLoading, error, createCollection, deleteCollection, toggleFavorite, renameCollection, refetch: fetchCollections }
}
