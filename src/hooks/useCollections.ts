import { useState, useEffect } from 'react'
import { fetchJSON, API_BASE_URL } from '../utils/api'

export interface Collection {
  id: string
  title: string
  description?: string
  assetCount?: number
  updatedAt?: string
  isFavorite?: boolean
  ownerId?: string
}

const FAVORITES_KEY = 'tala_favorite_collections';

export function useCollections(searchQuery: string = '', page: number = 1, perPage: number = 20) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getFavs = (): string[] => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveFavs = (favs: string[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  };

  const fetchCollections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('perPage', perPage.toString());
      if (searchQuery) {
        queryParams.append('q', searchQuery);
      }
      
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections?${queryParams.toString()}`);
      console.log('GET /api/collections response:', response);
      
      // Handle different possible response structures
      let collectionsArray: any[] = [];
      if (Array.isArray(response)) {
        collectionsArray = response;
      } else if (response && Array.isArray(response.data)) {
        collectionsArray = response.data;
      } else if (response && Array.isArray(response.collections)) {
        collectionsArray = response.collections;
      } else if (response && response.data && Array.isArray(response.data.collections)) {
        collectionsArray = response.data.collections;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        collectionsArray = response.data.data;
      }
      
      const favs = getFavs();

      const newCollections: Collection[] = collectionsArray.map((c: any, index: number) => {
        const id = c.id || c._id || `coll-${index}-${Date.now()}`;
        return {
          id,
          title: c.title || 'Untitled Collection',
          description: c.description || '',
          assetCount: c.assetCount !== undefined ? c.assetCount : (c.assets ? c.assets.length : 0),
          updatedAt: c.updatedAt || c.updated_at,
          isFavorite: favs.includes(id),
          ownerId: c.userId || c.ownerId
        };
      });

      if (page === 1) {
        setCollections(newCollections);
      } else {
        setCollections(prev => {
          const combined = [...prev, ...newCollections];
          const seen = new Set();
          return combined.filter(c => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
          });
        });
      }
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      setCollections([]);
      setError(err.message || 'Failed to retrieve collections');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [searchQuery, page, perPage])

  const createCollection = async (title: string, description: string) => {
    try {
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/create`, {
        method: 'POST',
        body: JSON.stringify({ title, description })
      })
      console.log('POST /api/collections/create response:', response);
      const rawCollection = response?.data || response;
      if (!rawCollection) throw new Error('No data returned')
      
      const newCollection: Collection = {
        id: rawCollection.id || rawCollection._id,
        title: rawCollection.title,
        description: description,
        assetCount: 0,
        updatedAt: new Date().toISOString(),
        isFavorite: false
      };

      setCollections(prev => [newCollection, ...prev]);
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
    const favs = getFavs();
    const newFavs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    saveFavs(newFavs);
    
    setCollections(prev => prev.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to toggle favorite' 
    };
  }
}
  const renameCollection = async (id: string, title: string) => {
    try {
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title })
      })
      const updated = response?.data || response;
      const newTitle = updated?.title || title;
      setCollections(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c))
      return { success: true }
    } catch (err: any) {
      console.error('Error renaming collection:', err)
      return { success: false, error: err.message };
    }
  }

  return { collections, isLoading, error, createCollection, deleteCollection, toggleFavorite, renameCollection, refetch: fetchCollections }
}
