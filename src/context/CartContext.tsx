'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

interface CartItem {
  id: string
  packageId: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface TebexCoupon {
  coupon_code: string
  [key: string]: any
}

interface TebexGiftCard {
  card_number: string | number
  code?: string | number
  [key: string]: any
}

interface CartContextType {
  items: CartItem[]
  basketId: string | null
  isLoading: boolean

  couponCode: string | null
  couponDiscount: number
  basketSubtotal: number
  basketTax: number
  basketTotal: number
  coupons: TebexCoupon[]
  giftCards: TebexGiftCard[]
  creatorCode: string | null

  addItem: (
    packageId: number,
    name: string,
    price: number,
    image?: string
  ) => Promise<void>

  removeItem: (packageId: number) => Promise<void>

  updateQuantity: (
    packageId: number,
    quantity: number
  ) => Promise<void>

  clearCart: () => void

  getTotal: () => number
  getItemCount: () => number

  checkout: () => Promise<string | null>

  syncBasket: () => Promise<void>

  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: (code: string) => Promise<boolean>

  applyGiftCard: (cardNumber: string) => Promise<boolean>
  removeGiftCard: (cardNumber: string) => Promise<boolean>

  applyCreatorCode: (code: string) => Promise<boolean>
  removeCreatorCode: (code: string) => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
)

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [basketId, setBasketId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const [couponCode, setCouponCode] =
    useState<string | null>(null)

  const [couponDiscount, setCouponDiscount] =
    useState(0)

  const [basketSubtotal, setBasketSubtotal] =
    useState(0)

  const [basketTax, setBasketTax] =
    useState(0)

  const [basketTotal, setBasketTotal] =
    useState(0)

  const [coupons, setCoupons] =
    useState<TebexCoupon[]>([])

  const [giftCards, setGiftCards] =
    useState<TebexGiftCard[]>([])

  const [creatorCode, setCreatorCode] =
    useState<string | null>(null)

  const { username, usernameId } = useAuth()

  const syncingRef = useRef(false)

  const initialSyncBasketRef =
    useRef<string | null>(null)

  /*
   * Every Minecraft player gets their own cart storage.
   *
   * usernameId is preferred because it is the stable
   * Tebex/Minecraft identity.
   *
   * Username is only used as a temporary fallback until
   * usernameId becomes available.
   */
  const cartStorageKey = usernameId
    ? `cart:${usernameId}`
    : username
      ? `cart:${username.toLowerCase()}`
      : null

  /*
   * Temporary username-based key.
   *
   * This is used only for migrating a cart from the
   * username fallback to the stable usernameId key.
   */
  const legacyCartStorageKey = username
    ? `cart:${username.toLowerCase()}`
    : null

  /*
   * Reset all in-memory cart state.
   *
   * This happens when switching players so the previous
   * player's basket can never remain visible.
   */
  const resetCartState = useCallback(() => {
    setItems([])
    setBasketId(null)

    setCouponCode(null)
    setCouponDiscount(0)
    setBasketSubtotal(0)
    setBasketTax(0)
    setBasketTotal(0)
    setCoupons([])
    setGiftCards([])
    setCreatorCode(null)

    initialSyncBasketRef.current = null
    syncingRef.current = false
  }, [])

  /*
   * Handle a basket that has become empty.
   *
   * Once Tebex confirms that a basket contains zero packages,
   * that basket is considered finished for local cart purposes.
   *
   * We intentionally do NOT attempt to delete the Tebex basket
   * itself here because the current client has no basket-delete
   * operation. Instead:
   *
   *   1. Forget the basketId locally.
   *   2. Clear all basket-specific state.
   *   3. Remove the local cart storage.
   *
   * The next addItem() call will create a fresh Tebex basket.
   */
  const handleEmptyBasket = useCallback(
    (storageKey: string | null) => {
      setItems([])
      setBasketId(null)

      setCouponCode(null)
      setCouponDiscount(0)
      setBasketSubtotal(0)
      setBasketTax(0)
      setBasketTotal(0)
      setCoupons([])
      setGiftCards([])
      setCreatorCode(null)

      initialSyncBasketRef.current = null

      if (storageKey) {
        localStorage.removeItem(storageKey)
      }
    },
    []
  )

  /*
   * If usernameId becomes available after login, migrate the
   * temporary username-based cart to the stable identity key.
   *
   * Example:
   *
   * Before Tebex identity is known:
   *
   *   cart:jone
   *
   * After usernameId becomes available:
   *
   *   cart:123456789
   *
   * The old fallback key is removed so the same player does not
   * end up with two independent local carts.
   *
   * We never merge two existing baskets because two Tebex
   * basket IDs cannot safely be combined client-side.
   */
  useEffect(() => {
    if (!usernameId) return
    if (!legacyCartStorageKey) return

    const stableCartStorageKey =
      `cart:${usernameId}`

    if (
      legacyCartStorageKey ===
      stableCartStorageKey
    ) {
      return
    }

    try {
      const legacySaved =
        localStorage.getItem(
          legacyCartStorageKey
        )

      if (!legacySaved) {
        return
      }

      const stableSaved =
        localStorage.getItem(
          stableCartStorageKey
        )

      /*
       * If a stable identity cart already exists, keep it.
       *
       * We deliberately do not merge the two carts because
       * each may contain a different Tebex basketId.
       */
      if (stableSaved) {
        localStorage.removeItem(
          legacyCartStorageKey
        )

        return
      }

      /*
       * Move the entire existing username-based cart
       * to the stable usernameId-based key.
       */
      localStorage.setItem(
        stableCartStorageKey,
        legacySaved
      )

      localStorage.removeItem(
        legacyCartStorageKey
      )
    } catch (error) {
      console.error(
        'Error migrating cart to stable player identity:',
        error
      )
    }
  }, [
    usernameId,
    legacyCartStorageKey,
  ])

  /*
   * Load the cart belonging to the currently selected
   * Minecraft player.
   *
   * If usernameId exists, the stable identity key is used.
   *
   * Jone -> cart:JONE_ID
   * Aio  -> cart:AIO_ID
   */
  useEffect(() => {
    if (!cartStorageKey) {
      resetCartState()
      setIsHydrated(false)
      setIsLoading(false)
      return
    }

    setIsHydrated(false)
    setIsLoading(true)

    resetCartState()

    try {
      const saved =
        localStorage.getItem(cartStorageKey)

      if (saved) {
        const parsed = JSON.parse(saved)

        if (Array.isArray(parsed.items)) {
          setItems(parsed.items)
        }

        if (
          typeof parsed.basketId === 'string' &&
          parsed.basketId.trim()
        ) {
          setBasketId(parsed.basketId)
        }

        if (
          typeof parsed.couponCode === 'string' &&
          parsed.couponCode.trim()
        ) {
          setCouponCode(parsed.couponCode)
        }

        if (
          typeof parsed.couponDiscount === 'number' &&
          Number.isFinite(parsed.couponDiscount)
        ) {
          setCouponDiscount(parsed.couponDiscount)
        }

        if (
          typeof parsed.basketSubtotal === 'number' &&
          Number.isFinite(parsed.basketSubtotal)
        ) {
          setBasketSubtotal(parsed.basketSubtotal)
        }

        if (
          typeof parsed.basketTax === 'number' &&
          Number.isFinite(parsed.basketTax)
        ) {
          setBasketTax(parsed.basketTax)
        }

        if (
          typeof parsed.basketTotal === 'number' &&
          Number.isFinite(parsed.basketTotal)
        ) {
          setBasketTotal(parsed.basketTotal)
        }

        if (Array.isArray(parsed.coupons)) {
          setCoupons(parsed.coupons)
        }

        if (Array.isArray(parsed.giftCards)) {
          setGiftCards(parsed.giftCards)
        }

        if (
          typeof parsed.creatorCode === 'string' &&
          parsed.creatorCode.trim()
        ) {
          setCreatorCode(parsed.creatorCode)
        }
      }
    } catch (error) {
      console.error(
        'Error loading cart:',
        error
      )

      localStorage.removeItem(cartStorageKey)
    } finally {
      setIsHydrated(true)
      setIsLoading(false)
    }
  }, [
    cartStorageKey,
    resetCartState,
  ])

  /*
   * Persist the current player's cart only to that
   * player's storage key.
   */
  useEffect(() => {
    if (!isHydrated) return
    if (!cartStorageKey) return

    /*
     * An empty cart with no basket is not persisted.
     *
     * This keeps the local lifecycle explicit:
     *
     *   items = []
     *   basketId = null
     *
     * means there is no active local basket.
     */
    if (
      items.length === 0 &&
      basketId === null
    ) {
      localStorage.removeItem(
        cartStorageKey
      )

      return
    }

    localStorage.setItem(
      cartStorageKey,
      JSON.stringify({
        items,
        basketId,
        couponCode,
        couponDiscount,
        basketSubtotal,
        basketTax,
        basketTotal,
        coupons,
        giftCards,
        creatorCode,
      })
    )
  }, [
    items,
    basketId,
    couponCode,
    couponDiscount,
    basketSubtotal,
    basketTax,
    basketTotal,
    coupons,
    giftCards,
    creatorCode,
    isHydrated,
    cartStorageKey,
  ])

  const mapBasketItems = useCallback(
    (packages: any[]): CartItem[] => {
      let savedItems: CartItem[] = []

      try {
        if (cartStorageKey) {
          const saved =
            localStorage.getItem(
              cartStorageKey
            )

          if (saved) {
            const parsed = JSON.parse(saved)

            if (Array.isArray(parsed.items)) {
              savedItems = parsed.items
            }
          }
        }
      } catch {
        savedItems = []
      }

      return packages.map((pkg: any) => {
        const packageId = Number(pkg.id)

        const existingItem =
          savedItems.find(
            item =>
              Number(item.packageId) ===
              packageId
          )

        const packagePrice =
          Number(pkg.price)

        const basketPrice =
          Number(pkg.in_basket?.price)

        let price = 0

        if (
          Number.isFinite(packagePrice) &&
          packagePrice > 0
        ) {
          price = packagePrice
        } else if (
          Number.isFinite(basketPrice) &&
          basketPrice > 0
        ) {
          price = basketPrice
        } else if (
          existingItem &&
          Number.isFinite(
            Number(existingItem.price)
          )
        ) {
          price = Number(existingItem.price)
        }

        const tebexQuantity =
          Number(
            pkg.in_basket?.quantity
          )

        const legacyQuantity =
          Number(pkg.quantity)

        const quantity =
          tebexQuantity > 0
            ? tebexQuantity
            : legacyQuantity > 0
              ? legacyQuantity
              : existingItem?.quantity || 1

        const image =
          pkg.image ||
          pkg.icon ||
          existingItem?.image

        return {
          id:
            existingItem?.id ||
            packageId.toString(),

          packageId,

          name:
            pkg.name ||
            existingItem?.name ||
            'Unknown Product',

          price,
          quantity,
          image,
        }
      })
    },
    [cartStorageKey]
  )

  const applyBasket = useCallback(
    (basket: any) => {
      if (!basket) return

      const packages =
        Array.isArray(basket.packages)
          ? basket.packages
          : []

      /*
       * IMPORTANT:
       *
       * Tebex has confirmed that this basket contains
       * no packages.
       *
       * The current Tebex basket is therefore considered
       * finished locally. We discard its basketId and
       * basket-specific state so the next purchase starts
       * with a new basket.
       */
      if (packages.length === 0) {
        handleEmptyBasket(
          cartStorageKey
        )

        return
      }

      const mappedItems =
        mapBasketItems(packages)

      setItems(mappedItems)

      if (basket.ident) {
        setBasketId(basket.ident)
      }

      const basePrice =
        Number(basket.base_price)

      const salesTax =
        Number(basket.sales_tax)

      const totalPrice =
        Number(basket.total_price)

      if (Number.isFinite(basePrice)) {
        setBasketSubtotal(
          Math.max(0, basePrice)
        )
      }

      if (Number.isFinite(salesTax)) {
        setBasketTax(
          Math.max(0, salesTax)
        )
      }

      if (Number.isFinite(totalPrice)) {
        setBasketTotal(
          Math.max(0, totalPrice)
        )
      }

      const tebexCoupons =
        Array.isArray(basket.coupons)
          ? basket.coupons
          : []

      setCoupons(tebexCoupons)

      if (tebexCoupons.length > 0) {
        const firstCoupon =
          tebexCoupons[0]

        if (
          firstCoupon &&
          typeof firstCoupon.coupon_code ===
            'string'
        ) {
          setCouponCode(
            firstCoupon.coupon_code
          )
        }
      } else {
        setCouponCode(null)
        setCouponDiscount(0)
      }

      const tebexGiftCards =
        Array.isArray(
          basket.giftcards
        )
          ? basket.giftcards
          : []

      setGiftCards(tebexGiftCards)

      if (
        typeof basket.creator_code ===
          'string' &&
        basket.creator_code.trim()
      ) {
        setCreatorCode(
          basket.creator_code
        )
      } else {
        setCreatorCode(null)
      }

      if (
        Number.isFinite(basePrice) &&
        Number.isFinite(totalPrice)
      ) {
        const calculatedDiscount =
          Math.max(
            0,
            basePrice - totalPrice
          )

        setCouponDiscount(
          calculatedDiscount
        )
      }
    },
    [
      cartStorageKey,
      handleEmptyBasket,
      mapBasketItems,
    ]
  )

  const syncBasket = useCallback(
    async () => {
      if (!basketId) return
      if (syncingRef.current) return

      syncingRef.current = true

      try {
        setIsLoading(true)

        const response = await fetch(
          `/api/tebex/basket?basketId=${encodeURIComponent(
            basketId
          )}`,
          {
            cache: 'no-store',
          }
        )

        const data =
          await response.json()

        if (
          data.success &&
          data.data
        ) {
          applyBasket(data.data)
        }
      } catch (error) {
        console.error(
          'Error syncing basket:',
          error
        )
      } finally {
        syncingRef.current = false
        setIsLoading(false)
      }
    },
    [basketId, applyBasket]
  )

  useEffect(() => {
    if (!isHydrated) return
    if (!username) return
    if (!basketId) return

    if (
      initialSyncBasketRef.current ===
      basketId
    ) {
      return
    }

    initialSyncBasketRef.current =
      basketId

    syncBasket()
  }, [
    isHydrated,
    username,
    basketId,
    syncBasket,
  ])

  const addItem = async (
    packageId: number,
    name: string,
    price: number,
    image?: string
  ) => {
    if (!username) {
      toast.warning(
        'Please login first to add items to your cart.'
      )
      return
    }

    try {
      setIsLoading(true)

      const existingItem =
        items.find(
          item =>
            item.packageId === packageId
        )

      const newQuantity =
        existingItem
          ? existingItem.quantity + 1
          : 1

      let currentBasketId = basketId

      if (!currentBasketId) {
        const response = await fetch(
          '/api/tebex/basket',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              packageId,
              quantity: newQuantity,
              username,
            }),
          }
        )

        const data =
          await response.json()

        if (
          !data.success ||
          !data.data
        ) {
          throw new Error(
            data.error ||
              'Failed to create basket'
          )
        }

        currentBasketId =
          data.data.ident

        setBasketId(currentBasketId)

        applyBasket(data.data)

        initialSyncBasketRef.current =
          currentBasketId
      } else {
        const response = await fetch(
          '/api/tebex/basket',
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              basketId:
                currentBasketId,
              packageId,
              quantity:
                newQuantity,
              username,
            }),
          }
        )

        const data =
          await response.json()

        if (
          !data.success ||
          !data.data
        ) {
          throw new Error(
            data.error ||
              'Failed to update basket'
          )
        }

        applyBasket(data.data)

        initialSyncBasketRef.current =
          currentBasketId
      }

      toast.success(
        `${name} added to cart`
      )
    } catch (error) {
      console.error(
        'Error adding item:',
        error
      )

      toast.error(
        'Failed to add item to cart. Please try again.'
      )

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (
    packageId: number
  ) => {
    if (!basketId) return

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return
    }

    try {
      setIsLoading(true)

      const removedItem =
        items.find(
          item =>
            item.packageId === packageId
        )

      const response = await fetch(
        '/api/tebex/basket',
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            packageId,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (!data.success) {
        throw new Error(
          data.error ||
            'Failed to remove item'
        )
      }

      /*
       * If the API returned the updated basket,
       * use Tebex's actual state as the source of truth.
       *
       * This is important because the basket may have
       * become completely empty on Tebex.
       */
      if (data.data) {
        applyBasket(data.data)
      } else {
        /*
         * Fallback for an API response that only confirms
         * deletion without returning the updated basket.
         */
        const remainingItems =
          items.filter(
            item =>
              item.packageId !==
              packageId
          )

        setItems(remainingItems)

        if (
          remainingItems.length === 0
        ) {
          handleEmptyBasket(
            cartStorageKey
          )
        }
      }

      if (removedItem) {
        toast.info(
          `${removedItem.name} removed from cart`
        )
      }
    } catch (error) {
      console.error(
        'Error removing item:',
        error
      )

      toast.error(
        'Failed to remove item from cart'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (
    packageId: number,
    quantity: number
  ) => {
    if (quantity < 1) {
      await removeItem(packageId)
      return
    }

    if (!basketId) return

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket',
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            packageId,
            quantity,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !data.success ||
        !data.data
      ) {
        throw new Error(
          data.error ||
            'Failed to update quantity'
        )
      }

      applyBasket(data.data)

      initialSyncBasketRef.current =
        basketId
    } catch (error) {
      console.error(
        'Error updating quantity:',
        error
      )

      toast.error(
        'Failed to update quantity'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const applyCoupon = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) {
      toast.warning(
        'Your cart is empty.'
      )
      return false
    }

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return false
    }

    const normalizedCode =
      code.trim().toUpperCase()

    if (!normalizedCode) {
      toast.warning(
        'Please enter a coupon code.'
      )
      return false
    }

    const alreadyApplied =
      coupons.some(coupon => {
        const couponCode =
          coupon?.coupon_code ||
          coupon?.code ||
          coupon?.name ||
          ''

        return (
          couponCode.toUpperCase() ===
          normalizedCode
        )
      })

    if (alreadyApplied) {
      toast.info(
        'Coupon already applied.'
      )

      await syncBasket()

      return false
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket/coupon',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            couponCode:
              normalizedCode,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        if (
          data.error?.includes(
            'already applied'
          ) ||
          data.detail?.includes(
            'already applied'
          )
        ) {
          await syncBasket()

          toast.info(
            'Coupon already applied.'
          )

          return false
        }

        throw new Error(
          data.error ||
            'Failed to apply coupon'
        )
      }

      await syncBasket()

      toast.success(
        'Coupon applied successfully.'
      )

      return true
    } catch (error: any) {
      console.error(
        'Error applying coupon:',
        error
      )

      toast.error(
        error?.message ||
          'Invalid or unavailable coupon code.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeCoupon = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) return false

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return false
    }

    const normalizedCode =
      code.trim().toUpperCase()

    if (!normalizedCode) return false

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket/coupon',
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            couponCode:
              normalizedCode,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            'Failed to remove coupon'
        )
      }

      await syncBasket()

      toast.info(
        'Coupon removed.'
      )

      return true
    } catch (error: any) {
      console.error(
        'Error removing coupon:',
        error
      )

      toast.error(
        error?.message ||
          'Failed to remove coupon.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const applyGiftCard = async (
    cardNumber: string
  ): Promise<boolean> => {
    if (!basketId) {
      toast.warning(
        'Your cart is empty.'
      )
      return false
    }

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return false
    }

    const normalizedCard =
      cardNumber.trim()

    if (!normalizedCard) {
      toast.warning(
        'Please enter a gift card number.'
      )
      return false
    }

    const alreadyApplied =
      giftCards.some(giftCard => {
        const card =
          giftCard?.card_number ||
          giftCard?.code ||
          ''

        return (
          String(card) ===
          normalizedCard
        )
      })

    if (alreadyApplied) {
      toast.info(
        'Gift card already applied.'
      )

      await syncBasket()

      return false
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket/giftcard',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            cardNumber:
              normalizedCard,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        if (
          data.error?.includes(
            'already applied'
          ) ||
          data.detail?.includes(
            'already applied'
          )
        ) {
          await syncBasket()

          toast.info(
            'Gift card already applied.'
          )

          return false
        }

        throw new Error(
          data.error ||
            'Failed to apply gift card'
        )
      }

      await syncBasket()

      toast.success(
        'Gift card applied successfully.'
      )

      return true
    } catch (error: any) {
      console.error(
        'Error applying gift card:',
        error
      )

      toast.error(
        error?.message ||
          'Invalid or unavailable gift card.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeGiftCard = async (
    cardNumber: string
  ): Promise<boolean> => {
    if (!basketId) return false

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return false
    }

    const normalizedCard =
      String(cardNumber).trim()

    if (!normalizedCard) return false

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket/giftcard',
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            cardNumber:
              normalizedCard,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            'Failed to remove gift card'
        )
      }

      await syncBasket()

      toast.info(
        'Gift card removed.'
      )

      return true
    } catch (error: any) {
      console.error(
        'Error removing gift card:',
        error
      )

      toast.error(
        error?.message ||
          'Failed to remove gift card.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const applyCreatorCode = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) {
      toast.warning(
        'Your cart is empty.'
      )
      return false
    }

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return false
    }

    const normalizedCode =
      code.trim()

    if (!normalizedCode) {
      toast.warning(
        'Please enter a creator code.'
      )
      return false
    }

    if (
      creatorCode &&
      creatorCode.toLowerCase() ===
        normalizedCode.toLowerCase()
    ) {
      toast.info(
        'Creator code already applied.'
      )

      await syncBasket()

      return false
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket/creator-code',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            creatorCode:
              normalizedCode,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        if (
          data.error?.includes(
            'already applied'
          ) ||
          data.detail?.includes(
            'already applied'
          )
        ) {
          await syncBasket()

          toast.info(
            'Creator code already applied.'
          )

          return false
        }

        throw new Error(
          data.error ||
            'Failed to apply creator code'
        )
      }

      await syncBasket()

      toast.success(
        'Creator code applied successfully.'
      )

      return true
    } catch (error: any) {
      console.error(
        'Error applying creator code:',
        error
      )

      toast.error(
        error?.message ||
          'Invalid or unavailable creator code.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeCreatorCode = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) return false

    if (!username) {
      toast.warning(
        'Please login first.'
      )
      return false
    }

    const normalizedCode =
      String(code).trim()

    if (!normalizedCode) return false

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/tebex/basket/creator-code',
        {
          method: 'DELETE',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            basketId,
            creatorCode:
              normalizedCode,
            username,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            'Failed to remove creator code'
        )
      }

      await syncBasket()

      toast.info(
        'Creator code removed.'
      )

      return true
    } catch (error: any) {
      console.error(
        'Error removing creator code:',
        error
      )

      toast.error(
        error?.message ||
          'Failed to remove creator code.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = () => {
    resetCartState()

    if (cartStorageKey) {
      localStorage.removeItem(
        cartStorageKey
      )
    }

    toast.info('Cart cleared')
  }

  const getTotal = () => {
    return items.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    )
  }

  const getItemCount = () => {
    return items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity),
      0
    )
  }

  const checkout =
    async (): Promise<string | null> => {
      if (!basketId) return null

      if (!username) {
        toast.warning(
          'Please login first.'
        )
        return null
      }

      try {
        setIsLoading(true)

        const response = await fetch(
          '/api/tebex/checkout',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              basketId,
            }),
          }
        )

        const data =
          await response.json()

        if (data.success) {
          return data.checkoutUrl
        }

        return null
      } catch (error) {
        console.error(
          'Error during checkout:',
          error
        )

        toast.error(
          'Failed to start checkout. Please try again.'
        )

        return null
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <CartContext.Provider
      value={{
        items,
        basketId,
        isLoading,

        couponCode,
        couponDiscount,
        basketSubtotal,
        basketTax,
        basketTotal,
        coupons,
        giftCards,
        creatorCode,

        addItem,
        removeItem,
        updateQuantity,
        clearCart,

        getTotal,
        getItemCount,

        checkout,
        syncBasket,

        applyCoupon,
        removeCoupon,

        applyGiftCard,
        removeGiftCard,

        applyCreatorCode,
        removeCreatorCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(CartContext)

  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider'
    )
  }

  return context
}

