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
        setHighlightIds((prev) =>
          prev.filter((id) => !newIds.includes(id))
        )
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [activeVisitors, highlightIds])

  if (loading) {
    return <p className="text-center mt-4">Loading visitors...</p>
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center filter grayscale blur-md brightness-75"
        style={{ backgroundImage: "url('/img/main-bg.webp')" }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 min-h-screen flex items-center gap-8 px-10 border border-gray-300">
        
        <div className="flex-shrink-0">
          <img
            src="/img/BJMP-icon.png"
            alt="Logo"
            className="w-64 h-64 object-contain"
          />
        </div>

        <div className="flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full text-lg text-white bg-transparent">
              <thead>
                <tr>
                  <th className="border border-white px-4 py-3 text-left">
                    Visitor Name
                  </th>
                  <th className="border border-white px-4 py-3 text-left">
                    Time In
                  </th>
                </tr>
              </thead>

              <tbody>
                {activeVisitors?.data?.length === 0 && (
                  <tr>
                    <td colSpan="2" className="text-center py-6">
                      No active visitors
                    </td>
                  </tr>
                )}

                {activeVisitors?.data?.map((item) => {
                  const isNew = highlightIds.includes(item._id)

                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors ${
                        isNew
                          ? 'bg-white/25 animate-pulse'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <td className="border border-white px-4 py-3">
                        {item.visitor_info?.name}
                      </td>
                      <td className="border border-white px-4 py-3">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VisitorMonitoringTable
