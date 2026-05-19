# DataCred — On-Chain Analytics Credentials

> ETHWomen 2026 Hackathon Project

A web platform where learners complete niche data analytics courses and earn **soulbound NFT credentials** on Ethereum — verifiable by anyone, non-transferable, yours forever.

## Project Structure

```
├── contracts/          # Solidity smart contract (Hardhat)
│   ├── contracts/
│   │   └── CourseCredential.sol   # Soulbound ERC-721 credential token
│   ├── scripts/
│   │   └── deploy.js
│   └── test/
│       └── CourseCredential.test.js
│
└── frontend/           # Next.js 14 app (TypeScript + Tailwind)
    ├── app/
    │   ├── page.tsx              # Landing page
    │   ├── catalog/              # Course catalog
    │   ├── course/[id]/          # Course viewer + quiz
    │   ├── verify/               # Verify any credential by token ID
    │   ├── dashboard/            # Learner's earned credentials
    │   └── api/
    │       ├── courses/          # Course data endpoints
    │       ├── quiz/submit/      # Quiz grading
    │       ├── ipfs/upload/      # Pinata IPFS upload
    │       ├── complete-course/  # Mint credential (IPFS + contract)
    │       ├── verify/[tokenId]/ # On-chain credential lookup
    │       └── credentials/[address]/ # All credentials for a wallet
    ├── components/
    │   ├── Navbar.tsx
    │   ├── CourseCard.tsx
    │   ├── Quiz.tsx
    │   └── ClaimCredential.tsx
    └── lib/
        ├── courses.ts            # Course content + quiz data
        ├── contractABI.ts        # Contract ABI + address
        ├── ipfs.ts               # Metadata builder + IPFS helpers
        └── wagmiConfig.ts        # wagmi + RainbowKit config
```

## Quick Start

### 1. Smart Contract

```bash
cd contracts
npm install
cp .env.example .env   # fill in your keys

# Run tests
npm test

# Deploy to Sepolia
npm run deploy:sepolia
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in:
#   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
#   NEXT_PUBLIC_CONTRACT_ADDRESS   (from deploy step above)
#   PINATA_API_KEY + PINATA_SECRET_API_KEY
#   PLATFORM_PRIVATE_KEY
#   SEPOLIA_RPC_URL

npm run dev
# → http://localhost:3000
```

## Core Flow

1. **Browse** courses on the catalog page
2. **Learn** — read modules, mark each complete
3. **Quiz** — score 75%+ to unlock credential claim
4. **Connect wallet** — MetaMask on Sepolia testnet
5. **Mint** — platform calls `issueCertificate()` on-chain, soulbound NFT goes to learner's wallet
6. **Verify** — anyone can verify at `/verify?tokenId=<n>`

## Tech Stack

| Layer | Tool |
|---|---|
| Smart contract | Solidity 0.8.24 + OpenZeppelin + Hardhat |
| Blockchain | Ethereum Sepolia testnet |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Wallet | wagmi v2 + RainbowKit |
| NFT metadata | IPFS via Pinata |
| Backend | Next.js API routes + viem |

## Team

- linda-rolic
- richuyulin
- rehma02

Built for **ETHWomen 2026** 🌸
