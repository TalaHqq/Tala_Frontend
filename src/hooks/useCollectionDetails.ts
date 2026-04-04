import { useState, useEffect } from 'react'
import { fetchJSON } from '../utils/api'
import type { Collection } from './useCollections'
import { mockCollections } from './useCollections'

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

const mockAssets: Record<string, Asset[]> = {
  '1': [
    { id: 'a1', name: 'Logo_Final.png', type: 'Image', creator: 'Randy Russell', updatedAt: '2 hours ago', metadata: '2400 x 2400 px', tags: ['Brand', 'Logo'] },
    { id: 'a2', name: 'Typography_Guide.pdf', type: 'Document', creator: 'Sena Duodu', updatedAt: '5 hours ago', metadata: '12 Pages', tags: ['Guidelines', 'Design'] },
    { id: 'a3', name: 'Component_Library.sketch', type: 'Document', creator: 'Randy Russell', updatedAt: '1 day ago', metadata: '42.5 MB', tags: ['UI Kit', 'Sketch'] },
    { id: 'a4', name: 'Brand_Palette.svg', type: 'Image', creator: 'Sena Duodu', updatedAt: '2 days ago', metadata: 'Vector', tags: ['Brand', 'Colors'] },
  ],
  '2': [
    { id: 'v1', name: 'Campaign_Promo.mp4', type: 'Video', creator: 'Bervelyn Amoako', updatedAt: '1 day ago', metadata: '0:30', tags: ['Marketing', 'Video'] },
    { id: 'i1', name: 'Social_Banner_A.jpg', type: 'Image', creator: 'Randy Russell', updatedAt: '2 days ago', metadata: '1200 x 630 px', tags: ['Social', 'Ad'] },
    { id: 'd1', name: 'Product_Launch_PR.docx', type: 'Document', creator: 'Sena Duodu', updatedAt: '3 days ago', metadata: '4 Pages', tags: ['PR', 'Marketing'] },
  ],
  '3': [
    { id: 'd2', name: 'API_Documentation.pdf', type: 'Document', creator: 'System', updatedAt: '3 days ago', metadata: '45 Pages', tags: ['Technical', 'API'] },
    { id: 'i2', name: 'Arch_Diagram.png', type: 'Image', creator: 'Sena Duodu', updatedAt: '4 days ago', metadata: '1920 x 1080 px', tags: ['Architecture', 'Technical'] },
  ],
  '4': [
    { id: 's1', name: 'Ambient_Nature.mp3', type: 'Audio', creator: 'Kofi TALA', updatedAt: '1 week ago', metadata: '3:45', tags: ['Soundscape', 'Audio'], isFavorite: true },
    { id: 's2', name: 'Button_Click.wav', type: 'Audio', creator: 'System', updatedAt: '1 week ago', metadata: '0:01', tags: ['UI Sound', 'Audio'] },
  ]
}

export function useCollectionDetails(collectionId: string | null) {
  const [collection, setCollection] = useState<CollectionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetails = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/collections/${id}`)
      const data = response?.data;
      if (data) {
        setCollection((data.assets && data.assets.length > 0) ? data : {
          ...data,
          assets: mockAssets[id] || []
        })
      }
    } catch (err: any) {
      console.error('Error fetching collection details:', err)
      const mockCollection = mockCollections.find(c => c.id === id)
      if (mockCollection) {
        setCollection({
          ...mockCollection,
          assets: mockAssets[id] || []
        })
      } else {
        setError(err.message || 'Failed to fetch collection details')
      }
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
      // Fallback for mock
      setCollection(prev => prev ? {
        ...prev,
        assets: prev.assets.map(a => a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a)
      } : null)
      return { success: true }
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
      setCollection(prev => prev ? {
        ...prev,
        assets: prev.assets.filter(a => a.id !== assetId)
      } : null)
      return { success: true }
    }
  }

  return { collection, isLoading, error, toggleAssetFavorite, deleteAsset, refetch: () => collectionId && fetchDetails(collectionId) }
}
