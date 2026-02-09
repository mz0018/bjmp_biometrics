import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const useVisitorMonitoring = () => {
  const [loading, setLoading] = useState(true)
  const [activeVisitors, setActiveVisitors] = useState([])

  const fetchActiveVisitors = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/activeVisitors`
      )
      setActiveVisitors(response.data)
      console.log('Active visitors:', response.data)
    } catch (error) {
      console.error('Error fetching active visitors:', error)
    } finally {
      setLoading((prev) => (prev ? false : prev))
    }
  }, [])

  useEffect(() => {
    fetchActiveVisitors()

    const interval = setInterval(() => {
      fetchActiveVisitors()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchActiveVisitors])

  return { loading, activeVisitors }
}

export default useVisitorMonitoring
