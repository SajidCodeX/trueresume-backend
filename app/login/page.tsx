'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        setSuccess('Account created! Please check your email to confirm.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/">
            <div className="flex items-center gap-0 cursor-pointer w-fit">
              <div className="bg-[#1B2B6B] px-3 py-2">
                <span className="font-black text-white text-sm uppercase">TRUE</span>
              </div>
              <div style={{ border: '2.5px solid #1B2B6B' }} className="bg-white px-3 py-2">
                <span className="font-black text-[#1B2B6B] text-sm uppercase">RESUME</span>
              </div>
            </div>
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-black text-[#1A1A2E] text-center mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            {isSignUp ? 'Start analyzing your resume for free' : 'Sign in to your account'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-sm font-black text-[#1A1A2E] mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A6CF7]"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-black text-[#1A1A2E] mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A6CF7]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-black text-[#1A1A2E] mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A6CF7]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B2B6B] text-white py-3 font-black hover:bg-[#141f4d] transition-colors rounded-lg disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}
              className="text-[#4A6CF7] font-black hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Your data is secure and never shared
          </p>
        </div>
      </div>
    </div>
  )
}