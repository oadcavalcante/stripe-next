"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      });

      const { sessionId } = await res.json();

      const stripe = await (
        await import("@stripe/stripe-js")
      ).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Erro no checkout:", error);
    }
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-black">Integração Stripe com Next.js</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Carregando..." : "Pagar $20"}
      </button>
    </main>
  );
}
