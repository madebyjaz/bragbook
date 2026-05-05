// SignupPage.jsx
// Full page signup form that users are zoomed into when they click
// 'Get Started' on the homepage canvas.
// Handles new user account creation via Firebase Authentication.

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const SignupPage = ({ onSwitchToLogin }) => {
  const navigate = useNavigate()
  // Form field state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Field Validation before calling the firebase
  const validate = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
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
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

// Save user profile data to Firestore under users/:uid
      await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: name,
          email: email,
          tagline: '',
          bio: '',
          location: '',
          avatar: '',
          socials: {
              linkedin: '',
              github: '',
              twitter: '',
              portfolio: '',
          },
          createdAt: new Date().toISOString()
      })

      // Redirect to portfolio after successful account creation
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

      {/* Signup card */}
      <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'>

        {/* Header */}
        <h2 className='text-2xl font-bold text-gray-900 mb-1'>
          Create your account
        </h2>
        <p className='text-gray-500 text-sm mb-6'>
          Start building your impact portfolio on Bragbook
        </p>

        {/* Error message — only shown when there is an error */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4'>
            {error}
          </div>
        )}

        {/* Signup form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          {/* Name field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your name'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

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
              placeholder='At least 6 characters'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

          {/* Confirm password field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Re-enter your password'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

          {/* Submit button — shows loading state while request is pending */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        {/* Switch to login */}
        <p className='text-sm text-center text-gray-500 mt-4'>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className='text-purple-700 font-medium hover:underline'
          >
            Log in
          </button>
        </p>

      </div>
    </div>
  )
}

export default SignupPage