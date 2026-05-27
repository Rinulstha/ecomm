import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const RegisterPage = () => {
  const { register, isLoading, error } = useAuthStore()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await register(form.username, form.email, form.password, form.role)
    if (ok) setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
          <p className="text-gray-500 mb-6">
            We sent a verification link to{' '}
            <span className="font-medium text-blue-600">{form.email}</span>.
            Click the link to activate your account.
          </p>
          <p className="text-sm text-gray-400">
            Already verified?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 dark:from-[#0f1117] dark:via-[#111827] dark:to-[#0b1120] p-4">

  {/* Card */}
  <div
    className="
      w-full max-w-md
      max-h-[90vh]
      overflow-y-auto

      rounded-3xl
      border border-gray-200 dark:border-white/10
      bg-white/80 dark:bg-white/5
      backdrop-blur-xl
      shadow-2xl
      p-8

      transition-all duration-300
    "
  >

    {/* Heading */}
    <div className="mb-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Create Account
      </h1>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Username */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Username
        </label>

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="johndoe"
          className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
          className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20"
        />
      </div>

      {/* Role */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Role
        </label>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20"
        >
          <option className="bg-white dark:bg-[#111827]" value="USER">
            User
          </option>
          <option className="bg-white dark:bg-[#111827]" value="ADMIN">
            Admin
          </option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-black dark:bg-white py-3 text-sm font-semibold text-white dark:text-black transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>

    {/* Footer */}
    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
        Login
      </Link>
    </p>

  </div>
</div>
  )
}

export default RegisterPage