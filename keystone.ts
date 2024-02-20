import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import type { Request, Response } from 'express';
import { Context } from '.keystone/types';
import dotenv from 'dotenv';
import express from 'express';

import { lists } from './schema';

import { withAuth } from './auth/auth';

dotenv.config();

const { PORT, BASE_URL, DATABASE_URL } = process.env;

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: DATABASE_URL as string,
      onConnect: async (context) => {
        console.log('Connected to database.');
      },

      // Optional advanced configuration
      enableLogging: true,
      idField: { kind: 'uuid' },
      // shadowDatabaseUrl: 'postgres://dbuser:dbpass@localhost:5432/shadowdb'
    },

    server: {
      port: Number(PORT),
      cors: { origin: ['*'], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.use('/public', express.static('public'));
      },
    },
    lists,
    storage: {
      image: {
        kind: 'local',
        type: 'image',
        generateUrl: (path) => `/public/images${path}`,
        serverRoute: {
          path: 'public/images',
        },
        storagePath: 'public/images',
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
