import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cabibul Thrift',
  description: 'Cabibul Thrift',
  generator: 'CabulDev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
