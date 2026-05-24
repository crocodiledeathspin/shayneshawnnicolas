import type { FC } from 'react'

interface ToastMessageProps {
  message: string
  isVisible: boolean
  isFailed?: boolean
  onClose: () => void
}

const ToastMessage: FC<ToastMessageProps> = ({
  message,
  isVisible,
  isFailed,
  onClose,
}) => {
  if (!isVisible) return null
  return (
    <div
      className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        isFailed ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="text-white font-bold">
          ×
        </button>
      </div>
    </div>
  )
}

export default ToastMessage
