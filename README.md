# Humanize

Humanize is a platform that rewards users for their contributions to the blockchain ecosystem.

## Introducing Humanize

Humanize is a groundbreaking application designed to fairly evaluate and reward human contributions to the on-chain economy. By leveraging advanced blockchain technology, Humanize ensures that meaningful activities are recognized and incentivized.

Key Features

- Fair Evaluation: Assess on-chain activities contributing to the blockchain ecosystem using data from Blockscout and other sources.
- Unique Human Authentication: Uses World App’s Incognito Action for on-chain authentication, proving an address belongs to a unique individual while maintaining anonymity.
- Permanent Attestations: Store evaluation results as attestations with the Ethereum Attestation Service (EAS), creating a verifiable record.
- Multi-Chain Insights: Evaluate activities across multiple chains, providing a comprehensive view of user interests and contributions.

Use Cases

- Airdrops: Reward users based on their contributions.
- Employment: Use attestations as credentials for job applications.
- Education: Recognize participation in learning programs.
- Ecosystem Expansion: Identify and collaborate with active contributors.

Humanize sets a new standard for recognizing positive human activities in the blockchain space, empowering individuals and strengthening the ecosystem. Join us in building a more inclusive and dynamic blockchain community.

## Architecture

- Architecture Diagram
  
```mermaid
graph TD
  subgraph Blockchain
    Wallet[Wallet]
    subgraph Optimism                
      VerifierContract[Verifier \n Contract]      
        subgraph EAS
          EASContract[EASContract]
          Schema[Schema]
          AttestationResolver[Attestation \n Resolver]
          EASGraphQL[GraphQL]
        end
        subgraph Chains
          OtherChains[Other Chains]
        end
      end
  end

  subgraph Blockscout
    Explorer[Explorer]
  end
 
  subgraph WorldApp
    IncognitoAction[Incognito \n Action]
  end

  subgraph Humanize
      subgraph Backend
          MissionChecker[Mission \n Checker]
          MissionAttester[Mission \n Attester]
      end
      
      subgraph Frontend
          User[User]
      end
  end

  VerifierContract --> |Check ID| IncognitoAction
  User --> |Anonymous ID \n Verification| VerifierContract
  User --> |Check \n Mission| MissionChecker
  User --> |Signature \n Request| MissionAttester
  User --> |Onchain \n Attestation| EASContract
  VerifierContract --> |Verify & Authenticate| Wallet
  MissionAttester --> |Delegated Attestation \n Signature| User
  EASContract --> |check condition| AttestationResolver
  EASContract --> |check schema| Schema
  Explorer --> |Collect User Transaction| OtherChains

  MissionChecker --> |Retrieve Mission Data| Explorer
  MissionChecker --> |Retrieve attestations| EASGraphQL
```


- Sequence Diagram
```mermaid
sequenceDiagram
  participant User
  participant VerifierContract
  participant Wallet
  participant MissionChecker
  participant MissionAttester
  participant EASContract

  User ->> VerifierContract: Anonymous ID Verification
  VerifierContract ->> VerifierContract: Check ID with Incognito Action
  VerifierContract ->> Wallet: Verify & Authenticate
  User ->> MissionChecker: Check Mission
  User ->> MissionAttester: Signature Request
  MissionAttester ->> User: Delegated Attestation Signature
  User ->> EASContract: Onchain Attestation
  EASContract ->> EASContract: Check condition with Attestation Resolver
  EASContract ->> EASContract: Check schema with Schema
```