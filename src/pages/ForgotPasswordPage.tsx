import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column (Form) */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-[45%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-8">
          
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground font-mono">TALA</h1>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Reset your password
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Reset Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input id="email" placeholder="sagyei@tala.com" type="email" className="h-9 border-input bg-background text-foreground" />
              </div>

              <Button
                className="w-full h-9 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)]"
                size="lg"
              >
                Send Reset Link
              </Button>
            </div>
          </div>

          {/* Footer Text */}
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
