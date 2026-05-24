import { useNavigate } from 'react-router-dom'

const BackButton = ({ to }: { to: string }) => {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="text-orange-600 hover:underline font-medium"
    >
      ← Back
    </button>
  )
}

export default BackButton
