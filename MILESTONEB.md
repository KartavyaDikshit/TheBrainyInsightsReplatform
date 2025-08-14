## FRONTEND COMPONENTS AND PAGES

### Page Routing Structure and Dynamic Routes
The project utilizes Next.js App Router, indicated by the `app` directory structure. The routing is internationalized, with the locale being part of the URL (e.g., `/en/about`). Dynamic routes are extensively used for content pages.

- **`src/app/[locale]/page.tsx`**: Home page for each locale.
- **`src/app/[locale]/about/page.tsx`**: About Us page.
- **`src/app/[locale]/auth/signin/page.tsx`**: Custom sign-in page.
- **`src/app/[locale]/categories/[slug]/page.tsx`**: Dynamic page for individual category listings.
- **`src/app/[locale]/contact/page.tsx`**: Contact Us page.
- **`src/app/[locale]/reports/page.tsx`**: Listing page for all reports.
- **`src/app/[locale]/reports/[slug]/page.tsx`**: Dynamic page for individual report details.
- **`src/app/[locale]/search/page.tsx`**: Search results page.
- **`src/app/[locale]/services/page.tsx`**: Services page.
- **`src/app/admin/page.tsx`**: Admin dashboard.
- **`src/app/admin/leads/page.tsx`**: Admin page for managing leads.
- **`src/app/admin/redirects/page.tsx`**: Admin page for managing URL redirects.
- **`src/app/admin/reports/page.tsx`**: Admin page for managing reports.
- **`src/app/admin/staging/page.tsx`**: Admin page for managing staged content (e.g., AI-generated).
- **`src/app/admin/users/create/page.tsx`**: Admin page for creating new users.
- **`src/app/temp-not-found.tsx`**: A temporary 404 page.

### Component Hierarchy and Prop Interfaces
- **Layouts (`layout.tsx`)**: Define shared UI for routes within a segment, wrapping child pages and components. Examples include the root layout for each locale and the protected admin layout.
- **Server Components**: Many pages and layouts are implemented as Server Components, enabling direct data fetching from the database or APIs.
- **Client Components**: Reusable UI components from `packages/ui/src` are typically Client Components, handling user interactions and managing local state.
- **Data Flow**: Data is primarily passed from Server Components (or API routes) to Client Components via props. State management within Client Components likely uses React hooks (`useState`, `useReducer`).

### Detailed React Component Documentation

#### `Button.tsx`

*   **Purpose**: A simple, reusable button component.
*   **Props**: It accepts all standard HTML button attributes (`React.ButtonHTMLAttributes<HTMLButtonElement>`). This makes it highly flexible.
*   **State**: This component is stateless.
*   **Functionality**: It renders a standard HTML `<button>` element and passes all the received props to it. This is a great example of a simple, reusable "dumb" component.
*   **Example Usage**:
    ```tsx
    import Button from '@/components/Button';

    const MyComponent = () => (
      <Button onClick={() => alert('Clicked!')} className="bg-blue-500 text-white p-2">
        Click Me
      </Button>
    );
    ```

#### `ReportCard.tsx`

*   **Purpose**: To display a summary of a single report and link to the full report page.
*   **Props**:
    *   `report`: A `TransformedReport` object containing the report's data (slug, title, summary, etc.).
    *   `locale`: The current locale (e.g., "en"), used to construct the correct link.
*   **State**: This component is stateless.
*   **Functionality**:
    *   It renders a Next.js `<Link>` component that wraps the entire card, making it clickable.
    *   The link's `href` is dynamically constructed based on the `locale` and the report's `slug`.
    *   It displays the report's title and summary.
*   **Example Usage**:
    ```tsx
    import ReportCard from '@/components/ReportCard';
    import { TransformedReport } from '@/lib/data/adapter';

    const MyComponent = () => {
      const report: TransformedReport = {
        id: '1',
        slug: 'my-report',
        title: 'My Report',
        summary: 'This is a summary of my report.',
        // ... other properties
      };

      return <ReportCard report={report} locale="en" />;
    };
    ```

#### `SearchBar.tsx`

*   **Purpose**: To provide a search input field and a button to submit a search query.
*   **Props**:
    *   `initialQuery`: An optional string to pre-fill the search input. Defaults to an empty string.
*   **State**:
    *   `query`: A string that holds the current value of the search input. It's initialized with the `initialQuery` prop.
