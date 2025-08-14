// scripts/migration/migrate_data.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient, UserStatus, EnquiryStatus, OrderStatus, LicenseType } from '@prisma/client';
import mysql from 'mysql2/promise';
import cuid from 'cuid';
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting data migration...');
        const oldDbConnection = yield mysql.createConnection({
            host: 'localhost',
            user: 'tbi_user',
            password: 'karta123',
            database: 'tbi_db',
        });
        console.log('Connected to old MySQL database.');
        const idMap = {};
        yield migrateUsers(oldDbConnection, prisma, idMap);
        yield migrateCategories(oldDbConnection, prisma, idMap);
        yield migrateReports(oldDbConnection, prisma, idMap);
        yield migrateOrders(oldDbConnection, prisma, idMap);
        yield migrateOrderItems(oldDbConnection, prisma, idMap);
        yield migrateFaqs(oldDbConnection, prisma, idMap);
        yield migrateEnquiries(oldDbConnection, prisma, idMap);
        yield migrateRequests(oldDbConnection, prisma, idMap);
        yield migrateBlogs(oldDbConnection, prisma, idMap);
        yield migratePresses(oldDbConnection, prisma, idMap);
        yield migrateCountries(oldDbConnection, prisma, idMap);
        yield migrateTestimonials(oldDbConnection, prisma, idMap);
        yield migrateUrls(oldDbConnection, prisma, idMap);
        yield migrateMedia(oldDbConnection, prisma, idMap);
        yield migrateJapaneseCategories(oldDbConnection, prisma, idMap);
        yield migrateJapaneseFaqs(oldDbConnection, prisma, idMap);
        yield migrateJapaneseReports(oldDbConnection, prisma, idMap);
        console.log('Data migration complete.');
        yield oldDbConnection.end();
        yield prisma.$disconnect();
    });
}
function fetchOldData(connection, tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield connection.execute(`SELECT * FROM ${tableName}`);
        return rows;
    });
}
function mapUserStatus(oldStatus) {
    switch (oldStatus) {
        case 'Active':
            return UserStatus.Active;
        case 'Inactive':
            return UserStatus.Inactive;
        case 'Pending':
            return UserStatus.Pending;
        default:
            return UserStatus.Inactive;
    }
}
function mapEnquiryStatus(oldStatus) {
    switch (oldStatus) {
        case 'Seen':
            return EnquiryStatus.Seen;
        case 'Unseen':
            return EnquiryStatus.Unseen;
        default:
            return EnquiryStatus.Unseen;
    }
}
function mapOrderStatus(oldStatus) {
    switch (oldStatus) {
        case 'Pending':
            return OrderStatus.Pending;
        case 'Processing':
            return OrderStatus.Processing;
        case 'Cancel':
            return OrderStatus.Cancel;
        case 'Completed':
            return OrderStatus.Completed;
        case 'Failure':
            return OrderStatus.Failure;
        default:
            return OrderStatus.Pending;
    }
}
function mapLicenseType(oldType) {
    switch (oldType) {
        case 'single':
            return LicenseType.single;
        case 'multiple':
            return LicenseType.multiple;
        case 'corporate':
            return LicenseType.corporate;
        default:
            return LicenseType.single;
    }
}
function mapYesNoToBoolean(value) {
    return value === 'Yes';
}
function migrateUsers(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Users...');
        const oldAdminUsers = yield fetchOldData(oldDbConnection, 'tbl_admin');
        const oldRegularUsers = yield fetchOldData(oldDbConnection, 'tbl_user');
        for (const oldUser of oldAdminUsers) {
            const existingUser = yield prisma.user.findUnique({ where: { email: oldUser.email } });
            if (existingUser) {
                console.warn(`Skipping duplicate user email: ${oldUser.email} from tbl_admin.`);
                idMap[`admin-${oldUser.admin_id}`] = existingUser.id;
                continue;
            }
            const newUserId = cuid();
            idMap[`admin-${oldUser.admin_id}`] = newUserId;
            yield prisma.user.create({
                data: {
                    id: newUserId,
                    email: oldUser.email,
                    passwordHash: oldUser.password,
                    name: `${oldUser.first_name || ''} ${oldUser.last_name || ''}`.trim(),
                    role: oldUser.role,
                    profileImage: oldUser.profile_image,
                    firstName: oldUser.first_name,
                    lastName: oldUser.last_name,
                    username: oldUser.username,
                    status: mapUserStatus(oldUser.status),
                },
            });
        }
        for (const oldUser of oldRegularUsers) {
            const existingUser = yield prisma.user.findUnique({ where: { email: oldUser.email } });
            if (existingUser) {
                console.warn(`Skipping duplicate user email: ${oldUser.email} from tbl_user.`);
                idMap[`user-${oldUser.user_id}`] = existingUser.id;
                continue;
            }
            const newUserId = cuid();
            idMap[`user-${oldUser.user_id}`] = newUserId;
            yield prisma.user.create({
                data: {
                    id: newUserId,
                    email: oldUser.email,
                    passwordHash: oldUser.password,
                    name: `${oldUser.first_name || ''} ${oldUser.last_name || ''}`.trim(),
                    role: 'user',
                    firstName: oldUser.first_name,
                    lastName: oldUser.last_name,
                    phone: oldUser.phone,
                    status: mapUserStatus(oldUser.status),
                },
            });
        }
        console.log('Users migration complete.');
    });
}
function migrateCategories(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Categories...');
        const oldCategories = yield fetchOldData(oldDbConnection, 'tbl_category');
        for (const oldCategory of oldCategories) {
            const existingCategory = yield prisma.category.findUnique({ where: { slug: oldCategory.slug } });
            if (existingCategory) {
                console.warn(`Skipping duplicate category slug: ${oldCategory.slug}.`);
                idMap[`category-${oldCategory.category_id}`] = existingCategory.id;
                continue;
            }
            const newCategoryId = cuid();
            idMap[`category-${oldCategory.category_id}`] = newCategoryId;
            yield prisma.category.create({
                data: {
                    id: newCategoryId,
                    shortcode: oldCategory.shortcode,
                    slug: oldCategory.slug,
                    icon: oldCategory.icon,
                    featured: mapYesNoToBoolean(oldCategory.featured),
                    status: oldCategory.status === 'Active' ? 'PUBLISHED' : 'DRAFT',
                    translations: {
                        create: {
                            locale: 'EN',
                            name: oldCategory.title,
                            description: oldCategory.description,
                            seoTitle: oldCategory.meta_title,
                            seoDesc: oldCategory.meta_description,
                        },
                    },
                },
            });
        }
        console.log('Categories migration complete.');
    });
}
function migrateReports(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Reports...');
        const oldReports = yield fetchOldData(oldDbConnection, 'tbl_report');
        for (const oldReport of oldReports) {
            const existingReport = yield prisma.report.findUnique({ where: { slug: oldReport.slug } });
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
            const newAdminId = idMap[`admin-${oldReport.admin_id}`];
            yield prisma.report.create({
                data: {
                    id: newReportId,
                    slug: oldReport.slug,
                    categoryId: newCategoryId,
                    status: oldReport.status === 'Active' ? 'PUBLISHED' : 'DRAFT',
                    publishedAt: oldReport.published_date ? new Date(oldReport.published_date) : null,
                    price: oldReport.price,
                    featured: mapYesNoToBoolean(oldReport.featured),
                    heroImage: oldReport.picture,
                    createdAt: oldReport.created_at ? new Date(oldReport.created_at) : new Date(),
                    updatedAt: oldReport.updated_at ? new Date(oldReport.updated_at) : new Date(),
                    adminId: newAdminId,
                    sku: oldReport.sku,
                    picture: oldReport.picture,
                    tocHtml: oldReport.toc,
                    tofHtml: oldReport.tof,
                    segmentation: oldReport.segmentation,
                    mprice: oldReport.mprice,
                    cprice: oldReport.cprice,
                    pages: oldReport.pages,
                    baseYear: oldReport.base_year,
                    historicalData: oldReport.historical_data,
                    reportLink: oldReport.report_link,
                    companies: oldReport.companies,
                    types: oldReport.types,
                    applications: oldReport.applications,
                    ratings: oldReport.ratings,
                    reviews: oldReport.reviews,
                    translations: {
                        create: {
                            locale: 'EN',
                            title: oldReport.title,
                            summary: oldReport.description,
                            seoTitle: oldReport.meta_title,
                            seoDesc: oldReport.meta_description,
                            keywordsJson: JSON.stringify({
                                keywords: oldReport.keywords,
                                meta_keyword: oldReport.meta_keyword
                            }),
                        },
                    },
                },
            });
        }
        console.log('Reports migration complete.');
    });
}
function migrateOrders(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Orders...');
        const oldOrders = yield fetchOldData(oldDbConnection, 'tbl_order');
        for (const oldOrder of oldOrders) {
            const newOrderId = cuid();
            idMap[`order-${oldOrder.order_id}`] = newOrderId;
            yield prisma.order.create({
                data: {
                    id: newOrderId,
                    ipAddress: oldOrder.ip_address,
                    subtotal: oldOrder.subtotal,
                    discount: oldOrder.discount,
                    total: oldOrder.total,
                    itemCount: oldOrder.items,
                    orderDate: new Date(oldOrder.order_date),
                    paymentMode: oldOrder.payment_mode,
                    transactionId: oldOrder.txn_id,
                    payerId: oldOrder.payer_id,
                    firstName: oldOrder.fname,
                    lastName: oldOrder.lname,
                    email: oldOrder.email,
                    phone: oldOrder.phone,
                    country: oldOrder.country,
                    state: oldOrder.state,
                    city: oldOrder.city,
                    zipCode: oldOrder.zipcode,
                    address: oldOrder.address,
                    paymentDate: oldOrder.payment_date ? new Date(oldOrder.payment_date) : null,
                    errorMessage: oldOrder.error,
                    status: mapOrderStatus(oldOrder.status),
                    createdAt: new Date(oldOrder.created_at),
                    updatedAt: new Date(oldOrder.updated_at),
                },
            });
        }
        console.log('Orders migration complete.');
    });
}
function migrateOrderItems(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Order Items...');
        const oldOrderItems = yield fetchOldData(oldDbConnection, 'tbl_order_item');
        for (const oldItem of oldOrderItems) {
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
            yield prisma.orderItem.create({
                data: {
                    id: newOrderItemId,
                    orderId: newOrderId,
                    reportId: newReportId,
                    license: mapLicenseType(oldItem.license),
                    price: oldItem.price,
                    quantity: oldItem.quantity,
                },
            });
        }
        console.log('Order Items migration complete.');
    });
}
function migrateFaqs(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating FAQs...');
        const oldFaqs = yield fetchOldData(oldDbConnection, 'tbl_faq');
        for (const oldFaq of oldFaqs) {
            const newFaqId = cuid();
            const newReportId = idMap[`report-${oldFaq.report_id}`];
            if (!newReportId) {
                console.warn(`Skipping FAQ with missing report mapping: (Old Report ID: ${oldFaq.report_id})`);
                continue;
            }
            yield prisma.fAQ.create({
                data: {
                    id: newFaqId,
                    reportId: newReportId,
                    createdAt: oldFaq.created_at ? new Date(oldFaq.created_at) : new Date(),
                    updatedAt: oldFaq.updated_at ? new Date(oldFaq.updated_at) : new Date(),
                    translations: {
                        create: {
                            locale: 'EN',
                            question: oldFaq.question,
                            answer: oldFaq.answer,
                        },
                    },
                },
            });
        }
        console.log('FAQs migration complete.');
    });
}
function migrateEnquiries(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Enquiries...');
        const oldEnquiries = yield fetchOldData(oldDbConnection, 'tbl_enquiry');
        for (const oldEnquiry of oldEnquiries) {
            const newEnquiryId = cuid();
            const newReportId = idMap[`report-${oldEnquiry.report_id}`];
            if (!newReportId) {
                console.warn(`Skipping enquiry with missing report mapping: (Old Report ID: ${oldEnquiry.report_id})`);
                continue;
            }
            yield prisma.lead.create({
                data: {
                    id: newEnquiryId,
                    reportId: newReportId,
                    name: oldEnquiry.fname,
                    email: oldEnquiry.email,
                    phone: oldEnquiry.phone,
                    jobTitle: oldEnquiry.job_title,
                    company: oldEnquiry.company,
                    message: oldEnquiry.comment,
                    status: mapEnquiryStatus(oldEnquiry.status),
                    locale: 'EN', // Assuming English for now
                    createdAt: new Date(oldEnquiry.created_at),
                    updatedAt: new Date(oldEnquiry.updated_at),
                },
            });
        }
        console.log('Enquiries migration complete.');
    });
}
function migrateRequests(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Requests...');
        const oldRequests = yield fetchOldData(oldDbConnection, 'tbl_request');
        for (const oldRequest of oldRequests) {
            const newRequestId = cuid();
            const newReportId = idMap[`report-${oldRequest.report_id}`];
            if (!newReportId) {
                console.warn(`Skipping request with missing report mapping: (Old Report ID: ${oldRequest.report_id})`);
                continue;
            }
            yield prisma.request.create({
                data: {
                    id: newRequestId,
                    reportId: newReportId,
                    fullName: oldRequest.full_name,
                    email: oldRequest.email,
                    phone: oldRequest.phone,
                    designation: oldRequest.designation,
                    company: oldRequest.company,
                    comment: oldRequest.comment,
                    publisher: oldRequest.publisher,
                    type: oldRequest.type,
                    country: oldRequest.country,
                    region: oldRequest.region,
                    phoneCode: oldRequest.phonecode,
                    shortName: oldRequest.shortname,
                    status: mapEnquiryStatus(oldRequest.status), // Reusing EnquiryStatus enum
                    isProcessed: mapYesNoToBoolean(oldRequest.processed),
                    createdAt: new Date(oldRequest.created_at),
                    updatedAt: new Date(oldRequest.updated_at),
                },
            });
        }
        console.log('Requests migration complete.');
    });
}
function migrateBlogs(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Blogs...');
        const oldBlogs = yield fetchOldData(oldDbConnection, 'tbl_blog');
        for (const oldBlog of oldBlogs) {
            const newBlogId = cuid();
            const newCategoryId = idMap[`category-${oldBlog.category_id}`];
            yield prisma.blog.create({
                data: {
                    id: newBlogId,
                    categoryId: newCategoryId || null, // Can be null
                    title: oldBlog.title,
                    slug: oldBlog.slug,
                    publishedAt: oldBlog.published_date ? new Date(oldBlog.published_date) : null,
                    description: oldBlog.description,
                    seoTitle: oldBlog.meta_title,
                    seoKeywords: oldBlog.meta_keyword,
                    seoDescription: oldBlog.meta_description,
                    status: mapUserStatus(oldBlog.status), // Reusing UserStatus enum
                    createdAt: oldBlog.created_at ? new Date(oldBlog.created_at) : new Date(),
                    updatedAt: oldBlog.updated_at ? new Date(oldBlog.updated_at) : new Date(),
                },
            });
        }
        console.log('Blogs migration complete.');
    });
}
function migratePresses(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Presses...');
        const oldPresses = yield fetchOldData(oldDbConnection, 'tbl_press');
        for (const oldPress of oldPresses) {
            const existingPress = yield prisma.press.findUnique({ where: { slug: oldPress.slug } });
            if (existingPress) {
                console.warn(`Skipping duplicate press slug: ${oldPress.slug}.`);
                idMap[`press-${oldPress.press_id}`] = existingPress.id;
                continue;
            }
            const newPressId = cuid();
            const newCategoryId = idMap[`category-${oldPress.category_id}`];
            yield prisma.press.create({
                data: {
                    id: newPressId,
                    categoryId: newCategoryId || null, // Can be null
                    title: oldPress.title,
                    slug: oldPress.slug,
                    description: oldPress.description,
                    publishedAt: oldPress.published_date ? new Date(oldPress.published_date) : null,
                    seoTitle: oldPress.meta_title,
                    seoKeywords: oldPress.meta_keyword,
                    seoDescription: oldPress.meta_description,
                    status: mapUserStatus(oldPress.status), // Reusing UserStatus enum
                    createdAt: oldPress.created_at ? new Date(oldPress.created_at) : new Date(),
                    updatedAt: oldPress.updated_at ? new Date(oldPress.updated_at) : new Date(),
                },
            });
        }
        console.log('Presses migration complete.');
    });
}
function migrateCountries(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Countries...');
        const oldCountries = yield fetchOldData(oldDbConnection, 'tbl_country');
        for (const oldCountry of oldCountries) {
            const existingCountry = yield prisma.country.findUnique({ where: { shortname: oldCountry.shortname } });
            if (existingCountry) {
                console.warn(`Skipping duplicate country shortname: ${oldCountry.shortname}.`);
                idMap[`country-${oldCountry.country_id}`] = existingCountry.id;
                continue;
            }
            const newCountryId = cuid();
            yield prisma.country.create({
                data: {
                    id: newCountryId,
                    region: oldCountry.region,
                    name: oldCountry.name,
                    shortname: oldCountry.shortname,
                    phonecode: oldCountry.phonecode,
                },
            });
        }
        console.log('Countries migration complete.');
    });
}
function migrateTestimonials(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Testimonials...');
        const oldTestimonials = yield fetchOldData(oldDbConnection, 'tbl_testimonial');
        for (const oldTestimonial of oldTestimonials) {
            const newTestimonialId = cuid();
            yield prisma.testimonial.create({
                data: {
                    id: newTestimonialId,
                    content: oldTestimonial.content,
                    name: oldTestimonial.name,
                    logo: oldTestimonial.logo,
                    place: oldTestimonial.place,
                    status: mapUserStatus(oldTestimonial.status), // Reusing UserStatus enum
                    createdAt: oldTestimonial.created_at ? new Date(oldTestimonial.created_at) : new Date(),
                    updatedAt: oldTestimonial.updated_at ? new Date(oldTestimonial.updated_at) : new Date(),
                },
            });
        }
        console.log('Testimonials migration complete.');
    });
}
function migrateUrls(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating URLs...');
        const oldUrls = yield fetchOldData(oldDbConnection, 'tbl_url');
        for (const oldUrl of oldUrls) {
            const existingUrl = yield prisma.redirectMap.findUnique({ where: { oldPath_locale: { oldPath: oldUrl.source_url, locale: 'EN' } } });
            if (existingUrl) {
                console.warn(`Skipping duplicate URL redirect: ${oldUrl.source_url}.`);
                idMap[`url-${oldUrl.url_id}`] = existingUrl.id;
                continue;
            }
            const newUrlId = cuid();
            yield prisma.redirectMap.create({
                data: {
                    id: newUrlId,
                    oldPath: oldUrl.source_url,
                    newPath: oldUrl.target_url,
                    httpStatus: 301, // Assuming permanent redirect
                    locale: 'EN', // Assuming English for now
                },
            });
        }
        console.log('URLs migration complete.');
    });
}
function migrateMedia(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Media...');
        const oldMedia = yield fetchOldData(oldDbConnection, 'tbl_media');
        for (const oldMedium of oldMedia) {
            const newMediaId = cuid();
            const newCategoryId = idMap[`category-${oldMedium.category_id}`];
            yield prisma.media.create({
                data: {
                    id: newMediaId,
                    categoryId: newCategoryId || null, // Can be null
                    title: oldMedium.title,
                    link: oldMedium.link,
                    description: oldMedium.description,
                    publishedAt: oldMedium.published_date ? new Date(oldMedium.published_date) : null,
                    seoTitle: oldMedium.meta_title,
                    seoKeywords: oldMedium.meta_keyword,
                    seoDescription: oldMedium.meta_description,
                    status: mapUserStatus(oldMedium.status), // Reusing UserStatus enum
                    createdAt: oldMedium.created_at ? new Date(oldMedium.created_at) : new Date(),
                    updatedAt: oldMedium.updated_at ? new Date(oldMedium.updated_at) : new Date(),
                },
            });
        }
        console.log('Media migration complete.');
    });
}
function migrateJapaneseCategories(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Japanese Categories...');
        const oldJapaneseCategories = yield fetchOldData(oldDbConnection, 'tbl_category_jp');
        for (const oldJPCategory of oldJapaneseCategories) {
            const newCategoryId = idMap[`category-${oldJPCategory.category_id}`];
            if (!newCategoryId) {
                console.warn(`Skipping Japanese category with missing English category mapping: (Old Category ID: ${oldJPCategory.category_id})`);
                continue;
            }
            yield prisma.categoryTranslation.create({
                data: {
                    categoryId: newCategoryId,
                    locale: 'JA',
                    name: oldJPCategory.title,
                    description: oldJPCategory.description,
                    seoTitle: oldJPCategory.meta_title,
                    seoDesc: oldJPCategory.meta_description,
                },
            });
        }
        console.log('Japanese Categories migration complete.');
    });
}
function migrateJapaneseFaqs(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Japanese FAQs...');
        const oldJapaneseFaqs = yield fetchOldData(oldDbConnection, 'tbl_faq_jp');
        for (const oldJPFaq of oldJapaneseFaqs) {
            const newFaqId = idMap[`faq-${oldJPFaq.faq_id}`];
            if (!newFaqId) {
                console.warn(`Skipping Japanese FAQ with missing English FAQ mapping: (Old FAQ ID: ${oldJPFaq.faq_id})`);
                continue;
            }
            yield prisma.fAQTranslation.create({
                data: {
                    faqId: newFaqId,
                    locale: 'JA',
                    question: oldJPFaq.question,
                    answer: oldJPFaq.answer,
                },
            });
        }
        console.log('Japanese FAQs migration complete.');
    });
}
function migrateJapaneseReports(oldDbConnection, prisma, idMap) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Migrating Japanese Reports...');
        const oldJapaneseReports = yield fetchOldData(oldDbConnection, 'tbl_report_jp');
        for (const oldJPReport of oldJapaneseReports) {
            const newReportId = idMap[`report-${oldJPReport.report_id}`];
            if (!newReportId) {
                console.warn(`Skipping Japanese report with missing English report mapping: (Old Report ID: ${oldJPReport.report_id})`);
                continue;
            }
            yield prisma.reportTranslation.create({
                data: {
                    reportId: newReportId,
                    locale: 'JA',
                    title: oldJPReport.title,
                    summary: oldJPReport.description,
                    seoTitle: oldJPReport.meta_title,
                    seoDesc: oldJPReport.meta_description,
                    keywordsJson: JSON.stringify({
                        keywords: oldJPReport.keywords,
                        meta_keyword: oldJPReport.meta_keyword
                    }),
                },
            });
        }
        console.log('Japanese Reports migration complete.');
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
