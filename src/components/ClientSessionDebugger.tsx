'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function ClientSessionDebugger() {
  const { user, profile, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      if (process.env.NODE_ENV !== 'development') return

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        setDebugInfo({
          authUser: !!user,
          userEmail: user?.email,
          profileExists: !!profile,
          profileRole: profile?.role,
          sessionExists: !!session,
          sessionUser: session?.user?.email,
          loading,
          error: error?.message,
          cookies: document.cookie,
          localStorage: {
            authToken: localStorage.getItem('khama-auth-token'),
          }
        })
      } catch (err) {
        setDebugInfo({ error: err instanceof Error ? err.message : 'Unknown error' })
      }
    }

    checkSession()
  }, [user, profile, loading])

  if (process.env.NODE_ENV !== 'development' || !debugInfo) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Session Debug</h3>
      <pre className="text-xs overflow-auto max-h-32">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={() => setDebugInfo(null)}
        className="mt-2 text-red-400 hover:text-red-300"
      >
        ✕ Close
      </button>
    </div>
  )
}
