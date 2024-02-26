import { list } from '@keystone-6/core';
import { text, calendarDay } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const reviewSchema = list({
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
    labelField: 'reviewBy',
  },
  fields: {
    reviewBy: text({ validation: { isRequired: true } }),

    reviewText: text({ validation: { isRequired: true } }),

    date: calendarDay({ validation: { isRequired: true } }),

    location: text({ validation: { isRequired: true } }),
  },
});
