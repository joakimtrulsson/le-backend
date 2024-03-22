import { list } from '@keystone-6/core';
import { text, integer, select, timestamp, json } from '@keystone-6/core/fields';
import Stripe from 'stripe';
import { type Lists } from '.keystone/types';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, rules } from '../auth/access';
import { Email } from '../utils/email';

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string);

export const orderSchema: Lists.Order = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: () => true,
      query: () => true,
    },
    filter: {
      query: () => true,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  hooks: {
    resolveInput: async ({ operation, resolvedData, inputData }) => {
      if (operation === 'create') {
        console.log('Creating order');
        const session = await stripe.checkout.sessions.retrieve(
          inputData.paymentId as string
        );

        if (session.payment_status === 'paid') {
          return resolvedData as any;
        } else {
          throw new Error('Payment verification failed');
        }
      }
    },
    afterOperation: async ({ operation, item, resolvedData }) => {
      try {
        if (operation === 'create') {
          console.log('Sending email');
          const fromEmail = `${process.env.EMAIL_FROM}}`;
          const { customerName, customerEmail, amount, orderDetails, createdAt } =
            resolvedData;
          const { id } = item;

          const mailData = {
            targetEmail: customerEmail,
            name: customerName,
            amount: amount,
            orderDetails: orderDetails,
            orderId: id.toString(),
            createdAt,
            phoneNr: '',
            contactEmail: '',
            message: '',
            ip: '',
          };

          // Skicka ett email till kunden
          await new Email(fromEmail, mailData as any).sendOrderConfirmation();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  ui: {
    labelField: 'customerName',
    listView: {
      initialColumns: ['customerName', 'customerEmail', 'createdAt', 'amount', 'status'],
      initialSort: { field: 'customerName', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    customerName: text({
      label: 'Kundnamn',
      validation: { isRequired: true },
    }),

    customerEmail: text({
      label: 'Kundemail',
      validation: { isRequired: true },
    }),

    orderDetails: json({ label: 'Produkter' }),

    amount: integer({
      label: 'Summa',
      validation: { isRequired: true },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create') {
            return (resolvedData.amount as any) / 100;
          }
        },
      },
    }),

    paymentId: text({
      label: 'Betalningsreferens',
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),

    cardName: text({ label: 'Kortinnehavare' }),

    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),

    status: select({
      options: [
        { label: 'Betald', value: 'confirmed' },
        { label: 'Ej betald', value: 'notpayed' },
      ],
      validation: { isRequired: true },
      defaultValue: 'notpayed',
      ui: { displayMode: 'segmented-control' },
    }),
  },
});
