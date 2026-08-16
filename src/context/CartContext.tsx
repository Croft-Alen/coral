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
import { useToast } from './ToastContext'

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
  basketComplete: boolean | null
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

  removeItem: (
    packageId: number
  ) => Promise<void>

  updateQuantity: (
    packageId: number,
    quantity: number
  ) => Promise<void>

  clearCart: () => void

  getTotal: () => number

  getItemCount: () => number

  checkout: () => Promise<string | null>

  syncBasket: () => Promise<void>

  applyCoupon: (
    code: string
  ) => Promise<boolean>

  removeCoupon: (
    code: string
  ) => Promise<boolean>

  applyGiftCard: (
    cardNumber: string
  ) => Promise<boolean>

  removeGiftCard: (
    cardNumber: string
  ) => Promise<boolean>

  applyCreatorCode: (
    code: string
  ) => Promise<boolean>

  removeCreatorCode: (
    code: string
  ) => Promise<boolean>
}

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  )

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])

  const [basketId, setBasketId] =
    useState<string | null>(null)

  /*
   * null = basket has not been verified yet.
   * true = Tebex says the basket is complete.
   * false = Tebex says the basket is not complete.
   */
  const [basketComplete, setBasketComplete] =
    useState<boolean | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [isHydrated, setIsHydrated] =
    useState(false)

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

  const {
    success,
    error,
    warning,
    info,
  } = useToast()

  const syncingRef = useRef(false)

  const initialSyncBasketRef =
    useRef<string | null>(null)

  const cartStorageKey = usernameId
    ? `cart:${usernameId}`
    : username
      ? `cart:${username.toLowerCase()}`
      : null

  const legacyCartStorageKey = username
    ? `cart:${username.toLowerCase()}`
    : null

  /*
   * Reset all cart state.
   */
  const resetCartState = useCallback(() => {
    setItems([])
    setBasketId(null)
    setBasketComplete(null)
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
   * Handle an empty Tebex basket.
   */
  const handleEmptyBasket = useCallback(
    (storageKey: string | null) => {
      setItems([])
      setBasketId(null)
      setBasketComplete(null)
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
   * Migrate old username-based cart storage
   * to stable usernameId-based storage.
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

      if (!legacySaved) return

      const stableSaved =
        localStorage.getItem(
          stableCartStorageKey
        )

      if (stableSaved) {
        localStorage.removeItem(
          legacyCartStorageKey
        )

        return
      }

      localStorage.setItem(
        stableCartStorageKey,
        legacySaved
      )

      localStorage.removeItem(
        legacyCartStorageKey
      )
    } catch {
      console.warn(
        '[Cart] Could not migrate saved cart.'
      )
    }
  }, [
    usernameId,
    legacyCartStorageKey,
  ])

  /*
   * Load cart from localStorage.
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
        localStorage.getItem(
          cartStorageKey
        )

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

        /*
         * Do not restore basketComplete from localStorage.
         *
         * Completion is payment state and must be
         * verified from the current Tebex basket.
         */
        setBasketComplete(null)

        if (
          typeof parsed.couponCode === 'string' &&
          parsed.couponCode.trim()
        ) {
          setCouponCode(parsed.couponCode)
        }

        if (
          typeof parsed.couponDiscount ===
            'number' &&
          Number.isFinite(
            parsed.couponDiscount
          )
        ) {
          setCouponDiscount(
            parsed.couponDiscount
          )
        }

        if (
          typeof parsed.basketSubtotal ===
            'number' &&
          Number.isFinite(
            parsed.basketSubtotal
          )
        ) {
          setBasketSubtotal(
            parsed.basketSubtotal
          )
        }

        if (
          typeof parsed.basketTax === 'number' &&
          Number.isFinite(
            parsed.basketTax
          )
        ) {
          setBasketTax(parsed.basketTax)
        }

        if (
          typeof parsed.basketTotal ===
            'number' &&
          Number.isFinite(
            parsed.basketTotal
          )
        ) {
          setBasketTotal(
            parsed.basketTotal
          )
        }

        if (Array.isArray(parsed.coupons)) {
          setCoupons(parsed.coupons)
        }

        if (
          Array.isArray(parsed.giftCards)
        ) {
          setGiftCards(parsed.giftCards)
        }

        if (
          typeof parsed.creatorCode ===
            'string' &&
          parsed.creatorCode.trim()
        ) {
          setCreatorCode(
            parsed.creatorCode
          )
        }
      }
    } catch {
      console.warn(
        '[Cart] Could not load saved cart.'
      )

      localStorage.removeItem(
        cartStorageKey
      )
    } finally {
      setIsHydrated(true)
      setIsLoading(false)
    }
  }, [
    cartStorageKey,
    resetCartState,
  ])

  /*
   * Persist cart to localStorage.
   *
   * basketComplete is intentionally NOT persisted.
   * Payment completion must always come from Tebex.
   */
  useEffect(() => {
    if (!isHydrated) return
    if (!cartStorageKey) return

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

  /*
   * Convert Tebex basket packages
   * into CartItem structures.
   */
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
            const parsed =
              JSON.parse(saved)

            if (
              Array.isArray(parsed.items)
            ) {
              savedItems =
                parsed.items
            }
          }
        }
      } catch {
        console.warn(
          '[Cart] Could not read saved cart items.'
        )

        savedItems = []
      }

      return packages.map((pkg: any) => {
        const packageId =
          Number(pkg.id)

        const existingItem =
          savedItems.find(
            item =>
              Number(
                item.packageId
              ) === packageId
          )

        const packagePrice =
          Number(pkg.price)

        const basketPrice =
          Number(
            pkg.in_basket?.price
          )

        let price = 0

        if (
          Number.isFinite(
            packagePrice
          ) &&
          packagePrice > 0
        ) {
          price = packagePrice
        } else if (
          Number.isFinite(
            basketPrice
          ) &&
          basketPrice > 0
        ) {
          price = basketPrice
        } else if (
          existingItem &&
          Number.isFinite(
            Number(
              existingItem.price
            )
          )
        ) {
          price = Number(
            existingItem.price
          )
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
              : existingItem?.quantity ||
                1

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

  /*
   * Apply a Tebex basket response.
   *
   * IMPORTANT:
   * basket.complete is now the single source of truth
   * for payment completion.
   */
  const applyBasket = useCallback(
    (basket: any) => {
      if (!basket) return

      const packages =
        Array.isArray(
          basket.packages
        )
          ? basket.packages
          : []

      /*
       * Update completion state BEFORE handling
       * empty-basket logic.
       *
       * This matters because Tebex can return a
       * completed basket during the payment flow.
       */
      if (
        typeof basket.complete === 'boolean'
      ) {
        setBasketComplete(
          basket.complete
        )
      } else {
        setBasketComplete(null)
      }

      if (packages.length === 0) {
        /*
         * Do not blindly interpret an empty completed
         * basket as an invalid basket.
         *
         * A completed Tebex basket can legitimately
         * have its contents changed/cleared after checkout.
         */
        if (basket.complete === true) {
          if (basket.ident) {
            setBasketId(
              basket.ident
            )
          }

          const basePrice =
            Number(
              basket.base_price
            )

          const salesTax =
            Number(
              basket.sales_tax
            )

          const totalPrice =
            Number(
              basket.total_price
            )

          if (
            Number.isFinite(
              basePrice
            )
          ) {
            setBasketSubtotal(
              Math.max(
                0,
                basePrice
              )
            )
          }

          if (
            Number.isFinite(
              salesTax
            )
          ) {
            setBasketTax(
              Math.max(
                0,
                salesTax
              )
            )
          }

          if (
            Number.isFinite(
              totalPrice
            )
          ) {
            setBasketTotal(
              Math.max(
                0,
                totalPrice
              )
            )
          }

          const tebexCoupons =
            Array.isArray(
              basket.coupons
            )
              ? basket.coupons
              : []

          setCoupons(
            tebexCoupons
          )

          const tebexGiftCards =
            Array.isArray(
              basket.giftcards
            )
              ? basket.giftcards
              : []

          setGiftCards(
            tebexGiftCards
          )

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

          return
        }

        handleEmptyBasket(
          cartStorageKey
        )

        return
      }

      const mappedItems =
        mapBasketItems(packages)

      setItems(mappedItems)

      if (basket.ident) {
        setBasketId(
          basket.ident
        )
      }

      const basePrice =
        Number(
          basket.base_price
        )

      const salesTax =
        Number(
          basket.sales_tax
        )

      const totalPrice =
        Number(
          basket.total_price
        )

      if (
        Number.isFinite(
          basePrice
        )
      ) {
        setBasketSubtotal(
          Math.max(
            0,
            basePrice
          )
        )
      }

      if (
        Number.isFinite(
          salesTax
        )
      ) {
        setBasketTax(
          Math.max(
            0,
            salesTax
          )
        )
      }

      if (
        Number.isFinite(
          totalPrice
        )
      ) {
        setBasketTotal(
          Math.max(
            0,
            totalPrice
          )
        )
      }

      const tebexCoupons =
        Array.isArray(
          basket.coupons
        )
          ? basket.coupons
          : []

      setCoupons(
        tebexCoupons
      )

      if (
        tebexCoupons.length > 0
      ) {
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

      setGiftCards(
        tebexGiftCards
      )

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
        Number.isFinite(
          basePrice
        ) &&
        Number.isFinite(
          totalPrice
        )
      ) {
        const calculatedDiscount =
          Math.max(
            0,
            basePrice -
              totalPrice
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

  /*
   * Sync current basket with Tebex.
   *
   * This is now the ONLY basket fetch used by
   * CartContext/CompletePage.
   */
  const syncBasket = useCallback(
    async () => {
      if (!basketId) return
      if (syncingRef.current) return

      syncingRef.current = true

      try {
        setIsLoading(true)

        const response =
          await fetch(
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
          applyBasket(
            data.data
          )
        }
      } catch {
        console.warn(
          '[Cart] Could not sync cart.'
        )
      } finally {
        syncingRef.current = false
        setIsLoading(false)
      }
    },
    [
      basketId,
      applyBasket,
    ]
  )

  /*
   * Initial basket sync.
   */
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

  /*
   * Add item.
   */
  const addItem = async (
    packageId: number,
    name: string,
    price: number,
    image?: string
  ) => {
    try {
      setIsLoading(true)

      const existingItem =
        items.find(
          item =>
            item.packageId ===
            packageId
        )

      const newQuantity =
        existingItem
          ? existingItem.quantity + 1
          : 1

      let currentBasketId =
        basketId

      if (!currentBasketId) {
        const response =
          await fetch(
            '/api/tebex/basket',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
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
          console.warn(
            '[Cart] Could not add item to cart.'
          )

          error(
            'Failed to add item to cart. Please try again.'
          )

          return
        }

        currentBasketId =
          data.data.ident

        setBasketId(
          currentBasketId
        )

        applyBasket(
          data.data
        )

        initialSyncBasketRef.current =
          currentBasketId
      } else {
        const response =
          await fetch(
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
          console.warn(
            '[Cart] Could not update cart.'
          )

          error(
            'Failed to add item to cart. Please try again.'
          )

          return
        }

        applyBasket(
          data.data
        )

        initialSyncBasketRef.current =
          currentBasketId
      }

      success(
        `${name} added to cart`
      )
    } catch {
      console.warn(
        '[Cart] Could not add item to cart.'
      )

      error(
        'Failed to add item to cart. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Remove item.
   */
  const removeItem = async (
    packageId: number
  ) => {
    if (!basketId) return

    try {
      setIsLoading(true)

      const removedItem =
        items.find(
          item =>
            item.packageId ===
            packageId
        )

      const response =
        await fetch(
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
        console.warn(
          '[Cart] Could not remove item.'
        )

        error(
          'Failed to remove item from cart. Please try again.'
        )

        return
      }

      if (data.data) {
        applyBasket(
          data.data
        )
      } else {
        const remainingItems =
          items.filter(
            item =>
              item.packageId !==
              packageId
          )

        setItems(
          remainingItems
        )

        if (
          remainingItems.length === 0
        ) {
          handleEmptyBasket(
            cartStorageKey
          )
        }
      }

      if (removedItem) {
        info(
          `${removedItem.name} removed from cart`
        )
      }
    } catch {
      console.warn(
        '[Cart] Could not remove item.'
      )

      error(
        'Failed to remove item from cart. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Update quantity.
   */
  const updateQuantity = async (
    packageId: number,
    quantity: number
  ) => {
    if (quantity < 1) {
      await removeItem(
        packageId
      )

      return
    }

    if (!basketId) return

    try {
      setIsLoading(true)

      const response =
        await fetch(
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
        console.warn(
          '[Cart] Could not update quantity.'
        )

        error(
          'Failed to update quantity. Please try again.'
        )

        return
      }

      applyBasket(
        data.data
      )

      initialSyncBasketRef.current =
        basketId
    } catch {
      console.warn(
        '[Cart] Could not update quantity.'
      )

      error(
        'Failed to update quantity. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Apply coupon.
   */
  const applyCoupon = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) {
      warning(
        'Your cart is empty.'
      )

      return false
    }

    const normalizedCode =
      code.trim().toUpperCase()

    if (!normalizedCode) {
      warning(
        'Please enter a coupon code.'
      )

      return false
    }

    const alreadyApplied =
      coupons.some(coupon => {
        const existingCode =
          coupon?.coupon_code ||
          coupon?.code ||
          coupon?.name ||
          ''

        return (
          String(existingCode).toUpperCase() ===
          normalizedCode
        )
      })

    if (alreadyApplied) {
      info(
        'Coupon already applied.'
      )

      await syncBasket()

      return false
    }

    try {
      setIsLoading(true)

      const response =
        await fetch(
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

          info(
            'Coupon already applied.'
          )

          return false
        }

        console.warn(
          '[Cart] Coupon could not be applied.'
        )

        error(
          'Invalid or unavailable coupon code. Please check the code and try again.'
        )

        return false
      }

      await syncBasket()

      success(
        'Coupon applied successfully.'
      )

      return true
    } catch {
      console.warn(
        '[Cart] Could not apply coupon.'
      )

      error(
        'Invalid or unavailable coupon code. Please check the code and try again.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Remove coupon.
   */
  const removeCoupon = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) return false

    const normalizedCode =
      code.trim().toUpperCase()

    if (!normalizedCode) return false

    try {
      setIsLoading(true)

      const response =
        await fetch(
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
        console.warn(
          '[Cart] Coupon could not be removed.'
        )

        error(
          'Failed to remove coupon. Please try again.'
        )

        return false
      }

      await syncBasket()

      info(
        'Coupon removed successfully.'
      )

      return true
    } catch {
      console.warn(
        '[Cart] Could not remove coupon.'
      )

      error(
        'Failed to remove coupon. Please try again.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Apply gift card.
   */
  const applyGiftCard = async (
    cardNumber: string
  ): Promise<boolean> => {
    if (!basketId) {
      warning(
        'Your cart is empty.'
      )

      return false
    }

    const normalizedCard =
      cardNumber.trim()

    if (!normalizedCard) {
      warning(
        'Please enter a gift card number.'
      )

      return false
    }

    const alreadyApplied =
      giftCards.some(
        giftCard => {
          const card =
            giftCard?.card_number ||
            giftCard?.code ||
            ''

          return (
            String(card) ===
            normalizedCard
          )
        }
      )

    if (alreadyApplied) {
      info(
        'Gift card already applied.'
      )

      await syncBasket()

      return false
    }

    try {
      setIsLoading(true)

      const response =
        await fetch(
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

          info(
            'Gift card already applied.'
          )

          return false
        }

        console.warn(
          '[Cart] Gift card could not be applied.'
        )

        error(
          'Invalid or unavailable gift card. Please check the card number and try again.'
        )

        return false
      }

      await syncBasket()

      success(
        'Gift card applied successfully.'
      )

      return true
    } catch {
      console.warn(
        '[Cart] Could not apply gift card.'
      )

      error(
        'Invalid or unavailable gift card. Please check the card number and try again.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Remove gift card.
   */
  const removeGiftCard = async (
    cardNumber: string
  ): Promise<boolean> => {
    if (!basketId) return false

    const normalizedCard =
      String(cardNumber).trim()

    if (!normalizedCard) return false

    try {
      setIsLoading(true)

      const response =
        await fetch(
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
        console.warn(
          '[Cart] Gift card could not be removed.'
        )

        error(
          'Failed to remove gift card. Please try again.'
        )

        return false
      }

      await syncBasket()

      info(
        'Gift card removed successfully.'
      )

      return true
    } catch {
      console.warn(
        '[Cart] Could not remove gift card.'
      )

      error(
        'Failed to remove gift card. Please try again.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Apply creator code.
   */
  const applyCreatorCode = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) {
      warning(
        'Your cart is empty.'
      )

      return false
    }

    const normalizedCode =
      code.trim()

    if (!normalizedCode) {
      warning(
        'Please enter a creator code.'
      )

      return false
    }

    if (
      creatorCode &&
      creatorCode.toLowerCase() ===
        normalizedCode.toLowerCase()
    ) {
      info(
        'Creator code already applied.'
      )

      await syncBasket()

      return false
    }

    try {
      setIsLoading(true)

      const response =
        await fetch(
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

          info(
            'Creator code already applied.'
          )

          return false
        }

        console.warn(
          '[Cart] Creator code could not be applied.'
        )

        error(
          'Invalid or unavailable creator code. Please check the code and try again.'
        )

        return false
      }

      await syncBasket()

      success(
        'Creator code applied successfully.'
      )

      return true
    } catch {
      console.warn(
        '[Cart] Could not apply creator code.'
      )

      error(
        'Invalid or unavailable creator code. Please check the code and try again.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Remove creator code.
   */
  const removeCreatorCode = async (
    code: string
  ): Promise<boolean> => {
    if (!basketId) return false

    const normalizedCode =
      String(code).trim()

    if (!normalizedCode) return false

    try {
      setIsLoading(true)

      const response =
        await fetch(
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
        console.warn(
          '[Cart] Creator code could not be removed.'
        )

        error(
          'Failed to remove creator code. Please try again.'
        )

        return false
      }

      await syncBasket()

      info(
        'Creator code removed successfully.'
      )

      return true
    } catch {
      console.warn(
        '[Cart] Could not remove creator code.'
      )

      error(
        'Failed to remove creator code. Please try again.'
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  /*
   * Clear cart.
   */
  const clearCart = () => {
    resetCartState()

    if (cartStorageKey) {
      localStorage.removeItem(
        cartStorageKey
      )
    }

    info('Cart cleared.')
  }

  /*
   * Get cart total.
   */
  const getTotal = () => {
    return items.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    )
  }

  /*
   * Get total item count.
   */
  const getItemCount = () => {
    return items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity),
      0
    )
  }

  /*
   * Start Tebex checkout.
   */
  const checkout =
    async (): Promise<string | null> => {
      if (!basketId) {
        warning(
          'Your cart is empty.'
        )

        return null
      }

      try {
        setIsLoading(true)

        const response =
          await fetch(
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

        if (
          data.success &&
          data.checkoutUrl
        ) {
          /*
           * The basket is going to checkout.
           * Do not mark it complete here.
           *
           * Complete status will be obtained from
           * Tebex after the user returns.
           */
          setBasketComplete(null)

          return data.checkoutUrl
        }

        console.warn(
          '[Cart] Could not start checkout.'
        )

        error(
          'Failed to start checkout. Please try again.'
        )

        return null
      } catch {
        console.warn(
          '[Cart] Could not start checkout.'
        )

        error(
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
        basketComplete,
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