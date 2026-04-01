// App.jsx
// Root component of the Bragbook app.
// Sets up React Router with base routes.
// Additional routes will be added in issue #58.

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePageCanvas from './components/HomePageCanvas'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import Usr_Portfolio from './components/Usr_Portfolio'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage: main canvas with hero and ZUI experience */}
        <Route path='/' element={<HomePageCanvas />} />

        {/* Signup page: navigated to when user clicks Get Started */}
        <Route path='/signup' element={<SignupPage />} />

        {/* Login page: navigated to when user clicks Log In */}
        <Route path='/login' element={<LoginPage />} />
          
        {/* Portfolio page: user's profile and entries */}
        <Route path='/portfolio' element={<Usr_Portfolio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App