"use client";

import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Credential {
  tokenId: number;
  courseId: string;
  courseName: string;
  issuedAt: string;
  metadataURI: string;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError("");
    fetch(`/api/credentials/${address}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCredentials(data.credentials);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [address]);

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🔐</div>
        <h1 className="text-3xl font-bold text-white mb-3">My Credentials</h1>
        <p className="text-gray-400 mb-8">Connect your wallet to view all credentials you've earned.</p>
        <button
          onClick={() => openConnectModal?.()}
          className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">My Credentials</h1>
        <p className="text-gray-500 font-mono text-sm">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-500">Loading credentials...</div>
      )}

      {error && (
        <div className="card border-red-500/30 p-6 text-red-400 text-center">{error}</div>
      )}

      {!loading && !error && credentials.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-white mb-2">No credentials yet</h3>
          <p className="text-gray-400 mb-6">
            Complete a course and pass the quiz to earn your first on-chain credential.
          </p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            Browse Courses
          </Link>
        </div>
      )}

      {!loading && credentials.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {credentials.map((cred) => (
            <div key={cred.tokenId} className="card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                  #{cred.tokenId}
                </div>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{cred.courseName}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Issued{" "}
                  {new Date(cred.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/verify?tokenId=${cred.tokenId}`}
                  className="flex-1 text-center py-2 rounded-lg text-sm border border-purple-700/40 text-purple-400 hover:border-purple-500 hover:text-purple-300 transition-colors"
                >
                  Verify
                </Link>
                <a
                  href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${cred.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 rounded-lg text-sm border border-purple-700/40 text-gray-400 hover:border-purple-500 hover:text-white transition-colors"
                >
                  Etherscan →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
