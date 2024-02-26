import { list } from '@keystone-6/core';
import { text, image, json, calendarDay } from '@keystone-6/core/fields';

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

    shortDescription: text({ validation: { isRequired: true, length: { max: 100 } } }),

    fullDescription: text({ validation: { isRequired: true } }),

    projectImage: image({ storage: 's3_image' }),

    date: calendarDay({ validation: { isRequired: true } }),

    location: text({ validation: { isRequired: true } }),

    icon: json({
      label: 'Icon',
      ui: {
        views: './customViews/IconPickerField.tsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
  },
});
