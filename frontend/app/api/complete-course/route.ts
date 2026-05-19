import { NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { getCourse } from "@/lib/courses";
import { buildCertificateMetadata } from "@/lib/ipfs";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contractABI";

export async function POST(req: Request) {
  const { learnerAddress, courseId } = await req.json() as {
    learnerAddress: `0x${string}`;
    courseId: string;
  };

  if (!learnerAddress || !courseId) {
    return NextResponse.json({ error: "learnerAddress and courseId are required" }, { status: 400 });
  }

  const course = getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const privateKey = process.env.PLATFORM_PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    return NextResponse.json({ error: "Platform wallet not configured" }, { status: 500 });
  }

  // 1. Build certificate metadata
  const issuedAt = new Date().toISOString();
  const metadata = buildCertificateMetadata(learnerAddress, courseId, course.title, issuedAt);

  // 2. Upload metadata to IPFS
  const ipfsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ipfs/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });

  if (!ipfsRes.ok) {
    return NextResponse.json({ error: "IPFS upload failed" }, { status: 500 });
  }
  const { ipfsUri } = await ipfsRes.json();

  // 3. Mint the soulbound NFT
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  let txHash: string;
  let tokenId: number;

  try {
    txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "issueCertificate",
      args: [learnerAddress, courseId, course.title, ipfsUri],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });

    // Parse CredentialIssued event to get tokenId
    const event = receipt.logs[0];
    tokenId = Number(BigInt(event.topics[1] || "0x1"));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Contract call failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ txHash, tokenId, ipfsUri, issuedAt });
}
