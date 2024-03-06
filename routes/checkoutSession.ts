import Stripe from 'stripe';
import type { Request, Response } from 'express';
import type { Context } from '.keystone/types';

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string);

export const checkoutSession = async (
  req: Request,
  res: Response,
  commonContext: Context
) => {
  try {
    const { products, customerData } = req.body;
    console.log('skapa checkout-session');

    const productQueries = products.map((product: { id: string; quantity: number }) =>
      commonContext.query.Product.findOne({
        where: { id: product.id },
        query: 'id productTitle, price, productImage { url }',
      }).then((validProduct) => ({
        ...validProduct,
        quantity: product.quantity,
        ...customerData,
      }))
    );

    const validProducts = await Promise.all(productQueries);

    const stripeOrderData = validProducts.map((product, i) => {
      return {
        price_data: {
          currency: 'sek',
          unit_amount: product.price * 100,
          product_data: {
            name: `${product.productTitle}`,
            description: product.desc,
            images: [product.productImage.url],
          },
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: stripeOrderData,
      customer_email: customerData.customerEmail,
      metadata: {
        customerName: customerData.customerName,
      },
      mode: 'payment',
      success_url:
        `${process.env.CORS_FRONTEND_ORIGIN}/status?order={CHECKOUT_SESSION_ID}` as string,
      cancel_url: `${process.env.CORS_FRONTEND_ORIGIN}/error` as string,
    });

    res.status(200).json({
      status: 'success',
      session: session,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
