import Script from 'next/script'

interface ConversionTagProps {
  value?: number
  currency?: string
  transactionId?: string
  newCustomer?: boolean
}

export function ConversionTag({ 
  value = 1.0, 
  currency = 'BRL', 
  transactionId = '', 
  newCustomer = true 
}: ConversionTagProps) {
  return (
    <Script id="conversion-tag" strategy="afterInteractive">
      {`
        gtag('event', 'conversion', {
          'send_to': 'AW-18100242553/bzUBCOeChZ4cEPmQ77ZD',
          'value': ${value},
          'currency': '${currency}',
          'transaction_id': '${transactionId}',
          'new_customer': ${newCustomer}
        });
      `}
    </Script>
  )
}
