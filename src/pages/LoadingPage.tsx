import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import loadingGif from '../assets/loading1.gif'

export function LoadingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to library after 3 seconds
    const timer = setTimeout(() => {
      navigate('/library')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Premium Background Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E08210]/20 via-background to-[#370606]/20 animate-pulse" />
      
      {/* Soft Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Loading Animation Container */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-full blur-xl group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <div className="relative h-32 w-32 rounded-full overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-white/5 flex items-center justify-center">
            <img 
              src={loadingGif} 
              alt="Loading..." 
              className="w-full h-full object-cover scale-110"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Setting things up</h2>
          <p className="text-muted-foreground animate-pulse">Welcome to TALA. Redirecting you shortly...</p>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  )
}
