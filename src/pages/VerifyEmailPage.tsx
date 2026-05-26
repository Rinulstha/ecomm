import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const VerifyEmailPage = () => {
  const { verificationToken } = useParams<{ verificationToken: string }>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const verify = async () => {
      try {
        await axiosInstance.get(`/users/verify-email/${verificationToken}`)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    if (verificationToken) verify()
  }, [verificationToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">

        {status === 'loading' && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying your email</h2>
            <p className="text-gray-400 text-sm">Please wait...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email verified!</h2>
            <p className="text-gray-500 mb-6">
              Your account is now active. You can log in.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Go to login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification failed</h2>
            <p className="text-gray-500 mb-6">
              The link may have expired or is invalid.
            </p>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Register again
            </Link>
          </>
        )}

      </div>
    </div>
  )
}

export default VerifyEmailPage