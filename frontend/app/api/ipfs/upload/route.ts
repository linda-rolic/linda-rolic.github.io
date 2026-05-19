import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const metadata = await req.json();

  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

  if (!pinataApiKey || !pinataSecretKey) {
    // In development without Pinata keys, return a mock CID
    const mockCid = `QmMock${Date.now()}`;
    return NextResponse.json({ ipfsUri: `ipfs://${mockCid}` });
  }

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretKey,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: `datacred-${Date.now()}` },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Pinata error: ${err}` }, { status: 500 });
  }

  const { IpfsHash } = await res.json();
  return NextResponse.json({ ipfsUri: `ipfs://${IpfsHash}` });
}
