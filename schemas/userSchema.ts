import { list } from '@keystone-6/core';
import { allOperations, denyAll } from '@keystone-6/core/access';
import { password, relationship, text } from '@keystone-6/core/fields';

import { isSignedIn, permissions, rules } from '../auth/access';

export const userSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canManageUsers,
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canReadUsers,
      update: rules.canUpdateUsers,
    },
  },
  ui: {
    isHidden: (args) => {
      // Replace this with your own logic
      // For example, you might check if the user has a certain role
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    listView: {
      initialColumns: ['name', 'role'],
    },
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        // canEditOtherUsers kan redigera andra användare
        if (session?.data.role?.canEditOtherUsers) return 'edit';

        // Redigera sin egna användare
        if (session?.itemId === item.id) return 'edit';
        // Annars read mode
        return 'read';
      },
    },
  },
  fields: {
    //   isIndexed ser till att namnet är unikt
    name: text({
      isFilterable: false,
      isOrderable: false,
      isIndexed: 'unique',
      validation: {
        isRequired: true,
      },
    }),
    password: password({
      access: {
        read: denyAll, // Event: is this required?
        update: ({ session, item }) =>
          permissions.canManageUsers({ session }) || session?.itemId === item.id,
      },
      validation: { isRequired: true },
    }),

    //  Rolen som är kopplad till användare.
    role: relationship({
      ref: 'Role.users',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        itemView: {
          fieldMode: (args) => (permissions.canManageUsers(args) ? 'edit' : 'read'),
        },
      },
    }),
  },
});
