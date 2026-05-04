// --- Available Utils Imports ---
import * as AccountDeletionRequests from '@shared/utils/AccountDeletionRequests';
import * as AffiliateCommissions from '@shared/utils/affiliate/AffiliateCommissions';
import * as AffiliatePoints from '@shared/utils/affiliate/AffiliatePoints';
import * as AffiliatePrograms from '@shared/utils/affiliate/AffiliatePrograms';
import * as AffiliateUsers from '@shared/utils/affiliate/AffiliateUsers';
import * as ContactForm from '@shared/utils/ContactForm';
import * as Contacts from '@shared/utils/Contacts';
import * as Orders from '@shared/utils/Orders';
import * as Pages from '@shared/utils/Pages';
import * as PostCategories from '@shared/utils/PostCategories';
import * as Posts from '@shared/utils/Posts';
import * as ProductBrands from '@shared/utils/ProductBrands';
import * as ProductCategories from '@shared/utils/ProductCategories';
import * as ProductVariants from '@shared/utils/ProductVariants';
import * as ProductAttributes from '@shared/utils/ProductAttributes';
import * as Products from '@shared/utils/Products';
import * as Promotions from '@shared/utils/Promotions';
import * as ServiceCategories from '@shared/utils/ServiceCategories';
import * as Services from '@shared/utils/Services';
import * as Translations from '@shared/utils/Translations';
import * as UnSubcribeRequests from '@shared/utils/UnSubcribeRequests';
import * as Users from '@shared/utils/Users';
import * as Vendor from '@shared/utils/Vendor';

import { ResourceApis } from '@shared/types/api';

