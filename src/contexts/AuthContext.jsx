import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserProfile, getUserProgress, signUp, signIn, signOut } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId) => {
    try {
      const profileData = await getUserProfile(userId)
      setProfile(profileData)
      return profileData
    } catch (error) {
      console.error('Error loading profile:', error)
      return null
    }
  }

  const loadProgress = async (userId) => {
    try {
      const progressData = await getUserProgress(userId)
      setProgress(progressData)
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        loadProgress(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
        await loadProgress(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setProgress(null)
      } else if (event === 'USER_UPDATED' && session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const data = await signIn(email, password)
    if (data?.user) {
      setUser(data.user)
      const profileData = await loadProfile(data.user.id)
      await loadProgress(data.user.id)
      return { success: true, data: { user: profileData || data.user } }
    }
    return { success: false }
  }

  const register = async (userData) => {
    const data = await signUp(userData.email, userData.password, {
      full_name: userData.full_name,
      college: userData.college,
      branch: userData.branch,
      year: userData.year ? parseInt(userData.year) : null
    })
    if (data?.user) {
      setUser(data.user)
      // Wait briefly for DB insert to propagate then load
      await new Promise(r => setTimeout(r, 500))
      const profileData = await loadProfile(data.user.id)
      return { success: true, data: { user: profileData || data.user } }
    }
    return { success: false }
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setProfile(null)
    setProgress(null)
  }

  const refreshProgress = async () => {
    if (user) await loadProgress(user.id)
  }

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      progress,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshProgress,
      refreshProfile,
      setProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
