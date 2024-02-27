import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import type { Request, Response } from 'express';
import { Context } from '.keystone/types';
import dotenv from 'dotenv';
import express from 'express';

import { lists } from './schema';
import sendEmail from './routes/emailRoutes';
import { withAuth } from './auth/auth';

dotenv.config();

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
        app.use(express.json());
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
