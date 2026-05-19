"use client";

import { useState } from "react";
import { useAccount, useConnectModal } from "@rainbow-me/rainbowkit";

interface ClaimCredentialProps {
  courseId: string;
  courseName: string;
}

type Status = "idle" | "connecting" | "minting" | "success" | "error";

export function ClaimCredential({ courseId, courseName }: ClaimCredentialProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [status, setStatus] = useState<Status>("idle");
  const [txHash, setTxHash] = useState("");
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClaim() {
    if (!isConnected || !address) {
      openConnectModal?.();
      return;
    }

    setStatus("minting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/complete-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerAddress: address, courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Minting failed");
      }

      setTxHash(data.txHash);
      setTokenId(data.tokenId);
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8 text-center space-y-4">
        <div className="text-5xl">🏆</div>
        <h3 className="text-2xl font-bold text-white">Credential Minted!</h3>
        <p className="text-gray-400">
          Your soulbound NFT credential for{" "}
          <span className="text-purple-300 font-medium">{courseName}</span> is on-chain.
        </p>
        <div className="bg-purple-900/20 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Token ID</span>
            <span className="text-white font-mono">#{tokenId}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 shrink-0">Tx Hash</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 font-mono text-xs truncate hover:text-purple-300"
            >
              {txHash}
            </a>
          </div>
        </div>
        <a
          href={`/verify?tokenId=${tokenId}`}
          className="inline-block mt-2 text-sm text-purple-400 hover:text-purple-300 underline"
        >
          View credential on verify page
        </a>
      </div>
    );
  }

  return (
    <div className="card p-8 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Claim Your Credential</h3>
        <p className="text-gray-400 text-sm">
          Connect your wallet to mint a soulbound NFT proving you completed this course.
        </p>
      </div>

      {!isConnected ? (
        <div className="space-y-3">
          <p className="text-sm text-yellow-400/80 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
            Connect your wallet to receive your on-chain credential.
          </p>
          <button
            onClick={() => openConnectModal?.()}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-purple-900/20 rounded-lg p-3 text-sm">
            <span className="text-gray-400">Minting to: </span>
            <span className="text-purple-300 font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleClaim}
            disabled={status === "minting"}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {status === "minting" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Minting credential...
              </span>
            ) : (
              "Mint My Credential"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
