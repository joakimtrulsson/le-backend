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
    listView: {
      initialColumns: [
        'productTitle',
        'price',
        'discountPrice',
        'recommendedProduct',
        'status',
      ],
      initialSort: { field: 'productTitle', direction: 'ASC' },
      pageSize: 50,
    },
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

    discountPrice: integer({
      ui: {
        description: 'Om discount pris är satt, produkten visas i Erbjudande-sektionen.',
      },
    }),

    recommendedProduct: select({
      options: [
        { label: 'Ja', value: 'yes' },
        { label: 'Nej', value: 'no' },
      ],
      validation: { isRequired: true },
      defaultValue: 'no',
      ui: {
        description:
          'Om Yes, så visas produkten som rekommenderad produkt i Erbjudande-sektionen.',
        displayMode: 'segmented-control',
      },
    }),

    status: select({
      options: [
        { label: 'Publicerad', value: 'published' },
        { label: 'Utkast', value: 'draft' },
      ],
      validation: { isRequired: true },
      defaultValue: 'draft',
      ui: { displayMode: 'segmented-control' },
    }),
  },
});
