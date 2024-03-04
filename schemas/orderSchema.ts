import { list } from '@keystone-6/core';
import { text, integer, select, timestamp, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const orderSchema = list({
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
        'id',
        'customerName',
        'customerEmail',
        'createdAt',
        'amount',
        'status',
      ],
      initialSort: { field: 'productTitle', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    customerName: text({
      label: 'Kundnamn',
      validation: { isRequired: true },
    }),

    customerEmail: text({
      label: 'Kundemail',
      validation: { isRequired: true },
    }),

    orderDetails: json({ label: 'Produkter' }),

    amount: integer({ label: 'Summa', validation: { isRequired: true } }),

    paymentId: text({ label: 'Betalningsreferens' }),

    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),

    status: select({
      options: [
        { label: 'Betald', value: 'confirmed' },
        { label: 'Ej betald', value: 'notpayed' },
      ],
      validation: { isRequired: true },
      defaultValue: 'notpayed',
      ui: { displayMode: 'segmented-control' },
    }),
  },
});
