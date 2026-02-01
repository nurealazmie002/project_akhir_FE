import { X, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Receipt } from '@/types/invoice.types'
import { motion, AnimatePresence } from 'framer-motion'

interface ReceiptModalProps {
  receipt: Receipt | null
  isOpen: boolean
  onClose: () => void
}

export function ReceiptModal({ receipt, isOpen, onClose }: ReceiptModalProps) {
  if (!receipt) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content')
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kwitansi - ${receipt.receiptNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              padding: 40px; 
              max-width: 400px; 
              margin: 0 auto;
              color: #1a1a1a;
            }
            .header { text-align: center; margin-bottom: 24px; }
            .header h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
            .header p { font-size: 12px; color: #666; }
            .receipt-number { 
              text-align: center; 
              font-size: 11px; 
              color: #888; 
              margin-bottom: 20px;
              padding: 8px;
              background: #f5f5f5;
              border-radius: 4px;
            }
            .info { margin-bottom: 20px; }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              font-size: 13px; 
              margin-bottom: 6px;
            }
            .info-label { color: #666; }
            .info-value { font-weight: 500; }
            .divider { 
              border: none; 
              border-top: 1px dashed #ddd; 
              margin: 16px 0; 
            }
            .items { margin-bottom: 20px; }
            .item { 
              display: flex; 
              justify-content: space-between; 
              font-size: 13px;
              margin-bottom: 8px;
            }
            .total { 
              display: flex; 
              justify-content: space-between; 
              font-size: 16px; 
              font-weight: 700;
              padding-top: 12px;
              border-top: 2px solid #1a1a1a;
            }
            .footer { 
              text-align: center; 
              margin-top: 32px; 
              font-size: 11px; 
              color: #888; 
            }
            .status { 
              text-align: center; 
              margin-top: 16px;
              padding: 8px 16px;
              background: #dcfce7;
              color: #166534;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              display: inline-block;
            }
            .status-container { text-align: center; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${receipt.institutionName}</h1>
            <p>Kwitansi Pembayaran</p>
          </div>
          
          <div class="receipt-number">
            No: ${receipt.receiptNumber}
          </div>
          
          <div class="info">
            <div class="info-row">
              <span class="info-label">Nama Santri</span>
              <span class="info-value">${receipt.santriName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">NIS</span>
              <span class="info-value">${receipt.santriNis}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal</span>
              <span class="info-value">${formatDate(receipt.paidAt)}</span>
            </div>
          </div>
          
          <hr class="divider" />
          
          <div class="items">
            ${receipt.items.map(item => `
              <div class="item">
                <span>${item.description}</span>
                <span>${formatCurrency(item.amount)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <span>Total</span>
            <span>${formatCurrency(receipt.totalAmount)}</span>
          </div>
          
          <div class="status-container">
            <span class="status">✓ LUNAS</span>
          </div>
          
          <div class="footer">
            <p>Terima kasih atas pembayaran Anda</p>
            <p style="margin-top: 4px;">Kwitansi ini sah sebagai bukti pembayaran</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-card border-border/50 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold text-foreground">Kwitansi Pembayaran</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                  <X size={18} />
                </Button>
              </div>

              <CardContent id="receipt-content" className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground">{receipt.institutionName}</h3>
                  <p className="text-sm text-muted-foreground">Kwitansi Pembayaran</p>
                </div>

                <div className="text-center mb-4 py-2 px-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">No: {receipt.receiptNumber}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nama Santri</span>
                    <span className="font-medium text-foreground">{receipt.santriName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">NIS</span>
                    <span className="font-medium text-foreground">{receipt.santriNis}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tanggal</span>
                    <span className="font-medium text-foreground">{formatDate(receipt.paidAt)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  {receipt.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.description}</span>
                      <span className="font-medium text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-sky-500">{formatCurrency(receipt.totalAmount)}</span>
                </div>

                <div className="text-center mt-4">
                  <span className="inline-block px-4 py-1.5 bg-sky-500/10 text-sky-500 rounded-full text-sm font-semibold">
                    ✓ LUNAS
                  </span>
                </div>
              </CardContent>

              <div className="flex gap-2 p-4 border-t border-border/50">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={onClose}
                >
                  Tutup
                </Button>
                <Button
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  onClick={handlePrint}
                >
                  <Printer size={16} />
                  Cetak
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
