import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { CashFlowData } from '@/services/dashboardService'

interface CashFlowChartProps {
  data: CashFlowData[]
  title: string
  selectedPeriod: number
  onPeriodChange: (months: number) => void
}

const chartConfig = {
  income: {
    label: "Pemasukan",
    color: "#10b981",
  },
  expense: {
    label: "Pengeluaran",
    color: "#f43f5e",
  },
} satisfies ChartConfig

export function CashFlowChart({ data, title, selectedPeriod, onPeriodChange }: CashFlowChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}jt`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}rb`
    }
    return value.toLocaleString('id-ID')
  }

  return (
    <Card className="border bg-card h-full flex flex-col">
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
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatCurrency}
              tick={{ fontSize: 10 }}
              width={45}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {name === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                      <span className="font-semibold">
                        Rp {Number(value).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="expense"
              type="monotone"
              fill="url(#fillExpense)"
              fillOpacity={0.4}
              stroke="#f43f5e"
              strokeWidth={2}
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              fillOpacity={0.4}
              stroke="#10b981"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] sm:text-sm font-medium text-muted-foreground">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500" />
            <span className="text-[10px] sm:text-sm font-medium text-muted-foreground">Pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
