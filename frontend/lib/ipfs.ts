export interface CertificateMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export function buildCertificateMetadata(
  learnerAddress: string,
  courseId: string,
  courseName: string,
  issuedAt: string
): CertificateMetadata {
  return {
    name: `${courseName} — Completion Certificate`,
    description: `This credential certifies that ${learnerAddress} successfully completed "${courseName}" on the DataCred platform. Issued on ${issuedAt}.`,
    image: "ipfs://QmPlaceholderImageCID",
    attributes: [
      { trait_type: "Course", value: courseName },
      { trait_type: "Course ID", value: courseId },
      { trait_type: "Learner", value: learnerAddress },
      { trait_type: "Issued Date", value: issuedAt },
      { trait_type: "Platform", value: "DataCred — ETHWomen 2026" },
      { trait_type: "Type", value: "Soulbound Credential" },
    ],
  };
}

export async function uploadMetadataToIPFS(metadata: CertificateMetadata): Promise<string> {
  const res = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "IPFS upload failed");
  }

  const { ipfsUri } = await res.json();
  return ipfsUri;
}
