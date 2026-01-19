import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <Card className="border-border/50 bg-card h-full flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap size={18} className="text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">Aksi Cepat</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={cn(
              'w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-200',
              action.variant === 'primary'
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]'
                : 'bg-muted/50 hover:bg-muted text-foreground hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2.5 rounded-lg transition-all duration-200',
                action.variant === 'primary' 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-background group-hover:bg-primary/10'
              )}>
                {action.icon}
              </div>
              <span className="font-medium">{action.label}</span>
            </div>
            <ArrowRight 
              size={18} 
              className={cn(
                'transition-transform duration-200 group-hover:translate-x-1',
                action.variant !== 'primary' && 'text-muted-foreground group-hover:text-primary'
              )} 
            />
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
