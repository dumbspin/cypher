"use client";

/**
 * Bulk Scanner page — not included in this pass.
 * Redirects to the homepage.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BulkPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return null;
}
