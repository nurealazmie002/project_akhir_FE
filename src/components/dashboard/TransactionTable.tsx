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
    <Card className="border-white/10 bg-white/5 py-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        {showViewAll && (
          <CardAction>
            <Button variant="link" onClick={onViewAll} className="text-emerald-400 p-0 h-auto">
              Lihat Semua
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">TANGGAL</TableHead>
              <TableHead className="text-gray-400">SANTRI</TableHead>
              <TableHead className="text-gray-400">TIPE</TableHead>
              <TableHead className="text-gray-400">JUMLAH</TableHead>
              <TableHead className="text-gray-400">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-gray-400">{tx.date}</TableCell>
                <TableCell className="text-white">{tx.studentName}</TableCell>
                <TableCell className="text-gray-400">{tx.type}</TableCell>
                <TableCell className="text-emerald-400">+ Rp {formatCurrency(tx.amount)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusVariant(tx.status)}
                    className={cn(
                      tx.status === 'LUNAS' && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                      tx.status === 'PENDING' && 'bg-amber-500/20 text-amber-400 border-amber-500/30'
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
