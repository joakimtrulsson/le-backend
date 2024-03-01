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
    siteTitle: text({
      label: 'Hero titel',
      validation: { isRequired: true },
    }),

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

    heroImage: image({ label: 'Hero bild', storage: 's3_image' }),

    projectsPreamble: document({
      label: 'Projekt förord',
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
      label: 'Produkt förord',
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
      label: 'Omdömen förord',
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
      label: 'Våra tjänster förord',
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
      label: 'Våra erbjudande förord',
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
