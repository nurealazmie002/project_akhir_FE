import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Printer } from 'lucide-react'
import type { DashboardTransaction } from '@/types/dashboard.types'

interface TransactionTableProps {
  transactions: DashboardTransaction[]
  title: string
  showViewAll?: boolean
  onViewAll?: () => void
  onRowClick?: (transaction: DashboardTransaction) => void
}

export function TransactionTable({
  transactions,
  title,
  showViewAll = true,
  onViewAll,
  onRowClick,
}: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const getStatusConfig = (status: DashboardTransaction['status']) => {
    switch (status) {
      case 'LUNAS':
        return {
          className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
          label: 'Lunas'
        }
      case 'PENDING':
        return {
          className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
          label: 'Pending'
        }
      case 'GAGAL':
        return {
          className: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
          label: 'Gagal'
        }
      default:
        return {
          className: 'bg-muted text-muted-foreground',
          label: status
        }
    }
  }

  return (
    <Card className="border bg-card">
      <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-semibold">{title}</CardTitle>
          {showViewAll && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onViewAll} 
              className="text-primary hover:text-primary gap-1 h-7 sm:h-8 text-xs sm:text-sm px-2"
            >
              Lihat Semua
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center text-muted-foreground">
            <p className="text-xs sm:text-sm">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground pl-3 sm:pl-6">Tanggal</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground">Santri</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden sm:table-cell">Tipe</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground">Jumlah</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden sm:table-cell">Status</TableHead>
                  {onRowClick && <TableHead className="w-10 sm:w-12"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const statusConfig = getStatusConfig(tx.status)
                  return (
                    <TableRow 
                      key={tx.id} 
                      className={cn(
                        'transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-muted/50'
                      )}
                      onClick={() => onRowClick?.(tx)}
                    >
                      <TableCell className="text-[11px] sm:text-sm text-muted-foreground pl-3 sm:pl-6 py-2 sm:py-3">{tx.date}</TableCell>
                      <TableCell className="text-[11px] sm:text-sm font-medium py-2 sm:py-3 max-w-[100px] sm:max-w-none truncate">{tx.studentName}</TableCell>
                      <TableCell className="text-[11px] sm:text-sm text-muted-foreground hidden sm:table-cell py-2 sm:py-3">{tx.type}</TableCell>
                      <TableCell className="text-[11px] sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 py-2 sm:py-3 whitespace-nowrap">
                        +Rp {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-2 sm:py-3">
                        <Badge variant="secondary" className={cn('text-[10px] sm:text-xs font-medium', statusConfig.className)}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      {onRowClick && (
                        <TableCell className="py-2 sm:py-3 pr-3 sm:pr-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRowClick(tx)
                            }}
                          >
                            <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
