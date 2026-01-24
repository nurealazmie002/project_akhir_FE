import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  variant?: 'default' | 'warning' | 'success' | 'danger'
  icon?: 'up' | 'down' | 'warning' | 'check'
}

function useAnimatedCounter(endValue: string, duration: number = 1000) {
  const [displayValue, setDisplayValue] = useState('0')
  
  useEffect(() => {
    const numericMatch = endValue.match(/[\d.,]+/)
    if (!numericMatch) {
      setDisplayValue(endValue)
      return
    }
    
    const numericStr = numericMatch[0].replace(/\./g, '').replace(/,/g, '')
    const numericValue = parseInt(numericStr, 10)
    
    if (isNaN(numericValue)) {
      setDisplayValue(endValue)
      return
    }
    
    const startTime = Date.now()
    const startValue = 0
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (numericValue - startValue) * easeOutQuart)
      
      const formattedNumber = new Intl.NumberFormat('id-ID').format(currentValue)
      const newValue = endValue.replace(numericMatch[0], formattedNumber)
      
      setDisplayValue(newValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
      }
    }
    
    requestAnimationFrame(animate)
  }, [endValue, duration])
  
  return displayValue
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  variant = 'default',
  icon,
}: StatCardProps) {
  const animatedValue = useAnimatedCounter(value, 800)
  
  const IconComponent = {
    up: TrendingDown,
    down: TrendingUp,
    warning: AlertTriangle,
    check: CheckCircle,
  }[icon || 'check']

  const iconConfig = {
    up: 'from-rose-500 to-rose-600',
    down: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-orange-500',
    check: 'from-emerald-500 to-teal-500',
  }

  return (
    <Card
      className={cn(
        'group border border-border/50 bg-card hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden',
        variant === 'warning' && 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent'
      )}
    >
      <CardContent className="p-5">

        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground leading-tight">{title}</p>
          {icon && (
            <div className={cn(
              'p-2.5 rounded-xl bg-gradient-to-br shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300',
              iconConfig[icon]
            )}>
              <IconComponent size={20} className="text-white" />
            </div>
          )}
        </div>


        <p
          className={cn(
            'text-2xl font-bold tracking-tight mb-2 transition-all duration-300',
            variant === 'warning' ? 'text-amber-500' : 'text-foreground'
          )}
        >
          {animatedValue}
        </p>


        {(change !== undefined || changeLabel) && (
          <div className="flex items-center gap-2 flex-wrap">
            {change !== undefined && (
              <span className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-300',
                change > 0 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-rose-500/10 text-rose-500'
              )}>
                {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
