// import { getRequestConfig } from 'next-intl/server';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Statically import all message files
// import deMessages from '../../messages/de.json';
// import enMessages from '../../messages/en.json';
// import esMessages from '../../messages/es.json';
// import frMessages from '../../messages/fr.json';
// import itMessages from '../../messages/it.json';
// import jaMessages from '../../messages/ja.json';
// import koMessages from '../../messages/ko.json';

// const allMessages = {
//   de: deMessages,
//   en: enMessages,
//   es: esMessages,
//   fr: frMessages,
//   it: itMessages,
//   ja: jaMessages,
//   ko: koMessages,
// };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default getRequestConfig(async ({ locale }) => ({
//   messages: allMessages[locale as keyof typeof allMessages]
// }));