import { list } from '@keystone-6/core';
import { text, integer, image, select } from '@keystone-6/core/fields';

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
    productTitle: text({ isIndexed: 'unique', validation: { isRequired: true } }),

    description: text({ validation: { isRequired: true } }),

    productImage: image({ storage: 's3_image' }),

    price: integer({ validation: { isRequired: true } }),

    priceUnit: select({
      options: [
        { label: 'Kr', value: 'kr' },
        { label: 'Per kubik', value: 'perkubik' },
        { label: 'Per kvm2', value: 'perkvm' },
        { label: 'Per stk', value: 'perstk' },
      ],
      validation: { isRequired: true },
      defaultValue: 'kr',
      ui: { displayMode: 'segmented-control' },
    }),

    discountPrice: integer({}),

    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      validation: { isRequired: true },
      defaultValue: 'draft',
      ui: { displayMode: 'segmented-control' },
    }),
  },
});
