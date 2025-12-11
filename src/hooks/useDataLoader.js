import { useState, useEffect } from 'react'

// Hook pour charger les données JSON
export const useDataLoader = (filename) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/data/${filename}`)
        if (!response.ok) throw new Error(`Failed to load ${filename}`)
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filename])

  return { data, loading, error }
}

// Hook pour chercher dans les données
export const useDataFinder = () => {
  const { data: supports } = useDataLoader('supports.json')
  const { data: formats } = useDataLoader('formats.json')
  const { data: prices } = useDataLoader('prices.json')
  const { data: audiences } = useDataLoader('audiences.json')

  const findSupportById = (id) => supports?.supports?.find(s => s.id === id)
  const findFormatsBySupport = (supportId) => formats?.formats?.filter(f => f.supportIds?.includes(supportId)) || []
  const findFormatById = (id) => formats?.formats?.find(f => f.id === id)
  const findPricesBySupportAndFormat = (supportId, formatId) => prices?.prices?.find(p => p.supportId === supportId && p.formatId === formatId)
  const findAudiencesBySupportAndFormat = (supportId, formatId) => audiences?.audiences?.find(a => a.supportId === supportId && a.formatId === formatId)

  return {
    supports,
    formats,
    prices,
    audiences,
    findSupportById,
    findFormatsBySupport,
    findFormatById,
    findPricesBySupportAndFormat,
    findAudiencesBySupportAndFormat,
  }
}
