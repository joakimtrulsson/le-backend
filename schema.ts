import { User, Role, Product, Project, Review, SiteConfig, Order } from './schemas/index';
import { type Lists } from '.keystone/types';

export const lists: Lists = {
  User,
  Role,
  Product,
  Project,
  Review,
  SiteConfig,
  Order,
};
