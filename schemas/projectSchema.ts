import { list } from '@keystone-6/core';
import { text, integer, image } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const projectSchema = list({
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
    labelField: 'projectTitle',
  },
  fields: {
    projectTitle: text({ validation: { isRequired: true } }),

    description: text({ validation: { isRequired: true } }),

    projectImage: image({ storage: 's3_image' }),

    year: integer({ validation: { isRequired: true } }),

    location: text({}),
  },
});
