"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core5 = require("@keystone-6/core");
var import_session2 = require("@keystone-6/core/session");
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));

// schemas/userSchema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// auth/access.ts
function isSignedIn({ session }) {
  return Boolean(session);
}
var permissions = {
  canCreateItems: ({ session }) => session?.data.role?.canCreateItems ?? false,
  canManageAllItems: ({ session }) => session?.data.role?.canManageAllItems ?? false,
  canManageUsers: ({ session }) => session?.data.role?.canManageUsers ?? false,
  canManageRoles: ({ session }) => session?.data.role?.canManageRoles ?? false
};
var rules = {
  canReadItems: ({ session }) => {
    if (!session)
      return true;
    if (session.data.role?.canManageAllItems) {
      return true;
    }
    return { author: { id: { equals: session.itemId } } };
  },
  canManageItems: ({ session }) => {
    if (!session)
      return false;
    if (session.data.role?.canManageAllItems)
      return true;
    return { author: { id: { equals: session.itemId } } };
  },
  canReadUsers: ({ session }) => {
    if (!session)
      return false;
    if (session.data.role?.canSeeOtherUsers)
      return true;
    return { id: { equals: session.itemId } };
  },
  canUpdateUsers: ({ session }) => {
    if (!session)
      return false;
    if (session.data.role?.canEditOtherUsers)
      return true;
    return { id: { equals: session.itemId } };
  }
};

// schemas/userSchema.ts
var userSchema = (0, import_core.list)({
  access: {
    operation: {
      ...(0, import_access.allOperations)(isSignedIn),
      create: permissions.canManageUsers,
      delete: permissions.canManageUsers
    },
    filter: {
      query: rules.canReadUsers,
      update: rules.canUpdateUsers
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    listView: {
      initialColumns: ["name", "role"]
    },
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canEditOtherUsers)
          return "edit";
        if (session?.itemId === item.id)
          return "edit";
        return "read";
      }
    }
  },
  fields: {
    //   isIndexed ser till att namnet är unikt
    name: (0, import_fields.text)({
      isFilterable: false,
      isOrderable: false,
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    password: (0, import_fields.password)({
      access: {
        read: import_access.denyAll,
        // Event: is this required?
        update: ({ session, item }) => permissions.canManageUsers({ session }) || session?.itemId === item.id
      },
      validation: { isRequired: true }
    }),
    //  Rolen som är kopplad till användare.
    role: (0, import_fields.relationship)({
      ref: "Role.users",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      },
      ui: {
        itemView: {
          fieldMode: (args) => permissions.canManageUsers(args) ? "edit" : "read"
        }
      }
    })
  }
});

// schemas/roleSchema.ts
var import_core2 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var roleSchema = (0, import_core2.list)({
  access: {
    operation: {
      ...(0, import_access3.allOperations)(permissions.canManageRoles),
      query: isSignedIn
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ["name", "author"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageRoles(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    canCreateItems: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageAllItems: (0, import_fields2.checkbox)({ defaultValue: false }),
    canSeeOtherUsers: (0, import_fields2.checkbox)({ defaultValue: false }),
    canEditOtherUsers: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageUsers: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageRoles: (0, import_fields2.checkbox)({ defaultValue: false }),
    canUseAdminUI: (0, import_fields2.checkbox)({ defaultValue: false }),
    canReadChapters: (0, import_fields2.checkbox)({ defaultValue: false }),
    canReadImages: (0, import_fields2.checkbox)({ defaultValue: false }),
    users: (0, import_fields2.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// schemas/productSchema.ts
var import_core3 = require("@keystone-6/core");
var import_fields3 = require("@keystone-6/core/fields");
var import_access5 = require("@keystone-6/core/access");
var productSchema = (0, import_core3.list)({
  access: {
    operation: {
      ...(0, import_access5.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "productTitle"
  },
  fields: {
    productTitle: (0, import_fields3.text)({ validation: { isRequired: true } }),
    description: (0, import_fields3.text)({ validation: { isRequired: true } }),
    productImage: (0, import_fields3.image)({ storage: "image" }),
    price: (0, import_fields3.integer)({ validation: { isRequired: true } }),
    discountPrice: (0, import_fields3.integer)({})
  }
});

// schemas/projectSchema.ts
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var import_access7 = require("@keystone-6/core/access");
var projectSchema = (0, import_core4.list)({
  access: {
    operation: {
      ...(0, import_access7.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "projectTitle"
  },
  fields: {
    projectTitle: (0, import_fields4.text)({ validation: { isRequired: true } }),
    description: (0, import_fields4.text)({ validation: { isRequired: true } }),
    projectImage: (0, import_fields4.image)({ storage: "image" }),
    year: (0, import_fields4.integer)({ validation: { isRequired: true } }),
    location: (0, import_fields4.text)({})
  }
});

// schema.ts
var lists = {
  User: userSchema,
  Role: roleSchema,
  Product: productSchema,
  Project: projectSchema
};

// auth/auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  // Ett identity field på usern.
  identityField: "name",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "password"],
    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: "Admin Role",
          canCreateItems: true,
          canManageAllItems: true,
          canSeeOtherUsers: true,
          canEditOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true,
          canUseAdminUI: true
        }
      }
    }
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
    }`
});

// keystone.ts
import_dotenv.default.config();
var { PORT, BASE_URL, DATABASE_URL } = process.env;
var keystone_default = withAuth(
  (0, import_core5.config)({
    db: {
      provider: "postgresql",
      url: DATABASE_URL,
      onConnect: async (context) => {
        console.log("Connected to database.");
      },
      // Optional advanced configuration
      enableLogging: true,
      idField: { kind: "uuid" }
      // shadowDatabaseUrl: 'postgres://dbuser:dbpass@localhost:5432/shadowdb'
    },
    server: {
      port: Number(PORT),
      cors: { origin: ["*"], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.use("/public", import_express.default.static("public"));
      }
    },
    lists,
    storage: {
      image: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `/public/images${path}`,
        serverRoute: {
          path: "public/images"
        },
        storagePath: "public/images"
      }
    },
    ui: {
      isAccessAllowed: ({ session }) => {
        return session?.data.role?.canUseAdminUI ?? false;
      }
    },
    session: (0, import_session2.statelessSessions)()
  })
);
//# sourceMappingURL=config.js.map