*   **Functionality**:
    *   It's a client component (`'use client'`).
    *   It uses the `useRouter` hook from `next/navigation` to programmatically navigate to the search results page.
    *   The `handleSubmit` function is called when the form is submitted. It prevents the default form submission and uses `router.push` to navigate to `/search?q=<query>`.
    *   The input field is a controlled component, with its `value` tied to the `query` state and its `onChange` handler updating the state.

### State Management and Data Flow
- **Server-Side Data Fetching**: Data for pages is primarily fetched on the server using `async` components and direct database/API calls within Server Components.
- **Client-Side Data Fetching**: For interactive components or dynamic content, client-side data fetching might be employed using libraries like SWR or React Query, though not explicitly identified in the core structure.
- **Form Handling and Validation**: Forms are handled within individual components. Validation is likely performed both on the client-side (for immediate feedback) and server-side (for data integrity and security).

### UI/UX Patterns and Styling Approach
- **Component-Based UI**: The project adopts a component-based UI development approach, leveraging a shared component library in `packages/ui`.
- **Styling**: While not explicitly defined by a specific CSS framework in the analyzed files, the modular component structure suggests a modern styling approach, potentially using CSS Modules, Tailwind CSS, or a similar utility-first framework.

## API ROUTES AND ENDPOINTS

### Detailed API Route Documentation

#### `src/app/api/contact/route.ts`

*   **Method**: `POST`
*   **Purpose**: To handle contact form submissions.
*   **Request Body Schema**:
    ```json
    {
      "name": "string",
      "email": "string",
      "message": "string"
    }
    ```
*   **Response Schema**:
    *   **Success (200)**:
        ```json
        {
          "message": "Message received"
        }
        ```
    *   **Error (400)**:
        ```json
        {
          "error": "Name, email, and message are required"
        }
        ```
    *   **Error (500)**:
        ```json
        {
          "error": "Failed to send message"
        }
        ```
*   **Authentication**: Not required.
*   **Rate Limiting**: Not implemented.

#### `src/app/api/search/route.ts`

*   **Method**: `GET`
*   **Purpose**: To search for reports based on a query.
*   **Query Parameters**:
    *   `q`: The search query (string).
*   **Response Schema**:
    *   **Success (200)**:
        ```json
        [
          {
            "id": "string",
            "slug": "string",
            "title": "string",
            "summary": "string"
          }
        ]
        ```
    *   **Error (400)**:
        ```json
        {
          "error": "Query parameter 'q' is required"
        }
        ```
    *   **Error (500)**:
        ```json
        {
          "error": "Failed to fetch search results"
        }
        ```
*   **Authentication**: Not required.
*   **Rate Limiting**: Not implemented.

#### `src/app/api/ai/generate/route.ts`

*   **Method**: `POST`
*   **Purpose**: To generate a market research report using the OpenAI API.
*   **Request Body Schema**:
    ```json
    {
      "topic": "string",
      "locale": "string"
    }
    ```
*   **Response Schema**:
    *   **Success (200)**:
        ```json
        {
          "message": "AI content generated and queued for review",
          "content": "string",
          "queueId": "string"
        }
        ```
    *   **Error (400)**:
        ```json
        {
          "error": "Topic and locale are required"
        }
        ```
    *   **Error (401)**:
        ```json
        {
          "error": "Unauthorized"
        }
        ```
    *   **Error (500)**:
        ```json
        {
          "error": "Failed to generate AI content"
        }
        ```
*   **Authentication**: Required. The user must have the `Admin` role.
*   **Rate Limiting**: Not implemented.

## BUILD AND DEPLOYMENT TROUBLESHOOTING

### Identify all potential build blockers
- **TypeScript Errors**: The most critical build blocker is the TypeScript error in `src/app/api/ai/generate/route.ts`.
- **Environment Variables**: Missing or incorrect environment variables can cause build failures or runtime errors. The build process relies on variables defined in `.env.production`.
- **Missing Dependencies**: Although `pnpm` is used, inconsistencies in `package.json` or the lock file could lead to missing dependencies.
- **Prisma Client Generation**: The `prebuild` script in `package.json` runs `prisma generate`, which is crucial. If this step fails, the database adapter will not be available.

### Environment variable validation
The project uses `.env.local.example` as a template for environment variables. It is crucial to have a correctly configured `.env.production` file for production builds and a `.env.local` for development.

