


import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../components'
import dynamic from 'next/dynamic'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/ui/theme-provider'


import Web3ModalProvider from '@/context/Web3Modal'
// import NextNProgressClient from '@/components/dashboard/process'
// import NextTopLoader from 'nextjs-toploader';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GeminiBrain AI',
  description: 'All-in-one platform to generate AI content and start making money in minutes.',
}






export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>

    <html lang="en">
      <body className={inter.className}>



        <Web3ModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {/* <NextTopLoader /> */}
            {/* <NextNProgressClient /> */}

            {children}
            <Toaster />
          </ThemeProvider>

        </Web3ModalProvider>

      </body>
    </html>
    // </ClerkProvider>
  )
}
