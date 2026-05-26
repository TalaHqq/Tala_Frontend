import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useResetPassword } from '../hooks/useResetPassword'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { isLoading, error: apiError, success, submit } = useResetPassword()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' })
  const [noTokenError, setNoTokenError] = useState(false)

  useEffect(() => {
    if (!token) {
      setNoTokenError(true)
    }
  }, [token])

  const validateField = (field: keyof typeof formData, value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'This field is required' }))
      return false
    }
    if (field === 'newPassword') {
      if (value.length < 8) {
        setErrors(prev => ({ ...prev, newPassword: 'Password must be at least 8 characters' }))
        return false
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(value)) {
        setErrors(prev => ({ ...prev, newPassword: 'Must include uppercase, lowercase, number, and symbol' }))
        return false
      }
    }
    if (field === 'confirmPassword' && value !== formData.newPassword) {
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

    if (!token) {
      setNoTokenError(true)
      return
    }

    // Validate all fields
    const isPasswordValid = validateField('newPassword', formData.newPassword)
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword)

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    await submit({ 
      token, 
      password: formData.newPassword,
      confirmPassword: formData.confirmPassword
    })
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
              Create new password
            </h2>
            <p className="text-sm text-muted-foreground">
              Your new password must be different from previous ones.
            </p>
          </div>

          <div className="space-y-6">
            {noTokenError && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Invalid link</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>This reset link is invalid or missing a security token. Please request a new link.</p>
                    </div>
                    <div className="mt-4">
                      <Link 
                        to="/forgot-password" 
                        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-white px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        Request new link
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {success ? (
              <div className="space-y-6 text-center">
                <div className="rounded-md bg-emerald-50 p-6 border border-emerald-200">
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                    <h3 className="text-lg font-medium text-emerald-800 text-center">Password successfully changed</h3>
                    <p className="mt-2 text-sm text-emerald-700 text-center">
                      You can now log in with your new password.
                    </p>
                  </div>
                </div>
                <Link 
                  to="/login" 
                  className="flex h-9 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Log in to your account
                </Link>
              </div>
            ) : (!noTokenError && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && (
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">{apiError}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={`pr-10 h-9 border-input bg-background text-foreground ${errors.newPassword ? 'border-red-500' : ''}`}
                      value={formData.newPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('newPassword')}
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
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</Label>
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
                  className="w-full h-9 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)] disabled:opacity-70 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Button>
              </form>
            ))}
          </div>

          <div className="space-y-4 text-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Remember your password? </span>
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
