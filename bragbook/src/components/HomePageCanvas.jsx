// HomePageCanvas.jsx
// The root container that the entire Bragbook app lives inside.
// This is the full-screen canvas that holds all content zones such as 
// hero, auth panels, and brag grid — as zoomable regions.
// Every other component on the homepage gets placed inside this canvas.

import { useState } from 'react'
import ZoomWrapper from './ZoomWrapper'
import { useNavigate } from 'react-router-dom'

const HomePageCanvas = () => {

  // useNavigate hook for programmatic navigation to other pages
  const navigate = useNavigate()

  // Tracks which zone is currently zoomed in
  // null means no zone is active — showing the full canvas overview
  const [activeZone, setActiveZone] = useState(null)

  // Zooms into a specific zone when clicked
  const handleZoomIn = (zone) => {
    setActiveZone(zone)
  }

  // Zooms back out to the full canvas overview when background is clicked
  const handleZoomOut = () => {
    setActiveZone(null)
  }

  return (
    // Outer canvas — fills the full viewport with no scrollbars
    // overflow-hidden prevents content from spilling outside the canvas
    // bg-gradient applies once Tailwind (#25) is merged
    <div
      className='relative w-screen h-screen overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-400 via-blue-500 to-purple-600'
      onClick={handleZoomOut}
    >

      {/* Hero Zone — title and tagline */}
      {/* ZoomWrapper provides the smooth zoom-in animation from issue #37 */}
      <ZoomWrapper
        isZoomed={activeZone === 'hero'}
        onClick={(e) => {
          // stopPropagation prevents the canvas onClick from firing
          // when clicking inside a zone
          e.stopPropagation()
          handleZoomIn('hero')
        }}
      >
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <h1 className='text-white text-4xl font-bold'>Bragbook.cv</h1>
          <p className='text-white text-lg mt-4'>Your wins deserve to be seen</p>
        </div>
      </ZoomWrapper>

      {/* Auth Zone — login and signup buttons */}
      {/* Button click logic wired up in issues #51 and #52 */}
      <ZoomWrapper
        isZoomed={activeZone === 'auth'}
        onClick={(e) => {
          e.stopPropagation()
          handleZoomIn('auth')
        }}
      >
        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4'>
          {/* Navigates to signup page once #51 is complete */}
          <button
            onClick={() => navigate('/signup')}
            className='px-6 py-2 bg-white text-purple-900 rounded-full font-semibold'
          >
            Get Started
          </button>
          {/* Log In — will navigate to login page once #52 is complete */}
          <button className='px-6 py-2 border border-white text-white rounded-full font-semibold'>
            Log In
          </button>
        </div>
      </ZoomWrapper>

      {/* Brag Grid Zone — displays the user's brag cards after login */}
      {/* Hidden until user is logged in — content coming in issues #53 and #55 */}
      <ZoomWrapper
        isZoomed={activeZone === 'bragGrid'}
        onClick={(e) => {
          e.stopPropagation()
          handleZoomIn('bragGrid')
        }}
      >
        <div className='absolute top-10 right-10'>
          {/* Brag card grid will be built in issue #48 */}
        </div>
      </ZoomWrapper>

    </div>
  )
}

export default HomePageCanvas