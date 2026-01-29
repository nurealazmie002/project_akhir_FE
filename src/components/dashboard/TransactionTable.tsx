import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
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
import { ArrowRight, Receipt, Printer } from 'lucide-react'
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
          className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          label: 'Lunas'
        }
      case 'PENDING':
        return {
          className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          label: 'Pending'
        }
      case 'GAGAL':
        return {
          className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
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
    <Card className="border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Receipt size={18} className="text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </div>
        {showViewAll && (
          <CardAction>
            <Button 
              variant="ghost" 
              onClick={onViewAll} 
              className="text-primary hover:text-primary hover:bg-primary/10 gap-1 group"
            >
              Lihat Semua
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[500px]">
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Santri</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipe</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jumlah</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                  {onRowClick && (
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => {
                  const statusConfig = getStatusConfig(tx.status)
                  return (
                    <TableRow 
                      key={tx.id} 
                      className={cn(
                        'border-border/50 transition-colors',
                        index % 2 === 0 ? 'bg-muted/20' : 'bg-transparent',
                        'hover:bg-primary/5',
                        onRowClick && 'cursor-pointer'
                      )}
                      onClick={() => onRowClick?.(tx)}
                    >
                      <TableCell className="text-sm text-muted-foreground font-medium">{tx.date}</TableCell>
                      <TableCell className="text-sm font-medium text-foreground">{tx.studentName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tx.type}</TableCell>
                      <TableCell className="text-sm font-semibold text-emerald-500">+ Rp {formatCurrency(tx.amount)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn('font-medium border', statusConfig.className)}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      {onRowClick && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRowClick(tx)
                            }}
                          >
                            <Printer size={16} />
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
