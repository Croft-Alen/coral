import { TebexHeadless } from 'tebex_headless'

const WEBSTORE_IDENTIFIER =
  '119al-d3b8068db2cd81f864d522690ed79fe876bf7264'

const PRIVATE_KEY = 'vSlDa5GUjkuBXGmPXJCkcL4mlQZW3SGS'

export const getTebexServerClient = () => {
  return new TebexHeadless(
    WEBSTORE_IDENTIFIER,
    PRIVATE_KEY
  )
}

export const getTebexClient = () => {
  return new TebexHeadless(WEBSTORE_IDENTIFIER)
}