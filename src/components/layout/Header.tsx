import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
        {/* Hamburger Menu - Only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 hover:bg-primary/10"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </Button>

        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              {subtitle} <span className="text-primary font-medium">{today}</span>
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search - Hidden on very small screens */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari..."
              className="w-32 md:w-48 lg:w-64 pl-10 bg-muted/50 border-border/50 focus:bg-background transition-colors"
            />
          </div>

          {/* Notification Bell */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10"
          >
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
