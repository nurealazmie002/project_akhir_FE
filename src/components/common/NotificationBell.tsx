import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/stores/notificationStore'

interface NotificationBellProps {
  basePath?: string
  invoicePath?: string
}

export function NotificationBell({ basePath = '/admin', invoicePath = '/invoice' }: NotificationBellProps) {
  const navigate = useNavigate()
  const { unpaidInvoices, isLoading, fetchUnpaidInvoices } = useNotificationStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUnpaidInvoices()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInvoiceClick = () => {
    navigate(`${basePath}${invoicePath}`)
    setShowNotifications(false)
  }

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('id-ID').format(Number(amount))
  }

  return (
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
            <h3 className="font-semibold text-foreground">Tagihan Belum Bayar</h3>
            <p className="text-xs text-muted-foreground">{unpaidInvoices.length} tagihan menunggu pembayaran</p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
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
                <p className="text-sm">Tidak ada tagihan tertunda</p>
              </div>
            )}
          </div>

          {unpaidInvoices.length > 5 && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <button
                onClick={handleInvoiceClick}
                className="w-full text-center text-sm text-primary hover:underline"
              >
                Lihat semua ({unpaidInvoices.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
