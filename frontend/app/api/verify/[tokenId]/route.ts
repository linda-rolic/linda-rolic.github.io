import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contractABI";

export async function GET(_req: Request, { params }: { params: { tokenId: string } }) {
  const tokenId = parseInt(params.tokenId, 10);
  if (isNaN(tokenId) || tokenId < 1) {
    return NextResponse.json({ error: "Invalid token ID" }, { status: 400 });
  }

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "verifyCertificate",
      args: [BigInt(tokenId)],
    }) as [string, string, string, bigint, string];

    const [learner, courseId, courseName, issuedAtRaw, metadataURI] = result;

    return NextResponse.json({
      tokenId,
      learner,
      courseId,
      courseName,
      issuedAt: new Date(Number(issuedAtRaw) * 1000).toISOString(),
      metadataURI,
    });
  } catch {
    return NextResponse.json({ error: "Credential not found or contract error" }, { status: 404 });
  }
}
