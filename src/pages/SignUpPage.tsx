import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useSignUp } from '../hooks/useSignUp'

export function SignUpPage() {
  const navigate = useNavigate()
  const { isLoading, error: apiError, submit } = useSignUp()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })

  const validateField = (field: keyof typeof formData, value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'This field is required' }))
      return false
    }
    if (field === 'fullName' && value.trim().length < 2) {
      setErrors(prev => ({ ...prev, fullName: 'Full name must be at least 2 characters' }))
      return false
    }
    if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }))
      return false
    }
    if (field === 'password') {
      if (value.length < 8) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }))
        return false
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(value)) {
        setErrors(prev => ({ ...prev, password: 'Must include uppercase, lowercase, number, and symbol' }))
        return false
      }
    }
    if (field === 'confirmPassword' && value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      return false
    }
    setErrors(prev => ({ ...prev, [field]: '' }))
    return true
  }

  const handleBlur = (field: keyof typeof formData) => {
    validateField(field, formData[field])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const isFullNameValid = validateField('fullName', formData.fullName)
    const isEmailValid = validateField('email', formData.email)
    const isPasswordValid = validateField('password', formData.password)
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword)

    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    const { success } = await submit(formData)
    if (success) {
      navigate('/loading')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column (Form) */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-[45%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-8">

          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground font-sans">TALA</h1>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Create your account
            </h2>
          </div>

          <div className="space-y-6">
            {/* Sign Up Form */}
            {apiError && (
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">{apiError}</h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Samuel Agyei"
                  type="text"
                  className={`h-9 border-input bg-background text-foreground ${errors.fullName ? 'border-red-500' : ''}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  id="email"
                  placeholder="sagyei@tala.com"
                  type="email"
                  className={`h-9 border-input bg-background text-foreground ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`pr-10 h-9 border-input bg-background text-foreground ${errors.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={`pr-10 h-9 border-input bg-background text-foreground ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </div>

          {/* Footer Text */}
          <div className="space-y-4 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="underline underline-offset-4 hover:text-foreground">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline underline-offset-4 hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
            <div className="text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
                Log in
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column (Visual / Gradient) */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center p-6">
        <div className="relative w-full h-full rounded-[2.5rem] bg-gradient-to-tr from-[#E08210]/90 via-[#FFF8E8]/80 to-[#370606]/90 overflow-hidden isolate shadow-2xl">
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>
      </div>

    </div>
  )
}