import { list } from '@keystone-6/core';
import { text, image } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { type Lists } from '.keystone/types';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const siteConfigSchema: Lists.SiteConfig = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: rules.canReadItems,
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
      links: true,
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

    heroImage1: image({ label: 'Hero bild 1', storage: 's3_image' }),
    heroImage2: image({ label: 'Hero bild 2', storage: 's3_image' }),
    heroImage3: image({ label: 'Hero bild 3', storage: 's3_image' }),
    heroImage4: image({ label: 'Hero bild 4', storage: 's3_image' }),

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

    ourLocationPreamble: document({
      label: '"Var finns vi?" förord',
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
