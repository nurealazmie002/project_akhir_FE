import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import type { CashFlowData } from '@/types'

interface CashFlowChartProps {
  data: CashFlowData[]
  title: string
  period?: string
}

export function CashFlowChart({ data, title, period = '6 Bulan Terakhir' }: CashFlowChartProps) {
  const maxValue = Math.max(...data.flatMap((d) => [d.income, d.expense]))

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}jt`
    }
    return value.toLocaleString('id-ID')
  }

  return (
    <Card className="border-border/50 bg-card h-full flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardAction>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">{period}</span>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-w-0 overflow-x-auto">
        <div className="flex flex-1 min-w-[280px]">

          <div className="flex w-8 sm:w-12 flex-col justify-between pr-1 sm:pr-3 text-right text-[10px] sm:text-xs text-muted-foreground py-1 shrink-0">
            <span className="font-medium">{formatValue(maxValue)}</span>
            <span>{formatValue(maxValue * 0.5)}</span>
            <span className="hidden sm:block">{formatValue(maxValue * 0.25)}</span>
            <span>0</span>
          </div>


          <div className="flex flex-1 items-end justify-between gap-1 sm:gap-2 border-l border-b border-border/50 pl-1 sm:pl-3 pb-2">
            {data.map((item, index) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-1 sm:gap-3 group min-w-0">
                <div className="flex h-24 sm:h-40 w-full items-end justify-center gap-0.5 sm:gap-1.5">

                  <div
                    className="w-3 sm:w-5 rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-500 hover:from-emerald-500 hover:to-emerald-300 cursor-pointer relative group/bar"
                    style={{ 
                      height: `${getBarHeight(item.income)}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 hidden sm:block">
                      Rp {item.income.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div
                    className="w-3 sm:w-5 rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-slate-600 to-slate-400 transition-all duration-500 hover:from-slate-500 hover:to-slate-300 cursor-pointer relative group/bar"
                    style={{ 
                      height: `${getBarHeight(item.expense)}%`,
                      animationDelay: `${index * 100 + 50}ms`
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 hidden sm:block">
                      Rp {item.expense.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] sm:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">{item.month}</span>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-3 sm:mt-6 flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <span className="text-[10px] sm:text-sm font-medium text-muted-foreground">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gradient-to-r from-slate-500 to-slate-400" />
            <span className="text-[10px] sm:text-sm font-medium text-muted-foreground">Pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
