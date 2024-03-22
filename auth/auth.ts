import { createAuth } from '@keystone-6/auth';

import { statelessSessions } from '@keystone-6/core/session';

let sessionSecret = process.env.SESSION_SECRET;

const sessionMaxAge = process.env.SESSION_MAX_AGE;
console.log(sessionMaxAge);

// withAuth är en funktion runt base config.
const { withAuth } = createAuth({
  listKey: 'User',
  // Ett identity field på usern.
  identityField: 'name',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'password'],

    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: 'Admin Role',
          canCreateItems: true,
          canManageAllItems: true,
          canSeeOtherUsers: true,
          canEditOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true,
          canUseAdminUI: true,
        },
      },
    },
  },

  sessionData: `
    name
    role {
      id
      name
      canCreateItems
      canManageAllItems
      canSeeOtherUsers
      canEditOtherUsers
      canManageUsers
      canManageRoles
      canUseAdminUI
    }`,
});

const session = statelessSessions({
  maxAge: Number(sessionMaxAge),
  secret: sessionSecret,
});

export { withAuth, session };