**`.env.local.example`**:
```
# See .env.example for a comprehensive list of variables.
# Required for database connection
DATABASE_URL="postgresql://user:password@host:port/database"

# Required for NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Optional: Add other environment-specific variables here
OPENAI_API_KEY="your-openai-api-key"
```

### Missing dependencies or configuration issues
- The `pnpm-lock.yaml` file should be consistent with `package.json`. Running `pnpm install` should resolve any discrepancies.
- The `tsconfig.json` files in the root and within packages (`packages/lib`, `packages/database`) must be correctly configured to ensure proper module resolution and type checking.

### TypeScript strict mode compliance
The project has `strict: true` in its root `tsconfig.json`. This is a best practice, but it means that all code must be strictly typed, which can be a source of build errors if not adhered to.

### Production build optimization issues
Next.js performs optimizations during the production build (`next build`). These can sometimes fail due to code that works in development but has issues with server-side rendering or static generation.

## SECURITY IMPLEMENTATION

### Authentication security measures
- **NextAuth.js**: The use of NextAuth.js provides a robust and secure authentication foundation.
- **Credentials Provider**: The primary authentication method is the Credentials provider, which requires careful implementation to prevent vulnerabilities.
- **Password Hashing**: It is assumed that passwords are being hashed before being stored in the database, although this is not explicitly shown in the provided code.

### CORS configuration
CORS is not explicitly configured in the provided files. Next.js has built-in CORS support for API routes, but it may need to be configured in `next.config.js` if the API is accessed from different domains.

### Input validation and sanitization
- **API Routes**: All API routes should validate and sanitize user input to prevent malicious data from being processed or stored.
- **Search**: The search functionality should be protected against injection attacks.

### SQL injection prevention
- **Prisma**: The use of Prisma as the ORM helps prevent SQL injection vulnerabilities, as it generates parameterized queries.

### XSS protection mechanisms
- **React**: React's JSX syntax automatically escapes content, which helps prevent XSS attacks.
- **JSON-LD**: When using `JsonLd` components, ensure that the data is from a trusted source to prevent script injection.

## DEVELOPMENT WORKFLOW

### Local development setup instructions
1.  Clone the repository.
2.  Create a `.env.local` file from `.env.local.example` and provide the necessary environment variables.
3.  Install dependencies: `pnpm install`
4.  Generate Prisma client: `pnpm prisma generate`
5.  Run database migrations: `pnpm prisma migrate dev`
6.  Start the development server: `pnpm dev`

### Testing implementation and coverage
There are no dedicated testing files (`*.test.ts` or `*.spec.ts`) visible in the file structure. This is a significant gap in the development workflow.

### Code quality and linting rules
- **ESLint**: The project uses ESLint for code quality, with the configuration in `eslint.config.js`.
- **`.eslintignore`**: This file is used to exclude certain files and directories from linting.

### Git hooks and pre-commit checks
There is no evidence of Git hooks (e.g., Husky) or pre-commit checks in the provided file structure.

### Debugging configuration
There is no specific debugging configuration (e.g., `launch.json` for VS Code) in the project.

## ERROR RESOLUTION RECOMMENDATIONS

### Step-by-step fixes for current build errors
**Error in `src/app/api/ai/generate/route.ts`**:
The error is a malformed template string.

**Before**:
```typescript
// src/app/api/ai/generate/route.ts:40-46
const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Generate a report based on the following topic: ${topic}` },
    ],
});
```

**After**:
```typescript
// src/app/api/ai/generate/route.ts:40-46
const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Generate a report based on the following topic: ${topic}` },
    ],
});
```
The original code was missing the closing parenthesis and curly brace for the `create` method call.

### Best practices for avoiding similar issues
- **Use a Code Formatter**: Tools like Prettier can automatically format code and prevent syntax errors.
- **IDE Integration**: Configure your IDE to show TypeScript and ESLint errors in real-time.
- **Incremental Commits**: Make small, incremental commits to easily identify the source of new errors.

### Code refactoring suggestions
- **Centralized API Logic**: Consider creating a dedicated service or utility for interacting with the OpenAI API to avoid code duplication.
- **Error Handling**: Implement more robust error handling in API routes to provide meaningful error messages to the client.

### Performance optimization recommendations
- **Code Splitting**: Next.js automatically performs code splitting, but you can further optimize it by using dynamic imports for large components.
- **Image Optimization**: Use the Next.js `Image` component to automatically optimize images.
- **Caching**: Implement caching strategies for frequently accessed data, both on the server and client-side.