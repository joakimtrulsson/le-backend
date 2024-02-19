import { list } from '@keystone-6/core';
import { text, integer, image } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const productSchema = list({
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
  ui: {
    labelField: 'productTitle',
  },
  fields: {
    productTitle: text({ validation: { isRequired: true } }),

    description: text({ validation: { isRequired: true } }),

    productImage: image({ storage: 'image' }),

    price: integer({ validation: { isRequired: true } }),

    discountPrice: integer({}),
  },
});
