import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/services/authService'
import { fadeInUp } from '@/lib/animations'
import { KeyRound, ArrowLeft } from 'lucide-react'

export function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(location.state?.from === 'login' ? 0 : 60)
  const [canResend, setCanResend] = useState(location.state?.from === 'login')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const email = location.state?.email || ''

  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (error) setError(null)
    if (success) setSuccess(null)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    if (error) setError(null)
    if (success) setSuccess(null)

    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Masukkan 6 digit kode OTP')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    console.log('📤 Memverifikasi OTP untuk:', email)
    try {
      await authService.verifyOtp({ email, otpCode: otpCode })
      console.log('✅ Verifikasi berhasil')
      navigate('/login', {
        state: { message: 'Email berhasil diverifikasi. Silakan login.' }
      })
    } catch (err: any) {
      console.error('❌ Verifikasi gagal:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Kode OTP tidak valid')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    if (!email) {
      setError('Email tidak ditemukan. Silakan register ulang.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    console.log('📤 Mengirim ulang OTP ke:', email)
    try {
      const response = await authService.resendOtp({ email })
      console.log('✅ OTP berhasil dikirim ulang:', response)
      setSuccess(response.message || 'OTP telah dikirim ulang ke email Anda')
      setResendTimer(60)
      setCanResend(false)
    } catch (err: any) {
      console.error('❌ Gagal mengirim ulang OTP:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Gagal mengirim ulang OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 text-center px-4 sm:px-6">
          <motion.div
            className="mx-auto mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <KeyRound className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </motion.div>
          <CardTitle className="text-xl sm:text-2xl text-foreground">Verifikasi Email</CardTitle>
          <CardDescription className="text-muted-foreground text-xs sm:text-sm">
            Masukkan 6 digit kode OTP yang dikirim ke<br />
            <span className="text-primary break-all">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge variant="destructive" className="w-full justify-center py-2">
                  {error}
                </Badge>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge className="w-full justify-center py-2 bg-green-500 hover:bg-green-600 text-white border-none">
                  {success}
                </Badge>
              </motion.div>
            )}

            <div className="flex justify-center gap-1.5 sm:gap-2">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Input
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-11 w-10 sm:h-14 sm:w-12 text-center text-xl sm:text-2xl font-bold p-0"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
              </Button>
            </motion.div>
          </form>

          <motion.div
            className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Tidak menerima kode?{' '}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-primary hover:underline font-medium"
              >
                Kirim ulang
              </button>
            ) : (
              <span className="text-muted-foreground">
                Kirim ulang dalam {resendTimer}s
              </span>
            )}
          </motion.div>

          <motion.button
            onClick={() => navigate('/register')}
            className="mt-3 sm:mt-4 flex w-full items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            Kembali ke Register
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
