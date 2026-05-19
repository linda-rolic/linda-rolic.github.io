import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { sepolia } from "viem/chains";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contractABI";
import { COURSES } from "@/lib/courses";

export async function GET(_req: Request, { params }: { params: { address: string } }) {
  if (!isAddress(params.address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  const credentials = [];

  for (const course of COURSES) {
    try {
      const tokenId = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "learnerCourseToken",
        args: [params.address as `0x${string}`, course.id],
      }) as bigint;

      if (tokenId > 0n) {
        const result = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "verifyCertificate",
          args: [tokenId],
        }) as [string, string, string, bigint, string];

        const [, courseId, courseName, issuedAtRaw, metadataURI] = result;
        credentials.push({
          tokenId: Number(tokenId),
          courseId,
          courseName,
          issuedAt: new Date(Number(issuedAtRaw) * 1000).toISOString(),
          metadataURI,
        });
      }
    } catch {
      // Token doesn't exist for this course — skip
    }
  }

  return NextResponse.json({ address: params.address, credentials });
}
