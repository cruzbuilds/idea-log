"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

export function ShareControl({
  ideaId,
  shareToken,
  onChange,
}: {
  ideaId: string;
  shareToken: string | null;
  onChange: (shareToken: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const url =
    shareToken && typeof window !== "undefined"
      ? `${window.location.origin}/s/${shareToken}`
      : shareToken
      ? `/s/${shareToken}`
      : null;

  async function enable(regenerate = false) {
    setLoading(true);
    const res = await fetch(`/api/ideas/${ideaId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regenerate }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.idea.shareToken);
      setCopied(false);
    }
  }

  async function disable() {
    setLoading(true);
    const res = await fetch(`/api/ideas/${ideaId}/share`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      onChange(null);
    }
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!shareToken) {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Not shared. Anyone with the link can view this idea without an account.
        </p>
        <Button variant="secondary" size="sm" onClick={() => enable(false)} disabled={loading}>
          {loading ? "Creating…" : "Create share link"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input readOnly value={url ?? ""} className="font-mono text-xs" />
        <Button variant="secondary" size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => enable(true)} disabled={loading}>
          Rotate link
        </Button>
        <Button variant="danger" size="sm" onClick={disable} disabled={loading}>
          Revoke access
        </Button>
      </div>
    </div>
  );
}
