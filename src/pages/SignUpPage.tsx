import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* TALA Wordmark */}
        <div className="text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-black">TALA</h1>
        </div>

        {/* Sign Up Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Sena Agyei" type="text" />
            <p className="hidden text-sm text-destructive">Please enter your full name.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="sagyei@tala.com" type="email" />
            <p className="hidden text-sm text-destructive">Please enter a valid email address.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pr-10"
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
            <p className="hidden text-sm text-destructive">Password must be at least 8 characters.</p>
          </div>

          <Button className="w-full bg-black text-white hover:bg-black/90" size="lg">
            Create Account
          </Button>
        </div>

        {/* Log In Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="font-medium text-black hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
