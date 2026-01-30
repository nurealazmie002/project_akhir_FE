import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

export interface StatCardProps {
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
    up: TrendingDown,
    down: TrendingUp,
    warning: AlertTriangle,
    check: CheckCircle,
  }[icon || 'check']

  const iconColors = {
    up: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    down: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    check: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  }

  return (
    <Card className={cn(
      'border bg-card transition-shadow duration-200 hover:shadow-md',
      variant === 'warning' && 'border-amber-200 dark:border-amber-500/30'
    )}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">{title}</p>
          {icon && (
            <div className={cn('p-1.5 sm:p-2 rounded-lg shrink-0', iconColors[icon])}>
              <IconComponent className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </div>
          )}
        </div>

        <p className={cn(
          'text-xl sm:text-2xl font-bold tracking-tight mb-1.5',
          variant === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
        )}>
          {value}
        </p>

        {(change !== undefined || changeLabel) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {change !== undefined && (
              <span className={cn(
                'inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-full',
                change > 0 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
              )}>
                {change > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" /> }
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            <span className="text-[10px] sm:text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
