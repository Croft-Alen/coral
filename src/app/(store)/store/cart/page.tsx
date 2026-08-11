'use client'

import { StoreLayout } from '@/components/store/StoreLayout'
import { StoreSidebar } from '@/components/store/StoreSidebar'
import { CartPage as CartPageContent } from '@/components/store/CartPage'

export default function CartPage() {
  return (
    <StoreLayout
      sidebar={<StoreSidebar />}
    >
      <CartPageContent />
    </StoreLayout>
  )
}