import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15' as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validar o corpo da requisição
        if (!body.quantity || typeof body.quantity !== 'number' || body.quantity <= 0) {
            return NextResponse.json(
                { error: 'Quantity is required and must be a positive number.' },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Produto Exemplo' },
                        unit_amount: 2000, // 20 USD em centavos
                    },
                    quantity: body.quantity,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
        console.error('Stripe error:', error.message);

        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}
