import { useState } from 'react'

export const useRefresh = (initial = false) => {
  const [refresh, setRefresh] = useState(initial)
  const handleRefresh = () => setRefresh((prev) => !prev)
  return { refresh, handleRefresh }
}
