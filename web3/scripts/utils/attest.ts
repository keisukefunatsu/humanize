import hre from 'hardhat'
import {Attester} from '../../typechain/contracts/Attester'

async function main() {
  const [user, user2] = await hre.ethers.getSigners()
  const attesterContractAddress = process.env.ATTESTER_CONTRACT_ADDRESS
  if (!attesterContractAddress) {
    throw new Error('ATTESTER_CONTRACT_ADDRESS is not set')
  }
  const attester: Attester = await hre.ethers.getContractAt(
    'Attester',
    attesterContractAddress,
    user2
  )
  const schema = process.env.SCHEMA_ID
  if (!schema) {
    throw new Error('SCHEMA_ID is not set')
  }
  const name = 'transaction10 sepolia'
  const wallet = '0x33b926d2B21972464198b9c89B34fE9BA831Cb14'
  const tx = await attester.attest(schema, wallet, name, wallet)
  const result = await tx.wait()
  console.log('result', result)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
