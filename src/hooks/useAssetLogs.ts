import { useState, useEffect } from 'react'
import { fetchJSON, API_BASE_URL } from '../utils/api'

export interface AssetLog {
  id: string
  activityType: string
  description: string
  createdAt: string
  user: {
    id: string
    fullName?: string
    email?: string
  }
}

export function useAssetLogs(assetId: string | null) {
  const [logs, setLogs] = useState<AssetLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchJSON<any>(`${API_BASE_URL}/api/assets/${id}/asset-logs`);
      const rawData = response?.data || response;
      const logsArray = Array.isArray(rawData) ? rawData : (rawData?.logs || []);
      setLogs(logsArray);
    } catch (err: any) {
      console.error('Error fetching asset logs:', err)
      setError(err.message || 'Failed to fetch activity logs')
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (assetId) {
      fetchLogs(assetId)
    } else {
      setLogs([])
    }
  }, [assetId])

  return { logs, isLoading, error, refetch: () => assetId && fetchLogs(assetId) }
}
