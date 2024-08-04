import {buildModule} from '@nomicfoundation/hardhat-ignition/modules'
// import {parseEther} from 'viem'

const AttesterModule = buildModule('AttesterModule', (m) => {
  const easContractAddress = process.env.EAS_CONTRACT_ADDRESS || ''
  if (easContractAddress === '') {
    throw new Error('EAS_CONTRACT_ADDRESS env variable is required')
  }
  const attester = m.contract('Attester', [easContractAddress])

  return {attester}
})

export default AttesterModule
