"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface CredentialResult {
  tokenId: number;
  learner: string;
  courseId: string;
  courseName: string;
  issuedAt: string;
  metadataURI: string;
  txHash?: string;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("tokenId") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CredentialResult | null>(null);
  const [error, setError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/verify/${input.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Credential not found");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("tokenId")) {
      const form = document.getElementById("verify-form") as HTMLFormElement;
      form?.requestSubmit();
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-3">Verify a Credential</h1>
        <p className="text-gray-400">
          Enter a token ID to verify an on-chain data analytics credential.
        </p>
      </div>

      <form id="verify-form" onSubmit={handleVerify} className="space-y-4 mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Token ID (e.g. 1)"
            className="flex-1 bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Checking..." : "Verify"}
          </button>
        </div>
      </form>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl">
              ✓
            </div>
            <div>
              <p className="text-green-400 font-semibold">Valid Credential</p>
              <p className="text-gray-500 text-sm">Token #{result.tokenId}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-purple-900/20 pt-6">
            <h3 className="text-xl font-bold text-white">{result.courseName}</h3>

            <div className="grid grid-cols-1 gap-3 text-sm">
              {[
                { label: "Course ID", value: result.courseId },
                {
                  label: "Learner",
                  value: `${result.learner.slice(0, 10)}...${result.learner.slice(-8)}`,
                  mono: true,
                },
                { label: "Issued", value: new Date(result.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                { label: "Metadata", value: result.metadataURI, mono: true, link: result.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/") },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-2 border-b border-purple-900/10">
                  <span className="text-gray-500 shrink-0">{row.label}</span>
                  {row.link ? (
                    <a href={row.link} target="_blank" rel="noopener noreferrer" className={`${row.mono ? "font-mono text-xs" : ""} text-purple-400 hover:text-purple-300 truncate`}>
                      {row.value}
                    </a>
                  ) : (
                    <span className={`${row.mono ? "font-mono text-xs" : ""} text-white truncate`}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <a
            href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${result.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 rounded-xl border border-purple-700/40 text-purple-400 hover:border-purple-500 hover:text-purple-300 transition-all text-sm"
          >
            View on Etherscan →
          </a>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
