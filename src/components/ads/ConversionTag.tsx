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
        try {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
              'send_to': 'AW-18100242553/bzUBCOeChZ4cEPmQ77ZD',
              'value': ${value},
              'currency': '${currency}',
              'transaction_id': '${transactionId}',
              'new_customer': ${newCustomer}
            });
          }
        } catch (error) {
          console.warn('Erro na tag de conversão Google Ads:', error);
        }
      `}
    </Script>
  )
}
