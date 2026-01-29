import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, 
  Users, 
  CreditCard, 
  Shield, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const developers = [
  {
    name: 'Naufal Hibatullah',
    role: 'Frontend Developer • Lampung',
    photo: '/images/developers/dev1.jpg',
    initials: 'NH',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Muhammad Thoriq', 
    role: 'Backend Developer • Bogor',
    photo: '/images/developers/dev2.jpg',
    initials: 'MT',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Muhammad Xena',
    role: 'Backend Developer • Ponorogo', 
    photo: '/images/developers/dev3.jpg',
    initials: 'MX',
    color: 'from-emerald-500 to-teal-500'
  }
]

const features = [
  {
    icon: Users,
    title: 'Manajemen Santri',
    description: 'Kelola data santri dengan mudah, lengkap dengan informasi akademik dan wali.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: CreditCard,
    title: 'Pembayaran Digital',
    description: 'Sistem pembayaran terintegrasi dengan berbagai metode pembayaran modern.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: BarChart3,
    title: 'Laporan Keuangan',
    description: 'Pantau pemasukan dan pengeluaran dengan dashboard yang informatif.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Keamanan Data',
    description: 'Data tersimpan dengan aman menggunakan enkripsi standar industri.',
    color: 'from-orange-500 to-red-500'
  }
]

const benefits = [
  'Akses 24/7 dari mana saja',
  'Notifikasi pembayaran otomatis',
  'Laporan real-time',
  'Dukungan multi-lembaga',
  'Integrasi payment gateway',
  'Backup data otomatis'
]

export function LandingPage() {
  const [currentDev, setCurrentDev] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDev((prev) => (prev + 1) % developers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PesantrenLink</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Sparkles size={16} />
                Sistem Manajemen Pesantren Modern
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Kelola Pesantren Anda dengan{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text">
                Lebih Mudah
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              Platform terintegrasi untuk manajemen santri, pembayaran SPP, dan laporan keuangan. 
              Solusi digital untuk pesantren modern.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 px-8">
                  Mulai Sekarang
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-slate-300 hover:text-white hover:bg-white/10 px-8">
                  Sudah Punya Akun
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola pesantren dalam satu platform terpadu
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-white/10 bg-slate-800/50 backdrop-blur hover:bg-slate-800/80 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Developer Carousel */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Mengapa Memilih{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                  PesantrenLink?
                </span>
              </h2>
              <p className="text-slate-400 mb-8">
                Kami menyediakan solusi lengkap untuk digitalisasi administrasi pesantren, 
                sehingga Anda dapat fokus pada pendidikan santri.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Developer Carousel - Elegant Minimal Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                
                {/* Header */}
                
                {/* Developer Cards Carousel */}
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDev}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="flex flex-col items-center"
                    >
                      {/* Full Image Card */}
                      <div className="relative w-full max-w-xs h-72 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                        {/* Photo - Full Cover */}
                        {developers[currentDev].photo ? (
                          <img 
                            src={developers[currentDev].photo} 
                            alt={developers[currentDev].name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${developers[currentDev].color} flex items-center justify-center`}>
                            <span className="text-6xl font-bold text-white/80">
                              {developers[currentDev].initials}
                            </span>
                          </div>
                        )}
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                        
                        {/* Name & Role - Bottom Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {developers[currentDev].name}
                          </h3>
                          <p className="text-sm text-slate-300">
                            {developers[currentDev].role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Minimal Dots */}
                <div className="flex justify-center gap-1.5 mt-6">
                  {developers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDev(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentDev 
                          ? 'w-4 bg-emerald-500' 
                          : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Siap Memulai?
              </h2>
              <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                Bergabung dengan ratusan pesantren yang sudah menggunakan PesantrenLink 
                untuk mengelola administrasi mereka.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl px-8">
                  Daftar Gratis Sekarang
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">PesantrenLink</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 PesantrenLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
