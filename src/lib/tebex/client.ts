import { TebexHeadless } from 'tebex_headless'

export const getTebexServerClient = () => {
  const identifier = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN
  const privateKey = process.env.TEBEX_PRIVATE_KEY

  if (!identifier) {
    throw new Error('NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN is not defined in environment variables')
  }

  if (!privateKey) {
    throw new Error('TEBEX_PRIVATE_KEY is not defined in environment variables')
  }

  return new TebexHeadless(identifier, privateKey)
}

export const getTebexClient = () => {
  const identifier = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN

  if (!identifier) {
    throw new Error('NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN is not defined in environment variables')
  }

  return new TebexHeadless(identifier)
}