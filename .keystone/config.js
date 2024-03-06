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
var import_core8 = require("@keystone-6/core");
var import_session2 = require("@keystone-6/core/session");
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));

// schemas/userSchema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// auth/access.ts
function isSignedIn({ session: session2 }) {
  return Boolean(session2);
}
var permissions = {
  canCreateItems: ({ session: session2 }) => session2?.data.role?.canCreateItems ?? false,
  canManageAllItems: ({ session: session2 }) => session2?.data.role?.canManageAllItems ?? false,
  canManageUsers: ({ session: session2 }) => session2?.data.role?.canManageUsers ?? false,
  canManageRoles: ({ session: session2 }) => session2?.data.role?.canManageRoles ?? false
};
var rules = {
  canReadItems: ({ session: session2 }) => {
    if (!session2)
      return true;
    if (session2.data.role?.canManageAllItems) {
      return true;
    }
    return { author: { id: { equals: session2.itemId } } };
  },
  canManageItems: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canManageAllItems)
      return true;
    return { author: { id: { equals: session2.itemId } } };
  },
  canReadUsers: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canSeeOtherUsers)
      return true;
    return { id: { equals: session2.itemId } };
  },
  canUpdateUsers: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canEditOtherUsers)
      return true;
    return { id: { equals: session2.itemId } };
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
      defaultFieldMode: ({ session: session2, item }) => {
        if (session2?.data.role?.canEditOtherUsers)
          return "edit";
        if (session2?.itemId === item.id)
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
        update: ({ session: session2, item }) => permissions.canManageUsers({ session: session2 }) || session2?.itemId === item.id
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
    labelField: "productTitle",
    listView: {
      initialColumns: [
        "productTitle",
        "price",
        "discountPrice",
        "recommendedProduct",
        "status"
      ],
      initialSort: { field: "productTitle", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    productTitle: (0, import_fields3.text)({
      label: "Produkttitel",
      isIndexed: "unique",
      validation: { isRequired: true }
    }),
    description: (0, import_fields3.text)({ label: "Produktbeskrivning", validation: { isRequired: true } }),
    productImage: (0, import_fields3.image)({ label: "Produktbild", storage: "s3_image" }),
    price: (0, import_fields3.integer)({ label: "Pris", validation: { isRequired: true } }),
    priceUnit: (0, import_fields3.select)({
      label: "Prisenhet",
      options: [
        { label: "Kr", value: "kr" },
        { label: "Per kubik", value: "perkubik" },
        { label: "Per kvm2", value: "perkvm" },
        { label: "Per stk", value: "perstk" }
      ],
      validation: { isRequired: true },
      defaultValue: "kr",
      ui: { displayMode: "segmented-control" }
    }),
    discountPrice: (0, import_fields3.integer)({
      label: "Rabattpris",
      ui: {
        description: "Om discount pris \xE4r satt, produkten visas i Erbjudande-sektionen."
      }
    }),
    recommendedProduct: (0, import_fields3.select)({
      label: "Rekommenderad produkt?",
      options: [
        { label: "Ja", value: "yes" },
        { label: "Nej", value: "no" }
      ],
      validation: { isRequired: true },
      defaultValue: "no",
      ui: {
        description: "Om Yes, s\xE5 visas produkten som rekommenderad produkt i Erbjudande-sektionen.",
        displayMode: "segmented-control"
      }
    }),
    status: (0, import_fields3.select)({
      options: [
        { label: "Publicerad", value: "published" },
        { label: "Utkast", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    })
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
    labelField: "projectTitle",
    listView: {
      initialColumns: ["projectTitle", "shortDescription", "location"],
      initialSort: { field: "projectTitle", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    projectTitle: (0, import_fields4.text)({ label: "Projekttitel", validation: { isRequired: true } }),
    shortDescription: (0, import_fields4.text)({
      label: "Kort beskrivning",
      validation: { isRequired: true, length: { max: 100 } }
    }),
    fullDescription: (0, import_fields4.text)({
      label: "L\xE5ng beskrivning",
      validation: { isRequired: true }
    }),
    projectImage: (0, import_fields4.image)({ label: "Projektbild", storage: "s3_image" }),
    date: (0, import_fields4.calendarDay)({ label: "Datum", validation: { isRequired: true } }),
    location: (0, import_fields4.text)({ label: "Plats", validation: { isRequired: true } }),
    icon: (0, import_fields4.json)({
      label: "Ikon",
      ui: {
        views: "./customViews/IconPickerField.tsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/reviewSchema.ts
var import_core5 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var import_access9 = require("@keystone-6/core/access");
var reviewSchema = (0, import_core5.list)({
  access: {
    operation: {
      ...(0, import_access9.allOperations)(isSignedIn),
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
    labelField: "reviewBy"
  },
  fields: {
    reviewBy: (0, import_fields5.text)({ label: "Skriven av", validation: { isRequired: true } }),
    reviewText: (0, import_fields5.text)({ label: "Omd\xF6me", validation: { isRequired: true } }),
    date: (0, import_fields5.calendarDay)({ label: "Datum", validation: { isRequired: true } }),
    location: (0, import_fields5.text)({ label: "Plats", validation: { isRequired: true } })
  }
});

// schemas/siteConfigSchema.ts
var import_core6 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var import_access11 = require("@keystone-6/core/access");
var siteConfigSchema = (0, import_core6.list)({
  access: {
    operation: {
      ...(0, import_access11.allOperations)(isSignedIn),
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
  isSingleton: true,
  fields: {
    siteTitle: (0, import_fields6.text)({
      label: "Hero titel",
      validation: { isRequired: true }
    }),
    heroPreamble: (0, import_fields_document.document)({
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        alignment: {
          center: true,
          end: true
        }
      }
    }),
    heroImage1: (0, import_fields6.image)({ label: "Hero bild 1", storage: "s3_image" }),
    heroImage2: (0, import_fields6.image)({ label: "Hero bild 2", storage: "s3_image" }),
    heroImage3: (0, import_fields6.image)({ label: "Hero bild 3", storage: "s3_image" }),
    heroImage4: (0, import_fields6.image)({ label: "Hero bild 4", storage: "s3_image" }),
    projectsPreamble: (0, import_fields_document.document)({
      label: "Projekt f\xF6rord",
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        alignment: {
          center: true,
          end: true
        }
      }
    }),
    productsPreamble: (0, import_fields_document.document)({
      label: "Produkt f\xF6rord",
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        alignment: {
          center: true,
          end: true
        }
      }
    }),
    reviewsPreamble: (0, import_fields_document.document)({
      label: "Omd\xF6men f\xF6rord",
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        alignment: {
          center: true,
          end: true
        }
      }
    }),
    ourServicesPreamble: (0, import_fields_document.document)({
      label: "V\xE5ra tj\xE4nster f\xF6rord",
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        alignment: {
          center: true,
          end: true
        }
      }
    }),
    offersPreamble: (0, import_fields_document.document)({
      label: "V\xE5ra erbjudande f\xF6rord",
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        alignment: {
          center: true,
          end: true
        }
      }
    })
  }
});

// schemas/orderSchema.ts
var import_core7 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var import_stripe = __toESM(require("stripe"));
var import_access13 = require("@keystone-6/core/access");

// utils/email.ts
var import_nodemailer = __toESM(require("nodemailer"));
var import_pug = __toESM(require("pug"));
var import_html_to_text = require("html-to-text");
var Email = class {
  to;
  name;
  phoneNr;
  contactEmail;
  message;
  from;
  ip;
  products;
  amount;
  id;
  createdAt;
  constructor(fromEmail, mailData) {
    this.to = mailData.targetEmail;
    this.name = mailData.name;
    this.phoneNr = mailData.phoneNr;
    this.contactEmail = mailData.contactEmail;
    this.message = mailData.message;
    this.from = fromEmail;
    this.ip = mailData.ip;
    this.products = mailData.orderDetails;
    this.amount = mailData.amount;
    this.id = mailData.orderId;
    this.createdAt = mailData.createdAt;
  }
  newTransport() {
    return import_nodemailer.default.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  async send(template, subject) {
    const html = import_pug.default.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      contactEmail: this.contactEmail,
      message: this.message,
      phoneNr: this.phoneNr,
      ip: this.ip,
      products: this.products,
      amount: this.amount,
      id: this.id,
      createdAt: this.createdAt,
      subject
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: (0, import_html_to_text.htmlToText)(html)
    };
    await this.newTransport().sendMail(mailOptions);
  }
  async sendContactUs() {
    await this.send("contact", "Meddelande fr\xE5n hemsidan!");
  }
  async sendOrderConfirmation() {
    await this.send("order", "Orderbekr\xE4ftelse");
  }
};

// schemas/orderSchema.ts
var stripe = new import_stripe.default(process.env.STRIPE_WEBHOOK_SECRET);
var orderSchema = (0, import_core7.list)({
  access: {
    operation: {
      ...(0, import_access13.allOperations)(isSignedIn),
      create: () => true,
      query: () => true
    },
    filter: {
      query: () => true,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  hooks: {
    resolveInput: async ({ operation, resolvedData, inputData }) => {
      if (operation === "create") {
        console.log("skapa order");
        const session2 = await stripe.checkout.sessions.retrieve(inputData.paymentId);
        if (session2.payment_status === "paid") {
          return resolvedData;
        } else {
          throw new Error("Payment verification failed");
        }
      }
    },
    afterOperation: async ({ operation, item, resolvedData }) => {
      if (operation === "create") {
        const fromEmail = `${process.env.EMAIL_FROM}}`;
        const { customerName, customerEmail, amount, orderDetails, createdAt } = resolvedData;
        const { id } = item;
        const mailData = {
          targetEmail: customerEmail,
          name: customerName,
          amount,
          orderDetails,
          orderId: id.toString(),
          createdAt,
          phoneNr: "",
          contactEmail: "",
          message: "",
          ip: ""
        };
        await new Email(fromEmail, mailData).sendOrderConfirmation();
      }
    }
  },
  ui: {
    labelField: "customerName",
    listView: {
      initialColumns: ["customerName", "customerEmail", "createdAt", "amount", "status"],
      initialSort: { field: "customerName", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    customerName: (0, import_fields7.text)({
      label: "Kundnamn",
      validation: { isRequired: true }
    }),
    customerEmail: (0, import_fields7.text)({
      label: "Kundemail",
      validation: { isRequired: true }
    }),
    orderDetails: (0, import_fields7.json)({ label: "Produkter" }),
    amount: (0, import_fields7.integer)({
      label: "Summa",
      validation: { isRequired: true },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create") {
            return resolvedData.amount / 100;
          }
        }
      }
    }),
    paymentId: (0, import_fields7.text)({
      label: "Betalningsreferens",
      isIndexed: "unique",
      validation: { isRequired: true }
    }),
    cardName: (0, import_fields7.text)({ label: "Kortinnehavare" }),
    createdAt: (0, import_fields7.timestamp)({
      defaultValue: { kind: "now" }
    }),
    status: (0, import_fields7.select)({
      options: [
        { label: "Betald", value: "confirmed" },
        { label: "Ej betald", value: "notpayed" }
      ],
      validation: { isRequired: true },
      defaultValue: "notpayed",
      ui: { displayMode: "segmented-control" }
    })
  }
});

// schema.ts
var lists = {
  User: userSchema,
  Role: roleSchema,
  Product: productSchema,
  Project: projectSchema,
  Review: reviewSchema,
  SiteConfig: siteConfigSchema,
  Order: orderSchema
};

// routes/emailRoutes.ts
var sendEmail = async (req, res) => {
  try {
    const fromEmail = `${process.env.EMAIL_FROM}}`;
    if (!req.body.name || !req.body.contactEmail || !req.body.phoneNr || !req.body.message) {
      return res.status(400).send({
        succuess: false,
        message: "Missing or invalid required fields"
      });
    }
    const mailData = {
      targetEmail: fromEmail,
      name: req.body.name,
      contactEmail: req.body.contactEmail,
      phoneNr: req.body.phoneNr,
      message: req.body.message,
      ip: req.connection.remoteAddress || ""
      // Ensure that ip is always a string
    };
    await new Email(fromEmail, mailData).sendContactUs();
    res.status(200).send({ success: true, message: "Email sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// auth/auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
var sessionMaxAge = process.env.SESSION_MAX_AGE;
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
var session = (0, import_session.statelessSessions)({
  maxAge: Number(sessionMaxAge),
  secret: sessionSecret
});

// keystone.ts
var import_stripe4 = __toESM(require("stripe"));

// routes/checkoutSession.ts
var import_stripe2 = __toESM(require("stripe"));
var stripe2 = new import_stripe2.default(process.env.STRIPE_WEBHOOK_SECRET);
var checkoutSession = async (req, res, commonContext) => {
  try {
    const { products, customerData } = req.body;
    console.log("skapa checkout-session");
    const productQueries = products.map(
      (product) => commonContext.query.Product.findOne({
        where: { id: product.id },
        query: "id productTitle, price, productImage { url }"
      }).then((validProduct) => ({
        ...validProduct,
        quantity: product.quantity,
        ...customerData
      }))
    );
    const validProducts = await Promise.all(productQueries);
    const stripeOrderData = validProducts.map((product, i) => {
      return {
        price_data: {
          currency: "sek",
          unit_amount: product.price * 100,
          product_data: {
            name: `${product.productTitle}`,
            description: product.desc,
            images: [product.productImage.url]
          }
        },
        quantity: product.quantity
      };
    });
    const session2 = await stripe2.checkout.sessions.create({
      line_items: stripeOrderData,
      customer_email: customerData.customerEmail,
      metadata: {
        customerName: customerData.customerName
      },
      mode: "payment",
      success_url: `${process.env.CORS_FRONTEND_ORIGIN}/status?order={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_FRONTEND_ORIGIN}/error`
    });
    res.status(200).json({
      status: "success",
      session: session2
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// routes/webhookCheckout.ts
var import_stripe3 = __toESM(require("stripe"));
var stripe3 = new import_stripe3.default(process.env.STRIPE_WEBHOOK_SECRET);
var webhookCheckout = async (req, res, commonContext) => {
  const signature = req.headers["stripe-signature"];
  console.log("webhook checkout");
  let event;
  try {
    event = stripe3.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGN_SECRET
    );
  } catch (err) {
    return res.sendStatus(400).end();
  }
  if (event.type === "checkout.session.completed") {
    const session2 = event.data.object;
    const { line_items } = await stripe3.checkout.sessions.retrieve(session2.id, {
      expand: ["line_items"]
    });
    const { metadata } = event.data.object;
    const customerName = metadata ? metadata.customerName : null;
    const cardName = event.data.object.customer_details ? event.data.object.customer_details.name : null;
    if (!customerName || !cardName || !line_items || !line_items.data.length || !event.data.object.customer_email || !event.data.object.amount_total || !event.data.object.payment_intent || !event.data.object.payment_intent) {
      throw new Error("Customer name or card name is missing");
    }
    const orderDetails = {
      customerName,
      customerEmail: event.data.object.customer_email,
      line_items: line_items.data,
      amount: event.data.object.amount_total,
      paymentId: event.data.object.id,
      cardName
    };
    await createOrderCheckout(orderDetails, commonContext);
  }
  res.status(200).end();
};
var createOrderCheckout = async (orderDetails, commonContext) => {
  const orderData = {
    customerName: orderDetails.customerName,
    paymentId: orderDetails.paymentId,
    orderDetails: orderDetails.line_items,
    amount: orderDetails.amount,
    customerEmail: orderDetails.customerEmail,
    cardName: orderDetails.cardName,
    status: "confirmed"
  };
  await commonContext.query.Order.createOne({
    data: {
      ...orderData,
      paymentId: orderData.paymentId.toString()
    },
    query: `
      id
      amount
      customerEmail
      customerName
      orderDetails
      cardName
      paymentId
      status
    `
  });
};

// keystone.ts
import_dotenv.default.config();
var stripe4 = new import_stripe4.default(process.env.STRIPE_WEBHOOK_SECRET);
var {
  PORT,
  BASE_URL,
  HEROKU_POSTGRESQL_BROWN_URL,
  CORS_FRONTEND_ORIGIN,
  BUCKETEER_BUCKET_NAME: bucketName,
  BUCKETEER_AWS_REGION: region,
  BUCKETEER_AWS_ACCESS_KEY_ID: accessKeyId,
  BUCKETEER_AWS_SECRET_ACCESS_KEY: secretAccessKey
} = process.env;
var keystone_default = withAuth(
  (0, import_core8.config)({
    db: {
      provider: "postgresql",
      url: HEROKU_POSTGRESQL_BROWN_URL,
      onConnect: async (context) => {
        console.log("Connected to database.");
      },
      // enableLogging: true,
      idField: { kind: "uuid" }
    },
    server: {
      port: Number(PORT),
      cors: { origin: [CORS_FRONTEND_ORIGIN], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.post(
          "/webhook-checkout",
          import_express.default.raw({ type: "application/json" }),
          async (req, res) => {
            await webhookCheckout(req, res, commonContext);
          }
        );
        app.use(import_express.default.json());
        app.post("/api/checkout-session", async (req, res) => {
          await checkoutSession(req, res, commonContext);
        });
        app.use("/public", import_express.default.static("public"));
        app.post("/api/email", sendEmail);
      }
    },
    lists,
    storage: {
      s3_image: {
        kind: "s3",
        type: "image",
        bucketName,
        region,
        accessKeyId,
        secretAccessKey
      }
    },
    ui: {
      isAccessAllowed: ({ session: session2 }) => {
        return session2?.data.role?.canUseAdminUI ?? false;
      }
    },
    session: (0, import_session2.statelessSessions)()
  })
);
//# sourceMappingURL=config.js.map
