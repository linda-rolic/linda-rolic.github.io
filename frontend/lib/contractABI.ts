export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "learner", type: "address" },
      { internalType: "string", name: "courseId", type: "string" },
      { internalType: "string", name: "courseName", type: "string" },
      { internalType: "string", name: "metadataURI", type: "string" },
    ],
    name: "issueCertificate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "verifyCertificate",
    outputs: [
      { internalType: "address", name: "learner", type: "address" },
      { internalType: "string", name: "courseId", type: "string" },
      { internalType: "string", name: "courseName", type: "string" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" },
      { internalType: "string", name: "metadataURI", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "learner", type: "address" },
      { internalType: "string", name: "courseId", type: "string" },
    ],
    name: "hasCredential",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "courseId", type: "string" }],
    name: "getCourseCredentials",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "learner", type: "address" },
      { internalType: "string", name: "courseId", type: "string" },
    ],
    name: "learnerCourseToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "learner", type: "address" },
      { indexed: false, internalType: "string", name: "courseId", type: "string" },
      { indexed: false, internalType: "string", name: "courseName", type: "string" },
      { indexed: false, internalType: "uint256", name: "issuedAt", type: "uint256" },
    ],
    name: "CredentialIssued",
    type: "event",
  },
] as const;

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
