import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Aptitude from './pages/Aptitude'
import AptitudeTopic from './pages/AptitudeTopic'
import AptitudeTest from './pages/AptitudeTest'
import DSA from './pages/DSA'
import DSATopic from './pages/DSATopic'
import DSATest from './pages/DSATest'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageQuestions from './pages/admin/ManageQuestions'
import ManageCompanies from './pages/admin/ManageCompanies'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="aptitude" element={<Aptitude />} />
              <Route path="aptitude/topic/:topicId" element={<AptitudeTopic />} />
              <Route path="aptitude/test/:topicId" element={<AptitudeTest />} />
              <Route path="dsa" element={<DSA />} />
              <Route path="dsa/topic/:topicId" element={<DSATopic />} />
              <Route path="dsa/test/:topicId" element={<DSATest />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:companyId" element={<CompanyDetail />} />
              <Route path="profile" element={session ? <Profile /> : <Navigate to="/login" />} />
              <Route path="admin" element={<AdminDashboard />}>
                <Route path="questions" element={<ManageQuestions />} />
                <Route path="companies" element={<ManageCompanies />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
