import {createWeb3Modal} from '@web3modal/wagmi/react'
import {defaultWagmiConfig} from '@web3modal/wagmi/react/config'
import {WagmiProvider} from 'wagmi'
import {optimism} from 'wagmi/chains'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactNode} from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID
if (!projectId) {
  throw new Error('REACT_APP_WALLET_CONNECT_PROJECT_ID is required')
}

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains = [optimism] as const
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

export function Web3ModalProvider({children}: {children: ReactNode}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
