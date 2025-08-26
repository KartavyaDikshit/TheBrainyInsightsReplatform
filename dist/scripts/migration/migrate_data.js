// scripts/migration/migrate_data.ts
import { PrismaClient } from '@tbi/database';
const prisma = new PrismaClient();
async function main() {
    console.log('Starting data migration...');
    // const oldDbConnection = await mysql.createConnection({ // Commented out
    //   host: process.env.OLD_DB_HOST || 'localhost',
    //   user: process.env.OLD_DB_USER || 'tbi_user',
    //   password: process.env.OLD_DB_PASSWORD || 'karta123',
    //   database: process.env.OLD_DB_DATABASE || 'tbi_db',
    // });
    // console.log('Connected to old MySQL database.'); // Commented out
    const idMap = {};
    // await migrateUsers(oldDbConnection, prisma, idMap); // Commented out
    // await migrateCategories(oldDbConnection, prisma, idMap); // Commented out
    // await migrateReports(oldDbConnection, prisma, idMap); // Commented out
    // await migrateOrders(oldDbConnection, prisma, idMap); // Commented out
    // await migrateOrderItems(oldDbConnection, prisma, idMap); // Commented out
    // await migrateEnquiries(oldDbConnection, prisma, idMap); // Commented out
    // await migrateBlogs(oldDbConnection, prisma, idMap); // Commented out
    // await migrateJapaneseReports(oldDbConnection, prisma, idMap); // Commented out
    console.log('Data migration complete. (Migration functions commented out)'); // Modified message
    // await oldDbConnection.end(); // Commented out
    await prisma.$disconnect();
}
// Commented out all migration helper functions
/*
async function fetchOldData(connection: mysql.Connection, tableName: string) {
  const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
  return rows;
}

function mapUserStatus(oldStatus: string): UserStatus {
  switch (oldStatus) {
    case 'Active':
      return UserStatus.ACTIVE;
    case 'Inactive':
      return UserStatus.INACTIVE;
    case 'Pending':
      return UserStatus.PENDING;
    default:
      return UserStatus.INACTIVE;
  }
}

function mapEnquiryStatus(oldStatus: string): EnquiryStatus {
  switch (oldStatus) {
    case 'Seen':
      return EnquiryStatus.CONTACTED; // Mapping Seen to Contacted
    case 'Unseen':
      return EnquiryStatus.NEW; // Mapping Unseen to New
    default:
      return EnquiryStatus.NEW;
  }
}

function mapOrderStatus(oldStatus: string): OrderStatus {
  switch (oldStatus) {
    case 'Pending':
      return OrderStatus.PENDING;
    case 'Processing':
    case 'Cancel':
      return OrderStatus.CANCELLED; // Changed to CANCELLED
    case 'Completed':
      return OrderStatus.COMPLETED;
    case 'Failure':
      return OrderStatus.PENDING; // Mapping Failure to PENDING
    default:
      return OrderStatus.PENDING;
  }
}

function mapLicenseType(oldType: string): LicenseType {
  switch (oldType) {
    case 'single':
      return LicenseType.SINGLE;
    case 'multiple':
      return LicenseType.MULTIPLE;
    case 'corporate':
      return LicenseType.CORPORATE;
    default:
      return LicenseType.SINGLE;
  }
}

function mapYesNoToBoolean(value: string): boolean {
  return value === 'Yes';
}

async function migrateUsers(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Users...');
  const oldAdminUsers = await fetchOldData(oldDbConnection, 'tbl_admin');
  const oldRegularUsers = await fetchOldData(oldDbConnection, 'tbl_user');

  for (const oldUser of oldAdminUsers as any[]) {
    const existingUser = await prisma.user.findUnique({ where: { email: oldUser.email } });
    if (existingUser) {
      console.warn(`Skipping duplicate user email: ${oldUser.email} from tbl_admin.`);
      idMap[`admin-${oldUser.admin_id}`] = existingUser.id;
      continue;
    }

    const newUserId = cuid();
    idMap[`admin-${oldUser.admin_id}`] = newUserId;

    await prisma.user.create({
      data: {
        id: newUserId,
        email: oldUser.email,
        password: oldUser.password, // Changed from passwordHash
        firstName: oldUser.first_name,
        lastName: oldUser.last_name,
        status: mapUserStatus(oldUser.status),
      },
    });
  }

  for (const oldUser of oldRegularUsers as any[]) {
    const existingUser = await prisma.user.findUnique({ where: { email: oldUser.email } });
    if (existingUser) {
      console.warn(`Skipping duplicate user email: ${oldUser.email} from tbl_user.`);
      idMap[`user-${oldUser.user_id}`] = existingUser.id;
      continue;
    }

    const newUserId = cuid();
    idMap[`user-${oldUser.user_id}`] = newUserId;

    await prisma.user.create({
      data: {
        id: newUserId,
        email: oldUser.email,
        password: oldUser.password, // Changed from passwordHash
        firstName: oldUser.first_name,
        lastName: oldUser.last_name,
        phone: oldUser.phone,
        status: mapUserStatus(oldUser.status),
      },
    });
  }
  console.log('Users migration complete.');
}

async function migrateCategories(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Categories...');
  const oldCategories = await fetchOldData(oldDbConnection, 'tbl_category');

  for (const oldCategory of oldCategories as any[]) {
    const existingCategory = await prisma.category.findUnique({ where: { slug: oldCategory.slug } });
    if (existingCategory) {
      console.warn(`Skipping duplicate category slug: ${oldCategory.slug}.`);
      idMap[`category-${oldCategory.category_id}`] = existingCategory.id;
      continue;
    }

    const newCategoryId = cuid();
    idMap[`category-${oldCategory.category_id}`] = newCategoryId;

    await prisma.category.create({
      data: {
        id: newCategoryId,
        shortcode: oldCategory.shortcode,
        slug: oldCategory.slug,
        title: oldCategory.title, // Added title
        description: oldCategory.description, // Added description
        icon: oldCategory.icon,
        featured: mapYesNoToBoolean(oldCategory.featured),
        status: oldCategory.status === 'Active' ? ContentStatus.PUBLISHED : ContentStatus.DRAFT, // Changed to ContentStatus
        translations: {
          create: {
            locale: 'en', // Changed to lowercase
            slug: oldCategory.slug, // Added slug
            title: oldCategory.title, // Changed from name
            description: oldCategory.description,
            metaTitle: oldCategory.meta_title, // Changed from seoTitle
            metaDescription: oldCategory.meta_description, // Changed from seoDesc
          },
        },
      },
    });
  }
  console.log('Categories migration complete.');
}

async function migrateReports(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Reports...');
  const oldReports = await fetchOldData(oldDbConnection, 'tbl_report');

  for (const oldReport of oldReports as any[]) {
    const existingReport = await prisma.report.findUnique({ where: { slug: oldReport.slug } });
    if (existingReport) {
      console.warn(`Skipping duplicate report slug: ${oldReport.slug}.`);
      idMap[`report-${oldReport.report_id}`] = existingReport.id;
      continue;
    }

    const newReportId = cuid();
    idMap[`report-${oldReport.report_id}`] = newReportId;

    const newCategoryId = idMap[`category-${oldReport.category_id}`];
    if (!newCategoryId) {
      console.warn(`Skipping report with missing category mapping: ${oldReport.title} (Old Category ID: ${oldReport.category_id})`);
      continue;
    }

    // const newAdminId = idMap[`admin-${oldReport.admin_id}`]; // Removed as adminId is not in schema

    await prisma.report.create({
      data: {
        id: newReportId,
        categoryId: newCategoryId,
        sku: oldReport.sku,
        slug: oldReport.slug,
        title: oldReport.title, // Added title
        description: oldReport.description, // Added description
        summary: oldReport.description, // Added summary
        pages: oldReport.pages,
        publishedDate: oldReport.published_date ? new Date(oldReport.published_date) : new Date(),
        baseYear: oldReport.base_year,
        forecastPeriod: oldReport.forecast_period,
        tableOfContents: oldReport.toc, // Changed from tocHtml
        methodology: oldReport.tof, // Changed from tofHtml
        keyFindings: [], // Assuming this needs to be parsed from old data or left empty
        marketData: {}, // Assuming this needs to be parsed from old data or left empty
        keyPlayers: [], // Assuming this needs to be parsed from old data or left empty
        regions: [], // Assuming this needs to be parsed from old data or left empty
        industryTags: [], // Assuming this needs to be parsed from old data or left empty
        reportType: null, // Assuming this needs to be parsed from old data or left empty
        keywords: [], // Changed from keywordsJson
        metaTitle: oldReport.meta_title, // Changed from seoTitle
        metaDescription: oldReport.meta_description, // Changed from seoDesc
        singlePrice: oldReport.price, // Changed from price
        multiPrice: oldReport.mprice,
        corporatePrice: oldReport.cprice,
        status: oldReport.status === 'Active' ? ContentStatus.PUBLISHED : ContentStatus.DRAFT, // Changed to ContentStatus
        featured: mapYesNoToBoolean(oldReport.featured),
        priority: 0, // Assuming default value
        viewCount: 0, // Assuming default value
        downloadCount: 0, // Assuming default value
        avgRating: null, // Assuming default value
        reviewCount: 0, // Assuming default value
        createdAt: oldReport.created_at ? new Date(oldReport.created_at) : new Date(),
        updatedAt: oldReport.updated_at ? new Date(oldReport.updated_at) : new Date(),
        translations: {
          create: {
            locale: 'en', // Changed to lowercase
            title: oldReport.title,
            description: oldReport.description,
            summary: oldReport.description,
            slug: oldReport.slug,
            tableOfContents: oldReport.toc,
            methodology: oldReport.tof,
            keyFindings: [],
            metaTitle: oldReport.meta_title, // Changed from seoTitle
            metaDescription: oldReport.meta_description, // Changed from seoDesc
            keywords: [], // Changed from keywordsJson
          },
        },
      },
    });
  }
  console.log('Reports migration complete.');
}

async function migrateOrders(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Orders...');
  const oldOrders = await fetchOldData(oldDbConnection, 'tbl_order');

  for (const oldOrder of oldOrders as any[]) {
    const newOrderId = cuid();
    idMap[`order-${oldOrder.order_id}`] = newOrderId;

    await prisma.order.create({
      data: {
        id: newOrderId,
        userId: null, // Assuming no user mapping for now
        orderNumber: oldOrder.order_id.toString(), // Assuming order_id as orderNumber
        customerEmail: oldOrder.email,
        customerName: `${oldOrder.fname || ''} ${oldOrder.lname || ''}`.trim(),
        customerPhone: oldOrder.phone,
        subtotal: parseFloat(oldOrder.subtotal),
        discount: parseFloat(oldOrder.discount),
        total: parseFloat(oldOrder.total),
        currency: 'USD', // Assuming USD
        paymentMethod: oldOrder.payment_mode,
        paymentStatus: oldOrder.status,
        transactionId: oldOrder.txn_id,
        status: mapOrderStatus(oldOrder.status),
        createdAt: new Date(oldOrder.created_at),
        updatedAt: new Date(oldOrder.updated_at),
      },
    });
  }
  console.log('Orders migration complete.');
}

async function migrateOrderItems(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Order Items...');
  const oldOrderItems = await fetchOldData(oldDbConnection, 'tbl_order_item');

  for (const oldItem of oldOrderItems as any[]) {
    const newOrderItemId = cuid();
    const newOrderId = idMap[`order-${oldItem.order_id}`];
    const newReportId = idMap[`report-${oldItem.report_id}`];

    if (!newOrderId) {
      console.warn(`Skipping order item with missing order mapping: (Old Order ID: ${oldItem.order_id})`);
      continue;
    }
    if (!newReportId) {
      console.warn(`Skipping order item with missing report mapping: (Old Report ID: ${oldItem.report_id})`);
      continue;
    }

    await prisma.orderItem.create({
      data: {
        id: newOrderItemId,
        orderId: newOrderId,
        reportId: newReportId,
        licenseType: mapLicenseType(oldItem.license), // Changed from license
        price: parseFloat(oldItem.price),
        quantity: oldItem.quantity,
      },
    });
  }
  console.log('Order Items migration complete.');
}

async function migrateEnquiries(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Enquiries...');
  const oldEnquiries = await fetchOldData(oldDbConnection, 'tbl_enquiry');

  for (const oldEnquiry of oldEnquiries as any[]) {
    const newEnquiryId = cuid();
    const newReportId = oldEnquiry.report_id ? idMap[`report-${oldEnquiry.report_id}`] : null; // Report ID can be null

    await prisma.enquiry.create({
      data: {
        id: newEnquiryId,
        reportId: newReportId,
        firstName: oldEnquiry.fname,
        lastName: oldEnquiry.lname,
        email: oldEnquiry.email,
        phone: oldEnquiry.phone,
        company: oldEnquiry.company,
        country: oldEnquiry.country,
        message: oldEnquiry.comment,
        enquiryType: oldEnquiry.enquiry_type,
        status: mapEnquiryStatus(oldEnquiry.status),
        createdAt: new Date(oldEnquiry.created_at),
        updatedAt: new Date(oldEnquiry.updated_at),
      },
    });
  }
  console.log('Enquiries migration complete.');
}

async function migrateBlogs(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Blogs...');
  const oldBlogs = await fetchOldData(oldDbConnection, 'tbl_blog');

  for (const oldBlog of oldBlogs as any[]) {
    const newBlogId = cuid();
    const newCategoryId = oldBlog.category_id ? idMap[`category-${oldBlog.category_id}`] : null;

    await prisma.blog.create({
      data: {
        id: newBlogId,
        categoryId: newCategoryId,
        title: oldBlog.title,
        slug: oldBlog.slug,
        excerpt: oldBlog.description, // Changed from description
        content: oldBlog.content || '', // Assuming content exists
        tags: [], // Assuming tags need to be parsed or left empty
        metaTitle: oldBlog.meta_title, // Added metaTitle
        metaDescription: oldBlog.meta_description, // Added metaDescription
        status: oldBlog.status === 'Active' ? ContentStatus.PUBLISHED : ContentStatus.DRAFT, // Changed to ContentStatus
        featured: false, // Assuming default value
        viewCount: BigInt(0), // Assuming default value
        publishedAt: oldBlog.published_date ? new Date(oldBlog.published_date) : null,
        createdAt: oldBlog.created_at ? new Date(oldBlog.created_at) : new Date(),
        updatedAt: oldBlog.updated_at ? new Date(oldBlog.updated_at) : new Date(),
        translations: {
          create: {
            locale: 'en',
            title: oldBlog.title,
            slug: oldBlog.slug,
            excerpt: oldBlog.description,
            content: oldBlog.content || '',
            tags: [],
            metaTitle: oldBlog.meta_title,
            metaDescription: oldBlog.meta_description,
            status: oldBlog.status === 'Active' ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        },
      },
    });
  }
  console.log('Blogs migration complete.');
}

async function migrateJapaneseReports(oldDbConnection: mysql.Connection, prisma: PrismaClient, idMap: Record<string, string>) {
  console.log('Migrating Japanese Reports...');
  const oldJapaneseReports = await fetchOldData(oldDbConnection, 'tbl_report_jp');

  for (const oldJPReport of oldJapaneseReports as any[]) {
    const newReportId = idMap[`report-${oldJPReport.report_id}`];

    if (!newReportId) {
      console.warn(`Skipping Japanese report with missing English report mapping: (Old Report ID: ${oldJPReport.report_id})`);
      continue;
    }

    await prisma.reportTranslation.create({
      data: {
        reportId: newReportId,
        locale: 'ja', // Changed to lowercase
        title: oldJPReport.title || '',
        description: oldJPReport.description || '',
        summary: oldJPReport.description || '',
        slug: oldJPReport.slug || '',
        tableOfContents: oldJPReport.toc || '',
        methodology: oldJPReport.tof || '',
        keyFindings: [],
        metaTitle: oldJPReport.meta_title || '',
        metaDescription: oldJPReport.meta_description || '',
        keywords: [], // Changed from keywordsJson
        status: oldJPReport.status === 'Active' ? ContentStatus.PUBLISHED : ContentStatus.DRAFT, // Assuming ContentStatus
      },
    });
  }
  console.log('Japanese Reports migration complete.');
}
*/
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
