import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  // ✅ Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-session`, { withCredentials: true })
        if (res.data.session) {
          navigate('/home') // already logged in
        }
      } catch (err) {
        console.error('Session check error:', err)
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      )

      if (res.data.success) {
        navigate('/home') // redirect after login
      } else {
        setError(res.data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 relative overflow-hidden">

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-300 text-sm">Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl"
        >
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Forgot Password */}
          <div className="mb-4 text-right">
            <a href="#" className="text-sm text-white/70 hover:text-white transition">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-medium text-slate-900 bg-white/90 hover:bg-white transition disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Don’t have an account?{' '}
            <a href="/register" className="text-white font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
