import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  // TEMP auth check (we'll improve this later)
  const isLoggedIn = true

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
