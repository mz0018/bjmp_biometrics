import { useState, useEffect } from 'react'
import useVisitorMonitoring from '../hooks/useVisitorMonitoring'

const VisitorMonitoringTable = () => {
  const { loading, activeVisitors } = useVisitorMonitoring()
  const [highlightIds, setHighlightIds] = useState([])

  useEffect(() => {
    if (!activeVisitors?.data) return

    const newIds = activeVisitors.data
      .map((item) => item._id)
      .filter((id) => !highlightIds.includes(id))

    if (newIds.length > 0) {
      setHighlightIds((prev) => [...prev, ...newIds])

      const timer = setTimeout(() => {
        setHighlightIds((prev) => prev.filter((id) => !newIds.includes(id)))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [activeVisitors, highlightIds])

  if (loading) {
    return <p className="text-center mt-4">Loading visitors...</p>
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Active Visitors</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Visitor Name</th>
              <th className="border px-3 py-2 text-left">Address</th>
              <th className="border px-3 py-2 text-left">Contact</th>
              <th className="border px-3 py-2 text-left">Gender</th>
              <th className="border px-3 py-2 text-left">Inmate</th>
              <th className="border px-3 py-2 text-left">Relationship</th>
              <th className="border px-3 py-2 text-left">Similarity</th>
              <th className="border px-3 py-2 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {activeVisitors?.data?.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No active visitors
                </td>
              </tr>
            )}

            {activeVisitors?.data?.map((item) => {
              const isNew = highlightIds.includes(item._id)
              return (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    isNew ? 'bg-green-100 animate-pulse' : ''
                  }`}
                >
                  <td className="border px-3 py-2">{item.visitor_info?.name}</td>
                  <td className="border px-3 py-2">{item.visitor_info?.address}</td>
                  <td className="border px-3 py-2">{item.visitor_info?.contact}</td>
                  <td className="border px-3 py-2">{item.visitor_info?.gender}</td>
                  <td className="border px-3 py-2">{item.selected_inmate?.inmate_name}</td>
                  <td className="border px-3 py-2">{item.selected_inmate?.relationship}</td>
                  <td className="border px-3 py-2">
                    {(item.similarity * 100).toFixed(2)}%
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VisitorMonitoringTable
