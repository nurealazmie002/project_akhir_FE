import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import type { CashFlowData } from '@/services/dashboardService'

interface CashFlowChartProps {
  data: CashFlowData[]
  title: string
  selectedPeriod: number
  onPeriodChange: (months: number) => void
}

export function CashFlowChart({ data, title, selectedPeriod, onPeriodChange }: CashFlowChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const rawMax = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1)
  const step = 50000
  const maxValue = Math.ceil(rawMax / step) * step // Round up to nearest 50k

  const getBarHeight = (value: number) => {
    if (value === 0) return 0
    return Math.max((value / maxValue) * 100, 2)
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}jt`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}rb`
    }
    return value.toLocaleString('id-ID')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="border-border/50 bg-card h-full flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardAction>
            <div className="flex items-center gap-1 bg-muted/50 rounded-full p-0.5">
              <button
                onClick={() => onPeriodChange(6)}
                className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all ${
                  selectedPeriod === 6
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                6 Bulan
              </button>
              <button
                onClick={() => onPeriodChange(12)}
                className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all ${
                  selectedPeriod === 12
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                12 Bulan
              </button>
            </div>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-w-0 overflow-visible">
        <div className="flex flex-1 min-w-[280px] overflow-visible">
          {/* Y-axis - 50k increments */}
          {(() => {
            const maxTicks = Math.ceil(maxValue / step)
            const ticks = []
            for (let i = maxTicks; i >= 0; i--) {
              ticks.push(i * step)
            }
            return (
              <div className="flex w-14 flex-col justify-between pr-3 text-right text-xs text-muted-foreground py-1 shrink-0">
                {ticks.map((tick, i) => (
                  <span key={i}>{formatValue(tick)}</span>
                ))}
              </div>
            )
          })()}

          {/* Bars */}
          <div className="flex flex-1 items-end justify-between gap-2 border-l border-b border-border/50 pl-3 pb-2 overflow-visible">
            {data.map((item, index) => (
              <div 
                key={`${item.month}-${index}`} 
                className="flex flex-1 flex-col items-center gap-3 min-w-0 relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex h-40 w-full items-end justify-center gap-1 relative">
                  {/* Tooltip - positioned inside the bar container */}
                  {hoveredIndex === index && (
                    <div 
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className="bg-slate-900 text-white text-xs px-3 py-2.5 rounded-lg shadow-2xl min-w-[150px] border border-slate-700">
                        <div className="font-semibold text-center mb-2 text-white border-b border-slate-700 pb-1.5">
                          {item.monthFull} {item.year}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className="text-slate-300">Masuk</span>
                            </div>
                            <span className="font-semibold text-emerald-400">{formatCurrency(item.income)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-rose-400" />
                              <span className="text-slate-300">Keluar</span>
                            </div>
                            <span className="font-semibold text-rose-400">{formatCurrency(item.expense)}</span>
                          </div>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900" />
                    </div>
                  )}

                  {/* Income bar - rounded pill style */}
                  <div
                    className="w-4 rounded-full bg-gradient-to-t from-emerald-500 to-emerald-400 cursor-pointer"
                    style={{ height: `${getBarHeight(item.income)}%` }}
                  />
                  {/* Expense bar - rounded pill style */}
                  <div
                    className="w-4 rounded-full bg-gradient-to-t from-rose-500 to-rose-400 cursor-pointer"
                    style={{ height: `${getBarHeight(item.expense)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  hoveredIndex === index ? 'text-foreground' : 'text-muted-foreground'
                }`}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-muted-foreground">Pemasukan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-sm font-medium text-muted-foreground">Pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
