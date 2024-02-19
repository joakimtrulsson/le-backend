import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { checkbox, relationship, text } from '@keystone-6/core/fields';

import { isSignedIn, permissions } from '../auth/access';

export const roleSchema = list({
  access: {
    operation: {
      ...allOperations(permissions.canManageRoles),
      query: isSignedIn,
    },
  },
  ui: {
    isHidden: (args) => {
      // Replace this with your own logic
      // For example, you might check if the user has a certain role
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ['name', 'author'],
    },
    itemView: {
      defaultFieldMode: (args) => (permissions.canManageRoles(args) ? 'edit' : 'read'),
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),

    canCreateItems: checkbox({ defaultValue: false }),

    canManageAllItems: checkbox({ defaultValue: false }),

    canSeeOtherUsers: checkbox({ defaultValue: false }),

    canEditOtherUsers: checkbox({ defaultValue: false }),

    canManageUsers: checkbox({ defaultValue: false }),

    canManageRoles: checkbox({ defaultValue: false }),

    canUseAdminUI: checkbox({ defaultValue: false }),

    canReadChapters: checkbox({ defaultValue: false }),

    canReadImages: checkbox({ defaultValue: false }),

    users: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
