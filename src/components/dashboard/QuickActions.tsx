import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  variant?: 'primary' | 'default'
  onClick?: () => void
}

interface QuickActionsProps {
  actions: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="border-white/10 bg-white/5 py-4 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.id}
            onClick={action.onClick}
            variant={action.variant === 'primary' ? 'default' : 'outline'}
            className={
              action.variant === 'primary'
                ? 'w-full justify-between border-emerald-500 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                : 'w-full justify-between border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }
          >
            <div className="flex items-center gap-3">
              {action.icon}
              {action.label}
            </div>
            {action.variant === 'primary' ? <ArrowRight size={18} /> : <Plus size={18} />}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
