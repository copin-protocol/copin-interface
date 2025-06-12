import React, { useEffect } from 'react'

import { Box } from 'theme/base'

const CheckoutPage = () => {
  useEffect(() => {
    // Load Fungies script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@fungies/fungies-js@0.0.6'
    script.defer = true
    script.setAttribute('data-auto-init', '')
    script.setAttribute('data-auto-display-checkout', '')
    script.setAttribute(
      'data-fungies-checkout-url',
      'https://pay.copin.io/checkout-element/ce1329c3-199c-4dff-8a99-e73360d4b32c'
    )
    script.setAttribute('data-fungies-custom-fields', 'account=VALUE0')
    script.setAttribute('data-fungies-mode', 'embed')
    script.setAttribute('data-fungies-frame-target', 'target-element-id')

    document.body.appendChild(script)

    // Cleanup
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Box
      as="div"
      id="target-element-id"
      sx={{
        margin: '0 auto',
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& iframe': {
          width: '100%',
          height: '100%',
          border: 'none',
        },
      }}
    ></Box>
  )
}

export default CheckoutPage
