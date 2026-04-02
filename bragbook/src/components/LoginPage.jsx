// LoginPage.jsx
// Full page login form that users are navigated to when they click
// 'Log In' on the homepage canvas.
// Handles existing user authentication via Firebase Authentication.

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {

  // Form field state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // UI state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // useNavigate hook for redirecting after successful login
  const navigate = useNavigate()

  // Validates fields before calling Firebase
  const validate = () => {
    if (!email || !password) {
      setError('Please fill in all fields.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)

    try {
      // Sign in existing user via Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password)

      // 0redirect to dashboard once #58 routes are set up
      navigate('/portfolio')


    } catch (err) {
      // Display Firebase error message to the user
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Full screen page with gradient background matching the canvas
    <div className='min-h-screen bg-gradient-to-r from-teal-400 via-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center px-4'>

      {/* Login card */}
      <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'>

        {/* Header */}
        <h2 className='text-2xl font-bold text-gray-900 mb-1'>
          Welcome back
        </h2>
        <p className='text-gray-500 text-sm mb-6'>
          Sign in to your Bragbook portfolio
        </p>

        {/* Error message — only shown when there is an error */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          {/* Email field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@email.com'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

          {/* Password field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

          {/* Submit button — shows loading state while request is pending */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        {/* Switch to signup */}
        <p className='text-sm text-center text-gray-500 mt-4'>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className='text-purple-700 font-medium hover:underline'
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  )
}

export default LoginPage