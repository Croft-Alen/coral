'use client'

import { useEffect, useState } from 'react'
import { FaTimes, FaTag, FaUser, FaGift, FaArrowRight } from 'react-icons/fa'
import { CrossButton } from '@/components/ui/CrossButton'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'

type CodeType = 'coupon' | 'creator' | 'gift'

interface CodeModalProps {
  isOpen: boolean
  onClose: () => void
  type: CodeType
}

export function CodeModal({
  isOpen,
  onClose,
  type,
}: CodeModalProps) {
  const {
    applyCoupon,
    removeCoupon,
    applyGiftCard,
    removeGiftCard,
    applyCreatorCode,
    removeCreatorCode,
    coupons,
    giftCards,
    creatorCode,
    syncBasket,
  } = useCart()

  const [inputValue, setInputValue] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [error, setError] = useState('')

  const getAppliedValue = (): string => {
    switch (type) {
      case 'coupon': {
        if (!Array.isArray(coupons) || coupons.length === 0) {
          return ''
        }

        const coupon = coupons[0]

        const value =
          coupon?.coupon_code ??
          coupon?.code ??
          coupon?.name ??
          ''

        return String(value)
      }

      case 'creator': {
        return typeof creatorCode === 'string'
          ? creatorCode
          : ''
      }

      case 'gift': {
        if (!Array.isArray(giftCards) || giftCards.length === 0) {
          return ''
        }

        const giftCard = giftCards[0]

        const value =
          giftCard?.card_number ??
          giftCard?.code ??
          ''

        return String(value)
      }

      default:
        return ''
    }
  }

  const appliedValue = getAppliedValue()
  const isApplied = appliedValue.trim().length > 0

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setInputValue(appliedValue)
    setError('')
  }, [isOpen, type, appliedValue])

  const getConfig = () => {
    switch (type) {
      case 'coupon':
        return {
          title: 'Apply Coupon Code',
          icon: FaTag,
          placeholder: 'Enter coupon code',
          buttonText: 'Apply Coupon',
        }

      case 'creator':
        return {
          title: 'Apply Creator Code',
          icon: FaUser,
          placeholder: 'Enter creator code',
          buttonText: 'Apply Creator Code',
        }

      case 'gift':
        return {
          title: 'Apply Gift Card',
          icon: FaGift,
          placeholder: 'Enter gift card number',
          buttonText: 'Apply Gift Card',
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  const handleApply = async () => {
    const trimmed = inputValue.trim()

    if (!trimmed || isApplying || isRemoving || isApplied) {
      return
    }

    setIsApplying(true)
    setError('')

    try {
      let success = false

      switch (type) {
        case 'coupon':
          success = await applyCoupon(trimmed)
          break

        case 'creator':
          success = await applyCreatorCode(trimmed)
          break

        case 'gift':
          success = await applyGiftCard(trimmed)
          break
      }

      if (!success) {
        setError('Invalid or unavailable code')
        return
      }

      setInputValue(trimmed)

      await syncBasket()
    } catch (error) {
      console.error(`Failed to apply ${type}:`, error)

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      )
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemove = async () => {
    const code = appliedValue.trim()

    if (!code || isRemoving || isApplying) {
      return
    }

    setIsRemoving(true)
    setError('')

    try {
      let success = false

      switch (type) {
        case 'coupon':
          success = await removeCoupon(code)
          break

        case 'creator':
          success = await removeCreatorCode(code)
          break

        case 'gift':
          success = await removeGiftCard(code)
          break
      }

      if (!success) {
        setError('Failed to remove code')
        return
      }

      setInputValue('')

      await syncBasket()
    } catch (error) {
      console.error(`Failed to remove ${type}:`, error)

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      )
    } finally {
      setIsRemoving(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-pageBg rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative py-4">

        <div className="absolute top-4 right-4 z-10">
          <CrossButton
            onClick={onClose}
            size="md"
            ariaLabel={`Close ${config.title}`}
          />
        </div>

        <div className="p-6 pt-2">

          <h2 className="text-xl font-bold text-text-heading text-center mb-6">
            {config.title}
          </h2>

          <div className="space-y-3">

            <div className="relative">

              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Icon className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  if (isApplied || isApplying || isRemoving) {
                    return
                  }

                  setInputValue(e.target.value)
                  setError('')
                }}
                placeholder={config.placeholder}
                disabled={isApplying || isRemoving || isApplied}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApply()
                  }
                }}
                autoFocus
                className="
                  w-full
                  bg-pageBg
                  border-2
                  border-white/10
                  rounded-md
                  pl-10
                  pr-12
                  py-3
                  text-text-body
                  placeholder-text-muted
                  focus:outline-none
                  focus:border-white/10
                  disabled:opacity-100
                  disabled:cursor-default
                  transition-colors
                "
              />

              {isApplied && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isRemoving || isApplying}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-7
                    h-7
                    flex
                    items-center
                    justify-center
                    text-text-muted
                    hover:text-red-500
                    transition-colors
                    cursor-pointer
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                  aria-label={`Remove ${type}`}
                >
                  {isRemoving ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-text-muted rounded-full animate-spin" />
                  ) : (
                    <FaTimes className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <Button
              variant="primary"
              size="lg"
              className="
                w-full
                h-11
                text-base
                gap-2
              "
              onClick={handleApply}
              disabled={isApplying || isRemoving || isApplied}
            >
              {isApplying ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaArrowRight className="w-4 h-4" />
                  {config.buttonText}
                </>
              )}
            </Button>

          </div>
        </div>
      </div>
    </div>
  )
}