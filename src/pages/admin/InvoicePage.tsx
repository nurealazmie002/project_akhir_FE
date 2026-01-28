import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Search, 
  Loader2,
  X,
  Printer,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { invoiceService } from '@/services/invoiceService'
import { paymentService } from '@/services/paymentService'
import { santriService } from '@/services/santriService'
import { ReceiptModal } from '@/components/dashboard/ReceiptModal'
import type { Invoice, InvoiceStatus, Receipt } from '@/types/invoice.types'
import type { Santri } from '@/types/santri.types'

export function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    santriId: '',
    items: [{ description: '', amount: 0, quantity: 1 }],
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [invoicesRes, santriRes] = await Promise.all([
        invoiceService.getAll().catch(() => ({ data: [] })),
        santriService.getAll().catch(() => ({ data: [] }))
      ])
      setInvoices(invoicesRes.data)
      setSantriList(santriRes.data)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numAmount || 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Helper to get santri name from santriList by ID
  const getSantriName = (invoice: Invoice): string => {
    if (invoice.santri?.fullname) return invoice.santri.fullname
    const santri = santriList.find(s => s.id === invoice.santriId)
    return santri?.fullname || '-'
  }

  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return {
          className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          label: 'Lunas',
          icon: CheckCircle
        }
      case 'PENDING':
        return {
          className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          label: 'Menunggu',
          icon: Clock
        }
      case 'OVERDUE':
        return {
          className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
          label: 'Terlambat',
          icon: AlertCircle
        }
      case 'CANCELLED':
        return {
          className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
          label: 'Dibatalkan',
          icon: XCircle
        }
      default:
        return {
          className: 'bg-muted text-muted-foreground',
          label: status,
          icon: Clock
        }
    }
  }

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.santri?.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.invoiceNumber || inv.id).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateInvoice = async () => {
    if (!formData.santriId) {
      setError('Pilih santri terlebih dahulu')
      return
    }

    setIsSaving(true)
    try {
      // Ensure all amounts and quantities are numbers
      const parsedItems = formData.items.map(item => ({
        description: item.description,
        amount: typeof item.amount === 'string' ? parseFloat(item.amount) || 0 : Number(item.amount),
        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) || 1 : Number(item.quantity)
      }))
      
      // Calculate total amount
      const totalAmount = parsedItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0)
      
      await invoiceService.create({
        santriId: formData.santriId,
        items: parsedItems,
        amount: totalAmount, // Add amount at root level
        dueDate: formData.dueDate,
        notes: formData.notes || undefined
      } as any)
      await fetchData()
      setShowModal(false)
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat invoice')
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewDetail = async (invoice: Invoice) => {
    try {
      const detail = await invoiceService.getById(invoice.id)
      setSelectedInvoice(detail)
      setShowDetailModal(true)
    } catch (err) {
      setError('Gagal memuat detail invoice')
    }
  }

  const handlePrintReceipt = (invoice: Invoice) => {
    if (invoice.status === 'PAID') {
      const receipt = invoiceService.generateReceiptFromInvoice(invoice, 'Pondok Pesantren')
      setSelectedReceipt(receipt)
      setShowReceiptModal(true)
    }
  }

  const handlePayInvoice = async (invoice: Invoice) => {
    setIsProcessingPayment(true)
    setError(null)
    try {
      // Calculate amount - fallback to items sum if totalAmount is undefined
      let amount = 0
      if (invoice.totalAmount !== undefined && invoice.totalAmount !== null) {
        amount = typeof invoice.totalAmount === 'string' 
          ? parseFloat(invoice.totalAmount) 
          : Number(invoice.totalAmount)
      } else if (invoice.items && invoice.items.length > 0) {
        amount = invoice.items.reduce((sum, item) => {
          const itemAmount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount
          const itemQty = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity
          return sum + (itemAmount * itemQty)
        }, 0)
      }
      
      console.log('Payment request:', { invoiceId: invoice.id, amount, invoice })
      
      if (!amount || amount <= 0) {
        setError('Jumlah pembayaran tidak valid')
        setIsProcessingPayment(false)
        return
      }
      
      const paymentData = await paymentService.createPayment({
        invoiceId: invoice.id,
        amount: amount
      })
      
      // Open Midtrans Snap popup
      paymentService.openSnapPayment(paymentData.snapToken, {
        onSuccess: async (result) => {
          console.log('Payment success:', result)
          await fetchData()
          setShowDetailModal(false)
        },
        onPending: (result) => {
          console.log('Payment pending:', result)
        },
        onError: (result) => {
          console.error('Payment error:', result)
          setError('Pembayaran gagal')
        },
        onClose: () => {
          console.log('Payment popup closed')
          setIsProcessingPayment(false)
        }
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pembayaran')
      setIsProcessingPayment(false)
    }
  }

  const resetForm = () => {
    setFormData({
      santriId: '',
      items: [{ description: '', amount: 0, quantity: 1 }],
      dueDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setError(null)
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0, quantity: 1 }]
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount * item.quantity), 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat data invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invoice / Tagihan</h1>
            <p className="text-muted-foreground">Kelola tagihan pembayaran santri</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus size={18} />
            Buat Tagihan Baru
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Semua Status</option>
                <option value="PENDING">Menunggu</option>
                <option value="PAID">Lunas</option>
                <option value="OVERDUE">Terlambat</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText size={18} className="text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Daftar Invoice ({filteredInvoices.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={48} className="text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {invoices.length === 0 
                    ? 'Belum ada invoice. Klik "Buat Tagihan Baru" untuk membuat invoice pertama.'
                    : 'Tidak ada invoice yang cocok dengan filter.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase">No. Invoice</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Santri</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Total</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Jatuh Tempo</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice, index) => {
                      const statusConfig = getStatusConfig(invoice.status)
                      const StatusIcon = statusConfig.icon
                      return (
                        <TableRow 
                          key={invoice.id}
                          className={cn(
                            'border-border/50 transition-colors',
                            index % 2 === 0 ? 'bg-muted/20' : 'bg-transparent',
                            'hover:bg-primary/5'
                          )}
                        >
                          <TableCell className="font-medium text-foreground">{invoice.invoiceNumber || invoice.id.slice(-8).toUpperCase()}</TableCell>
                          <TableCell className="text-foreground">{getSantriName(invoice)}</TableCell>
                          <TableCell className="font-semibold text-emerald-500">{formatCurrency(invoice.totalAmount)}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={cn('font-medium border gap-1', statusConfig.className)}
                            >
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={() => handleViewDetail(invoice)}
                                title="Lihat Detail"
                              >
                                <Eye size={16} />
                              </Button>
                              {invoice.status === 'PENDING' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                                  onClick={() => handlePayInvoice(invoice)}
                                  title="Bayar Sekarang"
                                >
                                  <CreditCard size={16} />
                                </Button>
                              )}
                              {invoice.status === 'PAID' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                  onClick={() => handlePrintReceipt(invoice)}
                                  title="Cetak Kwitansi"
                                >
                                  <Printer size={16} />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-card border-border/50 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <h2 className="text-lg font-semibold text-foreground">Buat Tagihan Baru</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} className="h-8 w-8 p-0">
                    <X size={18} />
                  </Button>
                </div>

                <CardContent className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Santri Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Santri</label>
                    <select
                      value={formData.santriId}
                      onChange={(e) => setFormData(prev => ({ ...prev, santriId: e.target.value }))}
                      className="w-full px-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Pilih Santri</option>
                      {santriList.map(santri => (
                        <option key={santri.id} value={santri.id}>
                          {santri.fullname} - {santri.nis}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Jatuh Tempo</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-foreground">Item Tagihan</label>
                      <Button variant="ghost" size="sm" onClick={addItem} className="text-primary">
                        <Plus size={14} className="mr-1" /> Tambah Item
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <input
                            type="text"
                            placeholder="Deskripsi"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="flex-1 px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <input
                            type="number"
                            placeholder="Jumlah"
                            value={item.amount || ''}
                            onChange={(e) => updateItem(index, 'amount', parseInt(e.target.value) || 0)}
                            className="w-28 px-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          {formData.items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="h-9 w-9 p-0 text-muted-foreground hover:text-rose-500"
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="text-lg font-bold text-emerald-500">{formatCurrency(totalAmount)}</span>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Catatan (opsional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Catatan tambahan..."
                      rows={2}
                      className="w-full px-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </CardContent>

                <div className="flex gap-2 p-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    disabled={isSaving}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleCreateInvoice}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan'
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowDetailModal(false)}
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
                  <h2 className="text-lg font-semibold text-foreground">Detail Invoice</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)} className="h-8 w-8 p-0">
                    <X size={18} />
                  </Button>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="text-center mb-4 py-2 px-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">No: {selectedInvoice.invoiceNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Santri</span>
                      <span className="font-medium text-foreground">{selectedInvoice.santri?.fullname}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jatuh Tempo</span>
                      <span className="font-medium text-foreground">{formatDate(selectedInvoice.dueDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge 
                        variant="outline"
                        className={cn('font-medium border', getStatusConfig(selectedInvoice.status).className)}
                      >
                        {getStatusConfig(selectedInvoice.status).label}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-4 space-y-2">
                    {selectedInvoice.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.description}</span>
                        <span className="font-medium text-foreground">{formatCurrency((typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount) * (typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity))}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-emerald-500">{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </CardContent>

                <div className="flex gap-2 p-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Tutup
                  </Button>
                  {selectedInvoice.status === 'PENDING' && (
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                      onClick={() => handlePayInvoice(selectedInvoice)}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard size={16} />
                      )}
                      Bayar Sekarang
                    </Button>
                  )}
                  {selectedInvoice.status === 'PAID' && (
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handlePrintReceipt(selectedInvoice)}
                    >
                      <Printer size={16} />
                      Cetak Kwitansi
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </>
  )
}
