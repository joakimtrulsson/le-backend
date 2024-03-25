import { list } from '@keystone-6/core';
import { text, integer, image, select, relationship } from '@keystone-6/core/fields';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';
import { type Lists } from '.keystone/types';

export const productSchema: Lists.Product = list({
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
    productTitle: text({
      label: 'Produkttitel',
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),

    description: text({ label: 'Produktbeskrivning', validation: { isRequired: true } }),

    productImage: image({ label: 'Produktbild', storage: 's3_image' }),

    productCategory: relationship({
      ref: 'ProductCategory.products',
      many: false,
      ui: {
        displayMode: 'select',
        createView: { fieldMode: 'edit' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    price: integer({ label: 'Pris', validation: { isRequired: true } }),

    priceUnit: select({
      label: 'Prisenhet',
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
      label: 'Rabattpris',
      ui: {
        description: 'Om discount pris är satt, så visas priset i rött.',
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
