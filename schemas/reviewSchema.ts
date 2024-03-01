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
    reviewBy: text({ label: 'Skriven av', validation: { isRequired: true } }),

    reviewText: text({ label: 'Omdöme', validation: { isRequired: true } }),

    date: calendarDay({ label: 'Datum', validation: { isRequired: true } }),

    location: text({ label: 'Plats', validation: { isRequired: true } }),
  },
});
