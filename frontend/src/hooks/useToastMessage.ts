import { useCallback, useState } from 'react'

export const useToastMessage = (
  initialMessage = '',
  initialVisible = false,
  initialFailed = false,
) => {
  const [message, setMessage] = useState(initialMessage)
  const [isVisible, setIsVisible] = useState(initialVisible)
  const [isFailed, setIsFailed] = useState(initialFailed)

  const showToastMessage = useCallback(
    (msg: string, failed = false) => {
      setMessage(msg)
      setIsFailed(failed)
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 3000)
    },
    [],
  )

  const closeToastMessage = () => setIsVisible(false)

  return { message, isVisible, isFailed, showToastMessage, closeToastMessage }
}
