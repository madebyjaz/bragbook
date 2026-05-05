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
import EducationCreate from "./components/forms/create_edu";
import EducationView from "./components/forms/view_edu";
import EducationUpdate from "./components/forms/update_edu";
import EducationDelete from "./components/forms/delete_edu";

import CreateAchievement from "./components/forms/Achievement_create";
import UpdateAchievement from "./components/forms/update_achievement";

import EditProfile from './components/forms/edit_profile'

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

        {/* All education pages */}
        <Route path="/education/create" element={<EducationCreate />} />
        <Route path="/education/view/:entryId" element={<EducationView />} />
        <Route path="/education/edit/:entryId" element={<EducationUpdate />} />
        <Route path="/education/delete/:entryId" element={<EducationDelete />} />

        {/* All achievement pages */}
        <Route path="/achievements/create" element={<CreateAchievement />} />
        <Route path="/achievements/edit/:entryId" element={<UpdateAchievement />} />

        {/* edit profile page */}
        <Route path="/profile/edit" element={<EditProfile />} />

        {/* Public portfolio: shareable read-only view (#77) */}
        <Route path='/u/:userId' element={<PublicPortfolio />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