export const Apis: { [key: string]: ResourceApis } = {
  // --- Core Content Management ---
  pages: {
    findMany: Pages.findManyPages,
    findOne: Pages.findOnePage,
    create: Pages.createPage,
    update: Pages.updatePage,
    delete: Pages.deletePage,
    deleteMultiple: Pages.deletePages,
  },
  posts: {
    findMany: Posts.findManyPosts,
    findOne: Posts.findOnePost,
    create: Posts.createPost,
    update: Posts.updatePost,
    delete: Posts.deletePost,
    deleteMultiple: Posts.deletePosts,
  },
  post_categories: {
    findMany: PostCategories.findManyPostCategories,
    findOne: PostCategories.findOnePostCategory,
    create: PostCategories.createPostCategory,
    update: PostCategories.updatePostCategory,
    delete: PostCategories.deletePostCategory,
    deleteMultiple: PostCategories.deletePostCategories,
  },
  services: {
    findMany: Services.findManyServices,
    findOne: Services.findOneService,
    create: Services.createService,
    update: Services.updateService,
    delete: Services.deleteService,
    deleteMultiple: Services.deleteServices,
  },
  service_categories: {
    findMany: ServiceCategories.findManyServiceCategories,
    findOne: ServiceCategories.findOneServiceCategory,
    create: ServiceCategories.createServiceCategory,
    update: ServiceCategories.updateServiceCategory,
    delete: ServiceCategories.deleteServiceCategory,
    deleteMultiple: ServiceCategories.deleteServiceCategories,
  },

  // --- User Management ---
  users: {
    findMany: Users.findManyUsers,
    findOne: Users.findOneUser,
    create: Users.createUser,
    update: Users.updateUser,
    delete: Users.deleteUser,
    deleteMultiple: Users.deleteUsers,
  },
  products: {
    findMany: Products.findManyProducts,
    findOne: Products.findOneProduct,
    create: Products.createProduct,
    update: Products.updateProduct,
    delete: Products.deleteProduct,
    deleteMultiple: Products.deleteProducts,
  },
  product_categories: {
    findMany: ProductCategories.findManyProductCategories,
    findOne: ProductCategories.findOneProductCategory,
    create: ProductCategories.createProductCategory,
    update: ProductCategories.updateProductCategory,
    delete: ProductCategories.deleteProductCategory,
    deleteMultiple: ProductCategories.deleteProductCategories,
  },
  product_brands: {
    findMany: ProductBrands.findManyProductBrands,
    findOne: ProductBrands.findOneProductBrand,
    create: ProductBrands.createProductBrand,
    update: ProductBrands.updateProductBrand,
    delete: ProductBrands.deleteProductBrand,
    deleteMultiple: ProductBrands.deleteProductBrands,
  },
  product_attributes: {
    findMany: ProductAttributes.findManyProductAttributes,
    findOne: ProductAttributes.findOneProductAttribute,
    create: ProductAttributes.createProductAttribute,
    update: ProductAttributes.updateProductAttribute,
    delete: ProductAttributes.deleteProductAttribute,
    deleteMultiple: ProductAttributes.deleteProductAttributes,
  },
  product_variants: {
    findMany: ProductVariants.findManyProductVariants,
    findOne: ProductVariants.findOneProductVariant,
    create: ProductVariants.createProductVariant,
    update: ProductVariants.updateProductVariant,
    delete: ProductVariants.deleteProductVariant,
    deleteMultiple: ProductVariants.deleteProductVariants,
  },
  orders: {
    findMany: Orders.findManyOrders,
    findOne: Orders.findOneOrder,
    create: Orders.createOrder,
    update: Orders.updateOrder,
    delete: Orders.deleteOrder,
    deleteMultiple: Orders.deleteOrders,
  },
  vendor: {
    findMany: Vendor.findManyVendors,
    findOne: Vendor.findOneVendor,
    create: Vendor.createVendor,
    update: Vendor.updateVendor,
    delete: Vendor.deleteVendor,
    deleteMultiple: Vendor.deleteVendors,
  },

  /* Affiliate programs */
  affiliate_programs: {
    findMany: AffiliatePrograms.findManyAffiliatePrograms,
    findOne: AffiliatePrograms.findOneAffiliateProgram,
    create: AffiliatePrograms.createAffiliateProgram,
    update: AffiliatePrograms.updateAffiliateProgram,
    delete: AffiliatePrograms.deleteAffiliateProgram,
    deleteMultiple: AffiliatePrograms.deleteAffiliatePrograms,
  },
  affiliate_users: {
    findMany: AffiliateUsers.findManyAffiliateUsers,
    findOne: AffiliateUsers.findOneAffiliateUser,
    create: AffiliateUsers.createAffiliateUser,
    update: AffiliateUsers.updateAffiliateUser,
    delete: AffiliateUsers.deleteAffiliateUser,
    deleteMultiple: AffiliateUsers.deleteAffiliateUsers,
  },
  affiliate_commissions: {
    findMany: AffiliateCommissions.findManyAffiliateCommissions,
    findOne: AffiliateCommissions.findOneAffiliateCommission,
    create: AffiliateCommissions.createAffiliateCommission,
    update: AffiliateCommissions.updateAffiliateCommission,
    delete: AffiliateCommissions.deleteAffiliateCommission,
    deleteMultiple: AffiliateCommissions.deleteAffiliateCommissions,
  },
  affiliate_points: {
    findMany: AffiliatePoints.findManyAffiliatePoints,
    findOne: AffiliatePoints.findOneAffiliatePoint,
    create: AffiliatePoints.createAffiliatePoint,
    update: AffiliatePoints.updateAffiliatePoint,
    delete: AffiliatePoints.deleteAffiliatePoint,
    deleteMultiple: AffiliatePoints.deleteAffiliatePoints,
  },
  promotions: {
    findMany: Promotions.findManyPromotions,
    findOne: Promotions.findOnePromotion,
    create: Promotions.createPromotion,
    update: Promotions.updatePromotion,
    delete: Promotions.deletePromotion,
    deleteMultiple: Promotions.deletePromotions,
  },
  // --- Communication & Contact ---
  contact_form: {
    findMany: ContactForm.findManyContactForms,
    findOne: ContactForm.findOneContactForm,
    create: ContactForm.createContactForm,
    update: ContactForm.updateContactForm,
    delete: ContactForm.deleteContactForm,
    deleteMultiple: ContactForm.deleteContactForms,
  },
  contacts: {
    findMany: Contacts.findManyContacts,
    findOne: Contacts.findOneContact,
    create: Contacts.createContact,
    update: Contacts.updateContact,
    delete: Contacts.deleteContact,
    deleteMultiple: Contacts.deleteContacts,
  },
  unsubscribe_requests: {
    findMany: UnSubcribeRequests.findManyUnSubcribeRequests,
    findOne: UnSubcribeRequests.findOneUnSubcribeRequest,
    create: UnSubcribeRequests.createUnSubcribeRequest,
    update: UnSubcribeRequests.updateUnSubcribeRequest,
    delete: UnSubcribeRequests.deleteUnSubcribeRequest,
    deleteMultiple: UnSubcribeRequests.deleteUnSubcribeRequests,
  },
  translations: {
    findMany: Translations.findManyTranslations,
    findOne: Translations.findOneTranslation,
    create: Translations.createTranslation,
    update: Translations.updateTranslation,
    delete: Translations.deleteTranslation,
    deleteMultiple: Translations.deleteTranslations,
  },
  account_deletion_requests: {
    findMany: AccountDeletionRequests.findManyAccountDeletionRequests,
    findOne: AccountDeletionRequests.findOneAccountDeletionRequest,
    create: AccountDeletionRequests.createAccountDeletionRequest,
    update: AccountDeletionRequests.updateAccountDeletionRequest,
    delete: AccountDeletionRequests.deleteAccountDeletionRequest,
    deleteMultiple: AccountDeletionRequests.deleteAccountDeletionRequests,
  },
};