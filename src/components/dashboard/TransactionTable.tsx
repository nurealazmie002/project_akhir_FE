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
import type { Transaction } from '@/types'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  title: string
  showViewAll?: boolean
  onViewAll?: () => void
}

export function TransactionTable({
  transactions,
  title,
  showViewAll = true,
  onViewAll,
}: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount)
  }

  const getStatusVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'LUNAS':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'GAGAL':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card className="border-border bg-card py-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        {showViewAll && (
          <CardAction>
            <Button variant="link" onClick={onViewAll} className="text-primary p-0 h-auto">
              Lihat Semua
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">TANGGAL</TableHead>
              <TableHead className="text-muted-foreground">SANTRI</TableHead>
              <TableHead className="text-muted-foreground">TIPE</TableHead>
              <TableHead className="text-muted-foreground">JUMLAH</TableHead>
              <TableHead className="text-muted-foreground">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-border hover:bg-accent">
                <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                <TableCell className="text-foreground">{tx.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{tx.type}</TableCell>
                <TableCell className="text-emerald-600 dark:text-emerald-400">+ Rp {formatCurrency(tx.amount)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusVariant(tx.status)}
                    className={cn(
                      tx.status === 'LUNAS' && 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                      tx.status === 'PENDING' && 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    )}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
