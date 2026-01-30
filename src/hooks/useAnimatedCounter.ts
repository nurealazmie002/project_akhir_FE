import { useState, useEffect, useRef } from 'react'

export function useAnimatedCounter(endValue: string | number): string {
  const [displayValue, setDisplayValue] = useState(endValue)
  const previousValue = useRef(endValue)

  useEffect(() => {
    // Extract numeric value from string (e.g., "Rp 1,000,000" -> 1000000)
    const extractNumber = (val: string | number): number => {
      if (typeof val === 'number') return val
      const cleaned = val.replace(/[^\d.-]/g, '')
      return parseFloat(cleaned) || 0
    }

    const formatNumber = (num: number, template: string): string => {
      // If template contains "Rp", format as Indonesian currency
      if (template.includes('Rp')) {
        const formatted = new Intl.NumberFormat('id-ID').format(Math.round(num))
        return template.replace(/[\d.,]+/, formatted)
      }
      // If template contains "Santri" or other text, keep the format
      if (template.includes('Santri')) {
        return `${Math.round(num)} Santri`
      }
      // Default: just format the number
      return new Intl.NumberFormat('id-ID').format(Math.round(num))
    }

    const startNum = extractNumber(previousValue.current)
    const endNum = extractNumber(endValue)
    
    if (startNum === endNum) {
      setDisplayValue(endValue)
      return
    }

    const duration = 600 // ms
    const steps = 30
    const stepDuration = duration / steps
    const increment = (endNum - startNum) / steps

    let currentStep = 0
    let currentNum = startNum

    const timer = setInterval(() => {
      currentStep++
      currentNum += increment

      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayValue(endValue)
        previousValue.current = endValue
      } else {
        setDisplayValue(formatNumber(currentNum, String(endValue)))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [endValue])

  return String(displayValue)
}
