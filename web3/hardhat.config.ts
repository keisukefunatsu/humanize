import * as dotenv from 'dotenv'
import {HardhatUserConfig} from 'hardhat/config'
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-toolbox-viem'
import '@nomiclabs/hardhat-ethers'

dotenv.config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ''
const BASE_RPC_URL = process.env.BASE_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    base: {
      url: BASE_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v6',
  },
}

export default config
