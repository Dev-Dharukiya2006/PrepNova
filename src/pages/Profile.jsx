import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { updateUserProfile, getUserProgress } from '../lib/supabase'
import {
  HiOutlineUser, HiOutlineMail, HiOutlineAcademicCap,
  HiOutlineOfficeBuilding, HiOutlineBriefcase, HiOutlineCheck,
  HiOutlineX, HiOutlinePencil, HiOutlineStar
} from 'react-icons/hi'
import toast from 'react-hot-toast'

const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other']

const Profile = () => {
  const { user, profile: initialProfile, refreshProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '', college: '', branch: '', year: '',
    skills: '', target_company: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const progressData = await getUserProgress(user.id)
        setProgress(progressData)
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
      setFormData({
        full_name: initialProfile.full_name || '',
        college: initialProfile.college || '',
        branch: initialProfile.branch || '',
        year: initialProfile.year?.toString() || '',
        skills: (initialProfile.skills || []).join(', '),
        target_company: initialProfile.target_company || ''
      })
      setLoading(false)
    }
  }, [initialProfile])

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      const updates = {
        full_name: formData.full_name,
        college: formData.college,
        branch: formData.branch,
        year: parseInt(formData.year) || null,
        skills: skillsArray,
        target_company: formData.target_company,
        updated_at: new Date().toISOString()
      }
      await updateUserProfile(user.id, updates)
      const updated = { ...profile, ...updates }
      setProfile(updated)
      setEditing(false)
      await refreshProfile()
      toast.success('Profile updated!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full animate-spin"
          style={{ border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8B5CF6' }} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Aurora Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="aurora-banner rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="aurora-orb w-48 h-48 -top-8 right-8 opacity-25"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>
            {initials}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{displayName}</h1>
            <p className="text-white/70 mt-1">{profile?.email || user?.email || ''}</p>
            <div className="flex gap-2 mt-2">
              {profile?.branch && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{profile.branch}</span>
              )}
              {profile?.year && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{profile.year}{['st','nd','rd','th'][profile.year-1]} Year</span>
              )}
              {profile?.college && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full hidden md:inline">{profile.college}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2">
          <div className="card-aurora p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">Profile Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
                  <HiOutlinePencil className="w-4 h-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-dark-500 hover:text-red-500 border border-dark-200 dark:border-dark-700 transition-colors">
                    <HiOutlineX className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
                    {saving
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <HiOutlineCheck className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
                  <HiOutlineUser className="w-4 h-4" style={{ color: '#8B5CF6' }} /> Full Name
                </label>
                {editing
                  ? <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="input-field" placeholder="Enter your full name" />
                  : <p className="text-dark-900 dark:text-white font-medium">{profile?.full_name || <span className="text-dark-400 italic">Not set</span>}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
                  <HiOutlineMail className="w-4 h-4" style={{ color: '#06B6D4' }} /> Email
                </label>
                <p className="text-dark-900 dark:text-white">{profile?.email || user?.email || '-'}</p>
              </div>

              {/* College + Branch */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
                    <HiOutlineAcademicCap className="w-4 h-4" style={{ color: '#3B82F6' }} /> College
                  </label>
                  {editing
                    ? <input type="text" name="college" value={formData.college} onChange={handleChange} className="input-field" placeholder="Your college" />
                    : <p className="text-dark-900 dark:text-white">{profile?.college || <span className="text-dark-400 italic">Not set</span>}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
                    <HiOutlineOfficeBuilding className="w-4 h-4" style={{ color: '#8B5CF6' }} /> Branch
                  </label>
                  {editing
                    ? <select name="branch" value={formData.branch} onChange={handleChange} className="input-field">
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    : <p className="text-dark-900 dark:text-white">{profile?.branch || <span className="text-dark-400 italic">Not set</span>}</p>}
                </div>
              </div>

              {/* Year + Target Company */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
                    <HiOutlineBriefcase className="w-4 h-4" style={{ color: '#06B6D4' }} /> Year
                  </label>
                  {editing
                    ? <select name="year" value={formData.year} onChange={handleChange} className="input-field">
                        <option value="">Select Year</option>
                        {[1,2,3,4].map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
                      </select>
                    : <p className="text-dark-900 dark:text-white">
                        {profile?.year ? `${profile.year}${['st','nd','rd','th'][profile.year-1]} Year` : <span className="text-dark-400 italic">Not set</span>}
                      </p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
                    <HiOutlineStar className="w-4 h-4" style={{ color: '#F59E0B' }} /> Target Company
                  </label>
                  {editing
                    ? <input type="text" name="target_company" value={formData.target_company} onChange={handleChange} className="input-field" placeholder="Dream company" />
                    : <p className="text-dark-900 dark:text-white">{profile?.target_company || <span className="text-dark-400 italic">Not set</span>}</p>}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-sm font-medium text-dark-600 dark:text-dark-300 mb-2 block">
                  Skills (comma separated)
                </label>
                {editing
                  ? <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                      className="input-field" placeholder="JavaScript, Python, React, Java..." />
                  : <div className="flex flex-wrap gap-2">
                      {(profile?.skills || []).length > 0
                        ? profile.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-full text-sm"
                              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }}>
                              {skill}
                            </span>
                          ))
                        : <span className="text-dark-400 italic text-sm">No skills added yet</span>}
                    </div>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-5">
          {/* Progress */}
          <div className="card-aurora p-5">
            <h3 className="text-base font-bold text-dark-900 dark:text-white mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-dark-500 dark:text-dark-400">Aptitude</span>
                  <span className="font-semibold text-dark-900 dark:text-white">
                    {progress?.aptitude_completed || 0}/{progress?.aptitude_total || 0}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <div className="h-full rounded-full progress-aurora transition-all duration-500"
                    style={{ width: progress?.aptitude_total ? `${(progress.aptitude_completed / progress.aptitude_total) * 100}%` : '0%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-dark-500 dark:text-dark-400">DSA</span>
                  <span className="font-semibold text-dark-900 dark:text-white">
                    {progress?.dsa_completed || 0}/{progress?.dsa_total || 0}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: progress?.dsa_total ? `${(progress.dsa_completed / progress.dsa_total) * 100}%` : '0%',
                      background: 'linear-gradient(90deg, #06B6D4, #14B8A6)'
                    }} />
                </div>
              </div>
              <div className="pt-3 border-t border-dark-100 dark:border-dark-700">
                <div className="flex justify-between">
                  <span className="text-sm text-dark-500">Total Tests</span>
                  <span className="font-bold aurora-text">{progress?.total_tests || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="card-aurora p-5">
            <h3 className="text-base font-bold text-dark-900 dark:text-white mb-4">Account</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Member since</span>
                <span className="font-medium text-dark-900 dark:text-white">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Role</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold capitalize"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                  {profile?.role || 'student'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
