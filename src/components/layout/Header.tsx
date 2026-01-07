import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0d1f12] px-8 py-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400">
            {subtitle} <span className="text-emerald-500">{today}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari santri atau transaksi..."
            className="w-64 border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500"
          />
        </div>

        <Button variant="outline" size="icon" className="relative border-white/10 bg-white/5 text-gray-400 hover:text-white">
          <Bell size={20} />
          <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 justify-center bg-red-500 text-white text-xs">
            3
          </Badge>
        </Button>
      </div>
    </header>
  )
}
