import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  variant?: 'default' | 'warning'
  icon?: 'up' | 'down' | 'warning' | 'check'
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  variant = 'default',
  icon,
}: StatCardProps) {
  const IconComponent = {
    up: ArrowUp,
    down: ArrowDown,
    warning: AlertTriangle,
    check: CheckCircle,
  }[icon || 'check']

  const iconColors = {
    up: 'text-red-500 bg-red-500/20',
    down: 'text-emerald-500 bg-emerald-500/20',
    warning: 'text-amber-500 bg-amber-500/20',
    check: 'text-emerald-500 bg-emerald-500/20',
  }

  return (
    <Card
      className={cn(
        'border py-4',
        variant === 'warning'
          ? 'border-amber-500/30 bg-amber-500/10'
          : 'border-border bg-card'
      )}
    >
      <CardContent className="p-0 px-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p
              className={cn(
                'mt-2 text-2xl font-bold',
                variant === 'warning' ? 'text-amber-500' : 'text-foreground'
              )}
            >
              {value}
            </p>
            {(change !== undefined || changeLabel) && (
              <p
                className={cn(
                  'mt-1 text-xs',
                  change && change > 0 ? 'text-emerald-500' : 'text-red-500'
                )}
              >
                {change !== undefined && (
                  <span>
                    {change > 0 ? '+' : ''}
                    {change}%{' '}
                  </span>
                )}
                <span className="text-muted-foreground">{changeLabel}</span>
              </p>
            )}
          </div>
          {icon && (
            <div className={cn('rounded-lg p-2', iconColors[icon])}>
              <IconComponent size={18} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
