// App.jsx
// Root component of the Bragbook app.
// Sets up React Router with base routes.
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Hero from './components/Hero'
import HomePageCanvas from './components/HomePageCanvas'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import Usr_Portfolio from './components/Usr_Portfolio'
import Discover from "./components/discover";
import PublicPortfolio from './components/PublicPortfolio'

// import ProtectedRoutes from './ProtectedRoutes'

const AuthenticatedRoute = () => {
    if (!auth) {
        //redirect to this route after login
        return navigate('/login')
      }
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage: main canvas with hero and ZUI experience */}
        <Route path='/' element={<Hero />} />

        {/* Discover page: shows preview cards of some user portfolios */}
        <Route path="/discover" element={<Discover />} />

        {/* Signup page: navigated to when user clicks Get Started */}
        <Route path='/signup' element={<SignupPage />} />
        {/* Login page: navigated to when user clicks Log In */}
        <Route path='/login' element={<LoginPage />} />
        {/* Portfolio page: user's profile and entries */}
        <Route path='/portfolio' element={<Usr_Portfolio />} />
        {/* Public portfolio: shareable read-only view (#77) */}
        <Route path='/u/:userId' element={<PublicPortfolio />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
