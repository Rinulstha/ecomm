import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const LoginPage = () => {
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const ok = await login(form.email, form.password)
  if (ok) {
    // redirect based on role
    const user = useAuthStore.getState().user
    if (user?.role === 'ADMIN') {
      navigate('/admin/products')
    } else {
      navigate('/products')
    }
  }
}

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-[#0f1117] dark:via-[#111827] dark:to-[#0b1120] flex items-center justify-center p-4 transition-colors duration-300">
  
  <div
    className="
      w-full max-w-md rounded-3xl
      border border-gray-200 dark:border-white/10
      bg-white/80 dark:bg-white/5
      backdrop-blur-xl
      shadow-2xl
      p-8
      transition-colors duration-300
    "
  >
    
    {/* Heading */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Login to continue to your account
      </p>
    </div>

    {/* Error */}
    {error && (
      <div
        className="
          mb-5 rounded-xl
          border border-red-200 dark:border-red-500/20
          bg-red-50 dark:bg-red-500/10
          px-4 py-3 text-sm
          text-red-600 dark:text-red-400
        "
      >
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Email */}
      <div>
        <label
          className="
            mb-2 block text-sm font-medium
            text-gray-700 dark:text-gray-300
          "
        >
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          className="
            w-full rounded-xl
            border border-gray-300 dark:border-white/10
            bg-white dark:bg-white/5
            px-4 py-3 text-sm
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            outline-none transition-all duration-200

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100 dark:focus:ring-blue-500/20
          "
        />
      </div>

      {/* Password */}
      <div>
        <label
          className="
            mb-2 block text-sm font-medium
            text-gray-700 dark:text-gray-300
          "
        >
          Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          className="
            w-full rounded-xl
            border border-gray-300 dark:border-white/10
            bg-white dark:bg-white/5
            px-4 py-3 text-sm
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            outline-none transition-all duration-200

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100 dark:focus:ring-blue-500/20
          "
        />
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <button
          type="button"
          className="
            text-sm text-blue-600 dark:text-blue-400
            hover:underline
          "
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full rounded-xl
          bg-black dark:bg-white
          py-3 text-sm font-semibold
          text-white dark:text-black

          transition-all duration-300
          hover:scale-[1.01]
          active:scale-[0.99]

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>

    {/* Footer */}
    <p
      className="
        mt-8 text-center text-sm
        text-gray-500 dark:text-gray-400
      "
    >
      Don&apos;t have an account?{" "}
      <Link
        to="/register"
        className="
          font-medium
          text-blue-600 dark:text-blue-400
          hover:underline
        "
      >
        Register
      </Link>
    </p>
  </div>
</div>
  )
}

export default LoginPage