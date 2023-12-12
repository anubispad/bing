"use client"
import React from 'react'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'







// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'b59fbe9dd1f5ab7f5a9ed2abc1e085fa'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

const mumbai = {
  chainId: 80001,
  name: 'Mumbai',
  currency: 'MATIC',
  explorerUrl: 'https://mumbai.polygonscan.com',
  rpcUrl: 'https://polygon-mumbai-pokt.nodies.app'
};

const bsc = {
  chainId: 56,
  name: 'BSC',
  currency: 'BNB',
  explorerUrl: 'https://bscscan.com',
  rpcUrl: 'https://bsc-dataseed.binance.org/'
};

const optimism = {
  chainId: 10,
  name: 'Optimism',
  currency: 'ETH',
  explorerUrl: 'https://optimistic.etherscan.io',
  rpcUrl: 'https://mainnet.optimism.io'
};

const arbitrum = {
  chainId: 42161,
  name: 'Arbitrum',
  currency: 'ETH',
  explorerUrl: 'https://arbiscan.io',
  rpcUrl: 'https://arb1.arbitrum.io/rpc'
};

// Metadata for your web3modal instance
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['../icons/audio.svg']
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  themeMode:"dark",
  
  
  
  chains: [mainnet, mumbai, bsc, optimism, arbitrum],
  projectId,
  termsConditionsUrl: 'https://www.mytermsandconditions.com',
  privacyPolicyUrl: 'https://www.myprivacypolicy.com',
});




const Web3ModalProvider = (props:{
    children:React.ReactNode
}) => {
  return (
    <div>{props.children}</div>
  )
}

export default Web3ModalProvider