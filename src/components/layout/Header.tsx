import { Bell, Search, Menu, X, LayoutDashboard, Users, UserCheck, Receipt, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoiceService } from '@/services/invoiceService'
import type { Invoice } from '@/types/invoice.types'

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

export function Header({ title, subtitle, onMenuClick, basePath = '/admin' }: HeaderProps) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([])
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    const fetchUnpaidInvoices = async () => {
      try {
        setIsLoadingInvoices(true)
        const response = await invoiceService.getAll()
        const unpaid = response.data.filter(
          inv => inv.status === 'PENDING' || inv.status === 'UNPAID'
        )
        setUnpaidInvoices(unpaid)
      } catch (err) {
        console.error('Failed to fetch invoices:', err)
      } finally {
        setIsLoadingInvoices(false)
      }
    }
    fetchUnpaidInvoices()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
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

  const handleInvoiceClick = () => {
    navigate(`${basePath}/invoice`)
    setShowNotifications(false)
  }

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('id-ID').format(Number(amount))
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


          <div className="relative" ref={notifRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/10 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unpaidInvoices.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center shadow-lg animate-pulse">
                  {unpaidInvoices.length > 99 ? '99+' : unpaidInvoices.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-foreground">Invoice Belum Bayar</h3>
                  <p className="text-xs text-muted-foreground">{unpaidInvoices.length} invoice menunggu pembayaran</p>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {isLoadingInvoices ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : unpaidInvoices.length > 0 ? (
                    <div className="divide-y divide-border">
                      {unpaidInvoices.slice(0, 5).map((invoice) => (
                        <button
                          key={invoice.id}
                          onClick={() => handleInvoiceClick()}
                          className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-foreground truncate">
                              {invoice.santri?.fullname || 'Santri'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              invoice.status === 'PENDING' 
                                ? 'bg-amber-500/20 text-amber-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {invoice.invoiceNumber || `INV-${invoice.id.slice(-6)}`}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              Rp {formatCurrency(invoice.totalAmount)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Receipt size={32} className="mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada invoice tertunda</p>
                    </div>
                  )}
                </div>

                {unpaidInvoices.length > 5 && (
                  <div className="px-4 py-2 border-t border-border bg-muted/30">
                    <button
                      onClick={() => {
                        navigate(`${basePath}/invoice`)
                        setShowNotifications(false)
                      }}
                      className="w-full text-center text-sm text-primary hover:underline"
                    >
                      Lihat semua ({unpaidInvoices.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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

