import Stripe from 'stripe';
import type { Request, Response } from 'express';
import type { Context } from '.keystone/types';

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string);

interface OrderDetailsType {
  customerName: string;
  customerEmail: string;
  line_items: any;
  amount: number;
  paymentId: Stripe.Checkout.Session['id'];
  cardName: string;
}

export const webhookCheckout = async (
  req: Request,
  res: Response,
  commonContext: Context
) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SIGN_SECRET as string
    );
  } catch (err) {
    return res.sendStatus(400).end();
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });

    const { metadata } = event.data.object;

    const customerName = metadata ? metadata.customerName : null;
    const cardName = event.data.object.customer_details
      ? event.data.object.customer_details.name
      : null;

    if (
      !customerName ||
      !cardName ||
      !line_items ||
      !line_items.data.length ||
      !event.data.object.customer_email ||
      !event.data.object.amount_total ||
      !event.data.object.payment_intent ||
      !event.data.object.payment_intent
    ) {
      throw new Error('Customer name or card name is missing');
    }

    const orderDetails: OrderDetailsType = {
      customerName: customerName,
      customerEmail: event.data.object.customer_email,
      line_items: line_items.data,
      amount: event.data.object.amount_total,
      paymentId: event.data.object.id,
      cardName: cardName,
    };

    await createOrderCheckout(orderDetails, commonContext);
  }

  res.status(200).end();
};

// Detta är en hjälpfunktion som skapar en order i databasen
const createOrderCheckout = async (
  orderDetails: OrderDetailsType,
  commonContext: Context
) => {
  const orderData = {
    customerName: orderDetails.customerName,
    paymentId: orderDetails.paymentId,
    orderDetails: orderDetails.line_items,
    amount: orderDetails.amount,
    customerEmail: orderDetails.customerEmail,
    cardName: orderDetails.cardName,
    status: 'confirmed',
  };

  await commonContext.query.Order.createOne({
    data: {
      ...orderData,
      paymentId: orderData.paymentId.toString(),
    },
    query: `
      id
      amount
      customerEmail
      customerName
      orderDetails
      cardName
      paymentId
      status
    `,
  });
};
