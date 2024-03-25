export type Session = {
  itemId: string;
  listKey: string;
  data: {
    name: string;
    role: {
      id: string;
      name: string;
      canCreateItems: boolean;
      canReadItems: boolean;
      canManageAllItems: boolean;
      canSeeOtherUsers: boolean;
      canEditOtherUsers: boolean;
      canManageUsers: boolean;
      canManageRoles: boolean;
      canUseAdminUI: boolean;
    };
  };
};

type AccessArgs = {
  session?: Session;
};

export function isSignedIn({ session }: AccessArgs) {
  return Boolean(session);
}

// Permissions är funktioner för att kontrollera om den nuvarande användarens roll värde satt till true.
export const permissions = {
  canCreateItems: ({ session }: AccessArgs) =>
    session?.data.role?.canCreateItems ?? false,
  canManageAllItems: ({ session }: AccessArgs) =>
    session?.data.role?.canManageAllItems ?? false,
  canManageUsers: ({ session }: AccessArgs) =>
    session?.data.role?.canManageUsers ?? false,
  canManageRoles: ({ session }: AccessArgs) =>
    session?.data.role?.canManageRoles ?? false,
};

// Rules är funktioner som returnerar true, false eller filter som begränsar datan.
export const rules = {
  canReadItems: ({ session }: AccessArgs) => {
    if (!session) return false;

    if (session.data.role?.canReadItems) return true;
    {
      return true;
    }
    return false;
  },
  canManageItems: ({ session }: AccessArgs) => {
    if (!session) return false;

    if (session.data.role?.canManageAllItems) return true;
    return false;
  },
  canReadUsers: ({ session }: AccessArgs) => {
    if (!session) return false;

    if (session.data.role?.canSeeOtherUsers) return true;

    return false;
  },
  canUpdateUsers: ({ session }: AccessArgs) => {
    if (!session) return false;

    if (session.data.role?.canEditOtherUsers) return true;

    return false;
  },
};
