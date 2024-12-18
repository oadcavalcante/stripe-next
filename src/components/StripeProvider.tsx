"use client";

import { loadStripe, Stripe } from "@stripe/stripe-js";
import { PropsWithChildren, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripeProvider({ children }: PropsWithChildren) {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  stripePromise.then((loadedStripe) => {
    if (!stripe) {
      setStripe(loadedStripe);
    }
  });

  return stripe ? <Elements stripe={stripe}>{children}</Elements> : <>{children}</>;
}
