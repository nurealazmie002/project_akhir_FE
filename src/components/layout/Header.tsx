import { Bell, Search, Menu, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4">

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 hover:bg-primary/10 transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </Button>


        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              {subtitle} <span className="text-primary/80 font-medium">{today}</span>
            </p>
          )}
        </div>


        <div className="flex items-center gap-2 shrink-0">

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari menu..."
              className="w-40 lg:w-56 pl-10 h-9 bg-muted/40 border-border/40 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-lg text-sm"
            />
          </div>


          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </Button>


          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center shadow-lg">
              3
            </span>
          </Button>
        </div>
      </div>


      {searchOpen && (
        <div className="px-4 pb-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari menu..."
              autoFocus
              className="w-full pl-10 h-10 bg-muted/40 border-border/40 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-lg"
            />
          </div>
        </div>
      )}
    </header>
  )
}
