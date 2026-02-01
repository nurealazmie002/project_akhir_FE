import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { paymentService } from '@/services/paymentService'

export function PaymentResultPage({ status: initialStatus }: { status: 'success' | 'failed' | 'pending' }) {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search)
      const orderId = params.get('order_id')
      
      if (orderId && initialStatus === 'success') {
        try {
          await paymentService.getPaymentStatus(orderId)
        } catch (error) {
          console.error('Failed to verify payment status:', error)
        }
      }
    }

    verifyPayment()
  }, [location, initialStatus])

  const configKey = ['success', 'failed', 'pending'].includes(initialStatus) ? initialStatus : 'pending'
  const config = {
    success: {
      icon: CheckCircle,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      title: 'Pembayaran Berhasil',
      description: 'Terima kasih, pembayaran Anda telah berhasil diverifikasi.',
      buttonText: 'Kembali ke Pembayaran'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      title: 'Pembayaran Gagal',
      description: 'Maaf, pembayaran Anda gagal atau dibatalkan. Silakan coba lagi.',
      buttonText: 'Coba Lagi'
    },
    pending: {
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      title: 'Menunggu Pembayaran',
      description: 'Mohon selesaikan pembayaran Anda sesuai instruksi yang diberikan.',
      buttonText: 'Cek Status Pembayaran'
    }
  }[configKey]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="flex flex-col items-center p-8 text-center space-y-6">
            <div className={`rounded-full p-4 ${config.bgColor}`}>
              <config.icon className={`h-12 w-12 ${config.color}`} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
              <p className="text-muted-foreground">{config.description}</p>
            </div>

            <Button 
              className="w-full" 
              onClick={() => navigate('/user/pembayaran')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {config.buttonText}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
