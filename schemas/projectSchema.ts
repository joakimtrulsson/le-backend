import { list } from '@keystone-6/core';
import { text, image, json, calendarDay } from '@keystone-6/core/fields';
import { type Lists } from '.keystone/types';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const projectSchema: Lists.Project = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: () => true,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  ui: {
    labelField: 'projectTitle',
    listView: {
      initialColumns: ['projectTitle', 'shortDescription', 'location'],
      initialSort: { field: 'projectTitle', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    projectTitle: text({ label: 'Projekttitel', validation: { isRequired: true } }),

    shortDescription: text({
      label: 'Kort beskrivning',
      validation: { isRequired: true, length: { max: 100 } },
    }),

    fullDescription: text({
      label: 'Lång beskrivning',
      validation: { isRequired: true },
    }),

    projectImage: image({ label: 'Projektbild', storage: 's3_image' }),

    date: calendarDay({ label: 'Datum', validation: { isRequired: true } }),

    location: text({ label: 'Plats', validation: { isRequired: true } }),

    icon: json({
      label: 'Ikon',
      ui: {
        views: './customViews/IconPickerField.tsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
  },
});
