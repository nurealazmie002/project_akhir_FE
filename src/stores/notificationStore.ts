import { create } from 'zustand'
import { invoiceService } from '@/services/invoiceService'
import { santriService } from '@/services/santriService'
import type { Invoice } from '@/types/invoice.types'

interface NotificationState {
  unpaidInvoices: Invoice[]
  isLoading: boolean
  fetchUnpaidInvoices: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unpaidInvoices: [],
  isLoading: false,
  fetchUnpaidInvoices: async () => {
    set({ isLoading: true })
    try {
      const response = await invoiceService.getAll()
      const unpaid = response.data.filter(
        (inv) => inv.status === 'PENDING' || inv.status === 'UNPAID'
      )
      
      // Enrich top 5 invoices if santri name is missing
      const topInvoices = unpaid.slice(0, 5)
      const invoicesToEnrich = topInvoices.filter(inv => !inv.santri?.fullname || inv.santri.fullname === 'Unknown')
      
      if (invoicesToEnrich.length > 0) {
        const enrichedDetails = await Promise.all(
          invoicesToEnrich.map(async (inv) => {
            try {
              const santri = await santriService.getById(inv.santriId)
              return { invoiceId: inv.id, santri }
            } catch (e) {
              return { invoiceId: inv.id, santri: null }
            }
          })
        )

        // Update the unpaid array with enriched data
        const enrichedUnpaid = unpaid.map(inv => {
          const detail = enrichedDetails.find(d => d.invoiceId === inv.id)
          if (detail && detail.santri) {
            return {
              ...inv,
              santri: {
                id: String(detail.santri.id),
                fullname: detail.santri.fullname,
                nis: detail.santri.nis
              }
            }
          }
          return inv
        })
        
        set({ unpaidInvoices: enrichedUnpaid })
      } else {
        set({ unpaidInvoices: unpaid })
      }
    } catch (err) {
      console.error('Failed to fetch unpaid invoices:', err)
    } finally {
      set({ isLoading: false })
    }
  },
}))
