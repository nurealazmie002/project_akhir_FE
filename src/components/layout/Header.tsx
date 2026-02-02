import { Search, Menu, X, LayoutDashboard, Users, UserCheck, Receipt, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationBell } from '@/components/common/NotificationBell'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  isSidebarOpen?: boolean
  basePath?: string
}

const adminMenuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Data Santri', href: '/admin/santri', icon: Users },
  { label: 'Data Wali', href: '/admin/wali', icon: UserCheck },
  { label: 'Invoice', href: '/admin/invoice', icon: Receipt },
  { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
]

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredMenus = adminMenuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMenuClick = (href: string) => {
    navigate(href)
    setSearchQuery('')
    setShowSearchResults(false)
    setSearchOpen(false)
  }



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

          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(e.target.value.length > 0)
              }}
              onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
              className="w-40 lg:w-56 pl-10 h-9 bg-muted/40 border-border/40 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-lg text-sm"
            />
            
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50">
                {filteredMenus.length > 0 ? (
                  <div className="py-1">
                    {filteredMenus.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleMenuClick(item.href)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors"
                        >
                          <Icon size={18} className="text-primary" />
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    Tidak ada menu ditemukan
                  </div>
                )}
              </div>
            )}
          </div>


          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </Button>


          <NotificationBell basePath="/admin" invoicePath="/invoice" />
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-10 bg-muted/40 border-border/40 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-lg"
            />
          </div>
          
          {searchQuery.length > 0 && (
            <div className="mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
              {filteredMenus.length > 0 ? (
                <div className="py-1">
                  {filteredMenus.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleMenuClick(item.href)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors"
                      >
                        <Icon size={18} className="text-primary" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  Tidak ada menu ditemukan
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}

