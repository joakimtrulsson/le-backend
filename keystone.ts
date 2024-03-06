import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import express from 'express';

import { lists } from './schema';
import { sendEmail } from './routes/emailRoutes';
import { withAuth } from './auth/auth';

import Stripe from 'stripe';
import { checkoutSession } from './routes/checkoutSession';
import { webhookCheckout } from './routes/webhookCheckout';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET as string);

const {
  PORT,
  BASE_URL,
  HEROKU_POSTGRESQL_BROWN_URL,
  CORS_FRONTEND_ORIGIN,
  BUCKETEER_BUCKET_NAME: bucketName,
  BUCKETEER_AWS_REGION: region,
  BUCKETEER_AWS_ACCESS_KEY_ID: accessKeyId,
  BUCKETEER_AWS_SECRET_ACCESS_KEY: secretAccessKey,
} = process.env;

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: HEROKU_POSTGRESQL_BROWN_URL as string,
      onConnect: async (context) => {
        console.log('Connected to database.');
      },
      // enableLogging: true,
      idField: { kind: 'uuid' },
    },
    server: {
      port: Number(PORT),
      cors: { origin: [CORS_FRONTEND_ORIGIN], credentials: true },
      extendExpressApp: (app, commonContext) => {
        // Om betalning lyckas så skapas en order i databasen
        app.post(
          '/webhook-checkout',
          express.raw({ type: 'application/json' }),
          async (req: Request, res: Response) => {
            await webhookCheckout(req, res, commonContext);
          }
        );

        app.use(express.json());

        // Skapa en checkout-session med Stripe
        app.post('/api/checkout-session', async (req: Request, res: Response) => {
          await checkoutSession(req, res, commonContext);
        });

        app.use('/public', express.static('public'));
        app.post('/api/email', sendEmail);
      },
    },
    lists,
    storage: {
      s3_image: {
        kind: 's3',
        type: 'image',
        bucketName: bucketName as string,
        region: region as string,
        accessKeyId,
        secretAccessKey,
      },
    },

    ui: {
      isAccessAllowed: ({ session }) => {
        return session?.data.role?.canUseAdminUI ?? false;
      },
    },
    session: statelessSessions(),
  })
);
