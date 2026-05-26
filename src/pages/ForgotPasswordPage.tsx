import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, ArrowRight, Mail } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useForgotPassword } from '../hooks/useForgotPassword'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const { isLoading, error: apiError, submit } = useForgotPassword()

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setError('Please enter a valid email address')
      return false
    }
    setError('')
    return true
  }

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) return
    const result = await submit({ email })
    if (result.success) {
      setStep('verify')
    }
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Verification code is required')
      return
    }
    // Navigate to reset password page with the code as token
    navigate(`/reset-password?token=${code}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column (Form) */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-[45%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-8">
          
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground font-sans">TALA</h1>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {step === 'request' ? 'Reset your password' : 'Enter verification code'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {step === 'request' 
                  ? "Enter your email address and we'll send you a code to reset your password."
                  : `We've sent a 6-digit code to ${email}. Please enter it below to continue.`}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {step === 'request' ? (
              <form onSubmit={handleSubmitEmail} className="space-y-4">
                {(apiError || (error && step === 'request')) && (
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">{apiError || error}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      placeholder="sagyei@tala.com" 
                      type="email" 
                      className={`h-9 border-input bg-background text-foreground pl-9 ${error ? 'border-red-500' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="code" className="text-sm font-medium text-foreground">Verification Code</Label>
                  <Input 
                    id="code" 
                    placeholder="Enter code" 
                    className="h-9 border-input bg-background text-foreground text-center tracking-[0.5em] font-mono text-lg"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={10}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-9 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)]"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <button 
                  type="button"
                  onClick={() => setStep('request')}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change email address
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4 text-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Remember your password? </span>
              <Link to="/Tala_Frontend/login" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
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
