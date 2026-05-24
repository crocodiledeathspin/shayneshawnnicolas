import type { FC } from 'react'

interface SubmitButtonProps {
  label: string
  loading?: boolean
  loadingLabel?: string
  className?: string
}

const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  loading,
  loadingLabel = 'Loading...',
  className = 'w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition',
}) => (
  <button type="submit" disabled={loading} className={className}>
    {loading ? loadingLabel : label}
  </button>
)

export default SubmitButton
