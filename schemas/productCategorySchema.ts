import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { type Lists } from '.keystone/types';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const productCategorySchema: Lists.ProductCategory = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: rules.canReadItems,
      update: () => true, // Replace 'rules.canManageItems' with a valid filter condition
      delete: rules.canManageItems,
    },
  },
  ui: {
    labelField: 'categoryTitle',
    listView: {
      initialColumns: ['categoryTitle'],
      initialSort: { field: 'categoryTitle', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    categoryTitle: text({
      label: 'Kategorititel',
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),
    products: relationship({
      ref: 'Product.productCategory',
      many: true,
    }),
  },
});
