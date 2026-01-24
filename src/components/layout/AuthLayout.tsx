import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ParticlesBackground } from '@/components/ui/ParticlesBackground'
import { User, Building2 } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ParticlesBackground />

      <div className="relative z-10 hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30"
              animate={{ 
                boxShadow: [
                  '0 25px 50px -12px rgba(16, 185, 129, 0.3)',
                  '0 25px 50px -12px rgba(16, 185, 129, 0.5)',
                  '0 25px 50px -12px rgba(16, 185, 129, 0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Building2 className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Keuangan</h1>
              <p className="text-lg text-emerald-400">Pesantren Al-Ikhlas</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <blockquote className="text-2xl leading-relaxed text-slate-300 font-light">
            "Sistem pengelolaan keuangan pesantren yang terintegrasi untuk memudahkan administrasi dan transparansi."
          </blockquote>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-emerald-500/30">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-xl text-white">Admin Pesantren</p>
              <p className="text-slate-400">Kelola keuangan dengan mudah</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm text-slate-500">© 2024 Pesantren Al-Ikhlas</p>
        </motion.div>
      </div>
      
      <div className="relative z-10 flex w-full items-center justify-center p-8 lg:w-1/2">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
