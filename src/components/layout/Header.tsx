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
    <header className="flex items-center justify-between border-b border-border bg-card px-8 py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle} <span className="text-primary">{today}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari santri atau transaksi..."
            className="w-64 pl-10"
          />
        </div>

        <Button variant="outline" size="icon" className="relative">
          <Bell size={20} />
          <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 justify-center bg-destructive text-destructive-foreground text-xs">
            3
          </Badge>
        </Button>
      </div>
    </header>
  )
}
