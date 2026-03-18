'use client'

import './globals.css'
import type { ReactNode } from 'react'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { AuthToaster } from '../components/AuthToaster'

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme({ config })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Auth App</title>
      </head>
      <body>
        <Provider store={store}>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <AuthToaster />
            {children}
          </ChakraProvider>
        </Provider>
      </body>
    </html>
  )
}

