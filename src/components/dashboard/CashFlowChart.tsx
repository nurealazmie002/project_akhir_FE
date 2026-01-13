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

  return (
    <Card className="border-border bg-card py-4 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        <CardAction>
          <span className="text-sm text-muted-foreground">{period}</span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="flex w-12 flex-col justify-between pr-2 text-right text-xs text-muted-foreground">
            <span>50jt</span>
            <span>25jt</span>
            <span>10jt</span>
            <span>0</span>
          </div>

          <div className="flex flex-1 items-end justify-between gap-4">
            {data.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end justify-center gap-1">
                  <div
                    className="w-5 rounded-t bg-emerald-500 transition-all duration-300"
                    style={{ height: `${getBarHeight(item.income)}%` }}
                  />
                  <div
                    className="w-5 rounded-t bg-emerald-700 transition-all duration-300"
                    style={{ height: `${getBarHeight(item.expense)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Pemasukan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-700" />
            <span className="text-sm text-muted-foreground">Pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
