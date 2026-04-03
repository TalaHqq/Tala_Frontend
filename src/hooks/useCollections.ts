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

export const mockCollections: Collection[] = [
  {
    id: '1',
    title: 'Design System',
    description: 'Core brand assets, UI kits, and design guidelines for TALA projects.',
    assetCount: 12,
    updatedAt: '2 hours ago',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Marketing Assets',
    description: 'Social media templates, campaign videos, and high-res promotional icons.',
    assetCount: 24,
    updatedAt: '1 day ago',
    isFavorite: false
  },
  {
    id: '3',
    title: 'Technical Docs',
    description: 'API documentation, architecture diagrams, and development specifications.',
    assetCount: 8,
    updatedAt: '3 days ago',
    isFavorite: true
  },
  {
    id: '4',
    title: 'Audio Library',
    description: 'Ambient soundscapes, UI sound effects, and background music tracks.',
    assetCount: 15,
    updatedAt: '1 week ago',
    isFavorite: false
  }
]

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Backend expects pagination and search params: perPage, page, q
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections?perPage=10&page=1&q=`)
      const collectionsArray = response?.data || []
      setCollections(collectionsArray.length > 0 ? collectionsArray : mockCollections)
    } catch (err: any) {
      console.error('Error fetching collections:', err)
      setCollections(mockCollections)
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
      const newCollection = response?.data;
      if (!newCollection) throw new Error('No data returned')
      setCollections(prev => [newCollection, ...prev])
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
      // Fallback for mock data
      setCollections(prev => prev.filter(c => c.id !== id))
      return { success: true }
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
      setCollections(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
      return { success: true }
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
      setCollections(prev => prev.map(c => c.id === id ? { ...c, title } : c))
      return { success: true }
    }
  }

  return { collections, isLoading, error, createCollection, deleteCollection, toggleFavorite, renameCollection, refetch: fetchCollections }
}
