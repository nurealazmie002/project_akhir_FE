"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts"

export type ChartConfig = Record<string, {
  label: string
  color: string
  icon?: React.ComponentType
}>

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, children, ...props }, ref) => {
    const id = React.useId()
    const chartId = `chart-${id.replace(/:/g, "")}`

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          data-chart={chartId}
          className={cn(
            "flex aspect-video justify-center text-xs",
            "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
            "[&_.recharts-cartesian-grid_line]:stroke-border/50",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
            "[&_.recharts-layer]:outline-none",
            "[&_.recharts-surface]:outline-none",
            className
          )}
          {...props}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: Object.entries(config)
                .map(([key, value]) => `[data-chart="${chartId}"] { --color-${key}: ${value.color}; }`)
                .join("\n"),
            }}
          />
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsTooltip

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    dataKey?: string
    color?: string
    payload?: Record<string, unknown>
  }>
  label?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "dot" | "line" | "dashed"
  formatter?: (value: number, name: string, item: unknown, index: number, payload: unknown) => React.ReactNode
  className?: string
  labelClassName?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      formatter,
      className,
      labelClassName,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && label && (
          <div className={cn("font-medium", labelClassName)}>{label}</div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = item.dataKey || item.name || "value"
            const itemConfig = config[key as keyof typeof config]
            const indicatorColor = item.color || itemConfig?.color

            if (formatter && item.value !== undefined && item.name) {
              return (
                <div key={`${item.dataKey}-${index}`}>
                  {formatter(item.value, item.name, item, index, item.payload)}
                </div>
              )
            }

            return (
              <div
                key={`${item.dataKey}-${index}`}
                className={cn(
                  "flex w-full items-center gap-2",
                  indicator === "dot" && "items-center"
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn("shrink-0 rounded-[2px]", {
                      "h-2.5 w-2.5": indicator === "dot",
                      "h-4 w-1": indicator === "line",
                      "h-4 w-0 border-[1.5px] border-dashed bg-transparent":
                        indicator === "dashed",
                    })}
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <div className="flex flex-1 justify-between items-center leading-none">
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                  {item.value !== undefined && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsLegend

interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: Array<{
    value?: string
    dataKey?: string
    color?: string
  }>
  verticalAlign?: "top" | "bottom"
  hideIcon?: boolean
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, payload, verticalAlign = "bottom", hideIcon = false }, ref) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = item.dataKey || item.value || "value"
          const itemConfig = config[key as keyof typeof config]

          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5"
            >
              {!hideIcon && (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color || itemConfig?.color }}
                />
              )}
              <span className="text-sm text-muted-foreground">
                {itemConfig?.label || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
