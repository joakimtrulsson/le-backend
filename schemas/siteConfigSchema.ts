import { list } from '@keystone-6/core';
import { text, integer, image, select } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const siteConfigSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  isSingleton: true,
  fields: {
    siteTitle: text({ validation: { isRequired: true } }),

    heroPreamble: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        alignment: {
          center: true,
          end: true,
        },
      },
    }),

    heroImage: image({ storage: 's3_image' }),

    projectsPreamble: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        alignment: {
          center: true,
          end: true,
        },
      },
    }),

    productsPreamble: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        alignment: {
          center: true,
          end: true,
        },
      },
    }),

    reviewsPreamble: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        alignment: {
          center: true,
          end: true,
        },
      },
    }),

    ourServicesPreamble: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        alignment: {
          center: true,
          end: true,
        },
      },
    }),

    offersPreamble: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        alignment: {
          center: true,
          end: true,
        },
      },
    }),
  },
});
