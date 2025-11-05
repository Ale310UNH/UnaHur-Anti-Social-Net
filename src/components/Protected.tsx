import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedProps {
  children: JSX.Element
}

function Protected({ children }: ProtectedProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default Protected