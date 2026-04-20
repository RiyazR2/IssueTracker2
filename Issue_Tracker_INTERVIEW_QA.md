# 🎯 Issue Tracker – Interview Q&A (2 Years React Experience)

> All questions and answers are based on YOUR actual project code.
> Be confident — you built this!

---

## 📌 SECTION 1: PROJECT OVERVIEW

---

### Q1. Can you give me a brief overview of your Issue Tracker project?

**Answer:**
The Issue Tracker is a full-stack web application built with **Next.js 13 (App Router)**, **React**, and **TypeScript**.
It allows teams to create, view, edit, delete, and assign issues. Key features include:
- **Dashboard** with a bar chart and issue summary (Open / In-Progress / Closed counts)
- **Issue list** with filtering by status, column sorting, and pagination
- **Create & Edit** issues using a Markdown editor (SimpleMDE)
- **Issue detail page** that renders Markdown and shows status badge
- **Assign issues** to users via a dropdown
- **Google OAuth authentication** via NextAuth.js
- **Route protection** with Next.js middleware
- **Error monitoring** with Sentry

**Tech Stack:**
- Frontend: React 18, Next.js 13, TypeScript, Tailwind CSS, Radix UI
- State/Data: TanStack React Query, Axios
- Forms/Validation: React Hook Form + Zod
- Database: PostgreSQL + Prisma ORM
- Auth: NextAuth.js (Google Provider)
- Monitoring: Sentry

---

### Q2. Why did you choose Next.js 13 App Router over the Pages Router?

**Answer:**
Next.js 13 App Router gives us **React Server Components by default**, which means:
- Data fetching happens on the server — no extra API calls for page data
- Better SEO because HTML is pre-rendered
- Automatic code splitting and layouts

For example, in my `IssuesPage` (`/issues/list/page.tsx`), I directly call `prisma.issue.findMany()` inside the server component — no useEffect, no loading state, no API route needed for that page.

The Pages Router would have required `getServerSideProps` or `getStaticProps` for the same behavior. App Router makes it cleaner and more collocated.

---

### Q3. What is the folder structure of your project and why did you organize it that way?

**Answer:**
```
app/
├── api/              → API routes (POST/PATCH/DELETE for issues, GET users)
├── auth/             → NextAuth options and session provider
├── components/       → Shared reusable components (Badge, Pagination, Skeleton, etc.)
├── issues/
│   ├── [id]/         → Dynamic route: view issue detail, assign, delete
│   ├── _components/  → Private components (IssueForm, IssueFormSkeleton)
│   ├── list/         → Issue list page with filter, sort, pagination
│   ├── new/          → Create new issue page
│   └── edit/[id]/    → Edit existing issue
├── page.tsx          → Dashboard (home)
├── layout.tsx        → Root layout with NavBar, Auth, QueryClient providers
prisma/
├── schema.prisma     → Database models
├── client.ts         → Prisma singleton
```

The `_components` folder (underscore prefix) is a Next.js convention to keep components **private to a route segment** — they don't become routes themselves.

---

## 📌 SECTION 2: REACT & COMPONENT DESIGN

---

### Q4. What is the difference between Server Components and Client Components in your project? Give real examples.

**Answer:**
- **Server Components** run only on the server. They can directly access the database.
- **Client Components** run in the browser. They need the `"use client"` directive.

**Server Component examples in my project:**
- `app/issues/list/page.tsx` — fetches issues directly from Prisma
- `app/LatestIssues.tsx` — fetches 5 latest issues with `prisma.issue.findMany()`
- `app/page.tsx` — fetches issue counts per status

**Client Component examples:**
- `app/NavBar.tsx` — uses `usePathname()`, `useSession()` hooks
- `app/issues/_components/IssueForm.tsx` — uses `useState`, `useForm`, `useRouter`
- `app/issues/[id]/AssigneeSelect.tsx` — uses TanStack React Query's `useQuery`
- `app/components/Pagination.tsx` — uses `useRouter`, `useSearchParams`

The rule of thumb: if a component needs browser APIs, hooks, or event handlers → `"use client"`.

---

### Q5. How does the IssueForm component work? Walk me through it.

**Answer:**
`IssueForm` is a **client component** (`"use client"`) that handles both creating and editing an issue. It accepts an optional `issue` prop of type `Issue` from Prisma.

```tsx
const IssueForm = ({ issue }: { issue?: Issue }) => { ... }
```

**Key parts:**

1. **React Hook Form** — manages form state with `useForm<IssueFormData>`
2. **Zod validation** — `zodResolver(issueSchema)` connects Zod schema to the form
3. **Controller** — used for `SimpleMDE` (rich text editor) because it's an uncontrolled component
4. **axios.patch vs axios.post** — if `issue` prop exists → PATCH (edit), else → POST (create)
5. **isSubmitting state** — disables the button and shows a Spinner during API call
6. **error state** — shows a red Callout if the API fails

After successful submit, it uses `router.push("/issues/list")` and `router.refresh()` to reload server data.

---

### Q6. Why did you use `Controller` from React Hook Form for the markdown editor?

**Answer:**
React Hook Form's `register()` works with native HTML inputs (input, textarea, select) by attaching refs. But `SimpleMDE` (the markdown editor) is a **controlled third-party component** — it manages its own state internally and doesn't expose a native input ref.

So I used `Controller` which wraps the component and passes `value` and `onChange` through the `field` object:

```tsx
<Controller
  name="description"
  control={control}
  defaultValue={issue?.description}
  render={({ field }) => (
    <SimpleMDE placeholder="Description" {...field} />
  )}
/>
```

`Controller` acts as a bridge between React Hook Form's state management and any custom/third-party component.

---

### Q7. How does your Pagination component work?

**Answer:**
`Pagination` is a client component that receives `itemCount`, `pageSize`, and `currentPage` as props.

- It calculates `pageCount = Math.ceil(itemCount / pageSize)`
- If only 1 page, it returns `null` (nothing rendered)
- `changePage(page)` function reads current URL search params, updates the `page` param, and calls `router.push()` — this preserves existing filters like `status` and `orderBy`

```tsx
const changePage = (page: number) => {
  const params = new URLSearchParams(searchParams);
  params.set("page", page.toString());
  router.push('?' + params.toString());
};
```

It has 4 buttons: First page, Previous, Next, Last page — all with disabled states.

The list page uses `pageSize = 10` and does:
```tsx
skip: (page - 1) * pageSize,
take: pageSize,
```
in the Prisma query.

---

### Q8. How does filtering and sorting work in the issues list?

**Answer:**
Everything is driven by **URL search params** — no separate state.

**Filtering by status:**
- `IssueStatusFilter` reads `searchParams.get("status")` and pushes new query string on change
- The server component `IssuesPage` reads `searchParams.status`, validates it against the Prisma `Status` enum, and passes it to `prisma.issue.findMany({ where: { status } })`

**Sorting:**
- `IssueTable` renders column headers as `<NextLink>` with `orderBy` and `orderDirection` in the query
- Clicking a column header toggles direction: `asc → desc → asc`
- An arrow icon (`ArrowUpIcon` / `ArrowDownIcon`) shows current sort direction
- Server component validates `orderBy` against `columnNames` array (type-safe list of column keys)

**Combined:** All three params (`status`, `orderBy`, `orderDirection`, `page`) live in the URL together, so the page is fully shareable and bookmarkable.

---

### Q9. How did you implement the AssigneeSelect component?

**Answer:**
`AssigneeSelect` uses **TanStack React Query** to fetch the list of users from `/api/users`.

```tsx
const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,  // cache for 60 seconds
    retry: 3,
  });
```

**Why React Query instead of useEffect + useState?**
- Automatic caching — if you open multiple issue pages, the users list is only fetched once
- `staleTime: 60000` means it won't refetch for 60 seconds
- Built-in loading/error states (`isLoading`, `error`)
- `retry: 3` automatically retries on failure

When the user selects a value, `assignIssue` calls `axios.patch("/api/issues/" + issue.id, { assignedToUserId })`.
On error, it shows a toast notification using `react-hot-toast`.

---

### Q10. How does the IssueStatusBadge reusable component work?

**Answer:**
`IssueStatusBadge` is a pure presentational component. It maps a `Status` enum value to a label and color using a `Record` type — which is a TypeScript utility type that ensures all enum values are covered:

```tsx
const statusMap: Record<Status, { label: string; color: "red" | "violet" | "green" }> = {
  OPEN:        { label: "Open",        color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  CLOSED:      { label: "Closed",      color: "green" },
};
```

**Why `Record<Status, ...>`?**
If someone adds a new status to the Prisma enum but forgets to update `statusMap`, TypeScript will throw a compile error. It's a safety net.

It renders a Radix UI `<Badge>` with the correct color and label. It's used in multiple places: `IssueTable`, `IssueDetails`, `LatestIssues`.

---

### Q11. How does the DeleteIssueButton component prevent accidental deletion?

**Answer:**
It uses Radix UI's `AlertDialog` — a two-step confirmation flow:

1. First dialog: "Are you sure?" with Cancel and Delete buttons
2. Second dialog (separate): Shows only when an error occurs — "This Issue could not be deleted"

```tsx
const [error, setError] = useState(false);
const [isDeleting, setDeleting] = useState(false);

<AlertDialog.Root open={error}>  // Error dialog — controlled
<AlertDialog.Root>               // Confirm dialog — uncontrolled (trigger-based)
```

The `deleteIssue` function:
- Sets `isDeleting = true` → disables button and shows Spinner
- Calls `axios.delete("/api/issues/" + issueId)`
- On success: `router.push("/issues/list")` + `router.refresh()`
- On failure: sets `error = true` to open error dialog

---

## 📌 SECTION 3: AUTHENTICATION & SECURITY

---

### Q12. How did you implement authentication in this project?

**Answer:**
I used **NextAuth.js v4** with **Google OAuth** as the provider.

**Setup in `authOptions.ts`:**
```ts
const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),       // saves users to DB automatically
  providers: [GoogleProvider({ ... })], // Google login
  session: { strategy: "jwt" },         // use JWT tokens, not DB sessions
  secret: process.env.NEXTAUTH_SECRET,
};
```

**How it works:**
1. User clicks "Login" → redirected to `/api/auth/signin` (NextAuth built-in)
2. User authenticates with Google
3. NextAuth creates/updates a `User` record in the database via `PrismaAdapter`
4. A JWT session token is created and stored in a cookie
5. `useSession()` (client) or `getServerSession()` (server) returns the user session

**The `[...nextauth]` route** in `app/api/auth/[...nextauth]/` is a catch-all API route that handles all auth endpoints: signin, signout, callback, etc.

---

### Q13. How did you protect routes so only logged-in users can create or edit issues?

**Answer:**
Two layers of protection:

**Layer 1 — Next.js Middleware (`middleware.ts`):**
```ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/issues/new", "/issues/edit/:id+"],
};
```
This runs on the **Edge** before the page loads. If no session exists, the user is redirected to the login page automatically.

**Layer 2 — API Route protection (`/api/issues/route.ts`):**
```ts
const session = await getServerSession(authOptions);
if (!session)
  return NextResponse.json({}, { status: 401 });
```
Even if someone bypasses the UI and calls the API directly, they'll get a 401 Unauthorized response.

**Layer 3 — Conditional UI (`/issues/[id]/page.tsx`):**
```tsx
{session && (
  <Box>
    <AssigneeSelect ... />
    <EditIssueButton ... />
    <DeleteIssueButton ... />
  </Box>
)}
```
The edit/delete/assign UI is only rendered if a session exists.

---

### Q14. Why did you use JWT strategy for sessions instead of database sessions?

**Answer:**
The `PrismaAdapter` by default uses database sessions, but I set `strategy: "jwt"` explicitly.

**JWT Strategy advantages:**
- No database lookup on every request — the token itself contains the user info
- Works better at the **Edge** (middleware runs on Edge runtime, not Node.js)
- Faster performance — reduces DB load

**Trade-off:** JWTs can't be invalidated before expiry unless you implement a token blocklist. For this project, that's acceptable.

The `PrismaAdapter` is still needed to persist user data (name, email, image) when a new Google user logs in for the first time.

---

## 📌 SECTION 4: DATABASE & PRISMA

---

### Q15. Walk me through your database schema.

**Answer:**
I have 5 models defined in `schema.prisma`:

**Issue:**
```prisma
model Issue {
  id               Int      @id @default(autoincrement())
  title            String   @db.VarChar(255)
  description      String   @db.Text
  status           Status   @default(OPEN)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  assignedToUserId String?  @db.VarChar(255)
  assignedToUser   User?    @relation(...)
}
enum Status { OPEN  IN_PROGRESS  CLOSED }
```

**User, Account, Session, VerificationToken** — these are **NextAuth.js required models** automatically managed by PrismaAdapter. They handle OAuth account linking, session storage, and email verification.

**Key design decisions:**
- `status` defaults to `OPEN` — every new issue starts as open
- `assignedToUserId` is nullable (`String?`) — issues don't need to be assigned
- `updatedAt` uses `@updatedAt` — Prisma automatically updates this on every change

---

### Q16. How do you prevent multiple Prisma Client instances in development (hot reload issue)?

**Answer:**
In development, Next.js hot-reloads the server which can create multiple Prisma Client instances and exhaust the DB connection pool.

My `prisma/client.ts` uses the global singleton pattern:

```ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => new PrismaClient();

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export { prisma };
```

In development: the client is stored on `globalThis` so hot reloads reuse it.
In production: a fresh instance is created per serverless function invocation.

---

### Q17. How does the `cache()` function work in the issue detail page?

**Answer:**
In `app/issues/[id]/page.tsx`:

```ts
const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);
```

React's `cache()` function **memoizes** the result of a function per request. In this page, `fetchUser` is called twice:
1. Inside `IssueDetailPage` to render the page
2. Inside `generateMetadata` to get the issue title for `<title>` tag

Without `cache()`, Prisma would make **two separate DB queries** for the same issue.
With `cache()`, the second call returns the cached result from the first call — **one DB query per request**.

---

## 📌 SECTION 5: API ROUTES & DATA FLOW

---

### Q18. How did you structure your API routes?

**Answer:**

```
app/api/
├── auth/[...nextauth]/   → NextAuth handler (signin, signout, callback)
├── issues/
│   ├── route.ts          → POST /api/issues (create)
│   └── [id]/route.ts     → PATCH /api/issues/:id (update), DELETE /api/issues/:id
└── users/route.tsx       → GET /api/users (for AssigneeSelect dropdown)
```

**POST `/api/issues`:**
1. Check session → 401 if not logged in
2. Parse request body
3. Validate with Zod `issueSchema.safeParse(body)`
4. Return 400 with error details if invalid
5. `prisma.issue.create()` → return 201

**PATCH `/api/issues/:id`:**
- Validates with `patchIssueSchema` (all fields optional for partial update)
- Checks issue exists → 404 if not
- Updates with `prisma.issue.update()`

**DELETE `/api/issues/:id`:**
- Validates session
- `prisma.issue.delete()`

---

### Q19. Why did you use `export const dynamic = 'force-dynamic'` in some pages/routes?

**Answer:**
By default, Next.js tries to statically generate pages at build time for performance. But my pages fetch **live database data** that changes constantly, so static generation doesn't make sense.

`force-dynamic` tells Next.js:
- **Don't cache this page** — always fetch fresh data on every request (equivalent to SSR)
- Equivalent to `getServerSideProps` in the Pages Router

I added it to:
- `app/page.tsx` (dashboard — issue counts change in real time)
- `app/api/issues/route.ts` (API route — no caching)
- `app/issues/list/page.tsx` (list page — filters and new issues)

Without this, a user might see stale data for a long time after creating a new issue.

---

### Q20. How does Zod validation work in your project?

**Answer:**
I use Zod for **shared validation** between the client and server.

**Schema defined once (`validationaSchemas.ts`):**
```ts
export const issueSchema = z.object({
  title: z.string().min(1, "Title is Required!").max(255),
  description: z.string().min(1, "Description is Required!").max(65535),
});
```

**Client side — React Hook Form:**
```ts
const { register, handleSubmit, formState: { errors } } =
  useForm<IssueFormData>({ resolver: zodResolver(issueSchema) });
```
`zodResolver` connects Zod to React Hook Form. Validation runs before `onSubmit` is called. Error messages come directly from the Zod schema.

**Server side — API Route:**
```ts
const validation = issueSchema.safeParse(body);
if (!validation.success)
  return NextResponse.json(validation.error.format(), { status: 400 });
```
`safeParse` doesn't throw — it returns `{ success: true, data }` or `{ success: false, error }`.

**`patchIssueSchema`** uses `.optional()` on all fields so partial updates are allowed (PATCH semantics).

---

## 📌 SECTION 6: PERFORMANCE & OPTIMIZATION

---

### Q21. What performance optimizations did you implement in this project?

**Answer:**

1. **React Query caching** — `staleTime: 60 * 1000` in `AssigneeSelect` means the users list is cached for 60 seconds. If you navigate between issues, the dropdown data loads instantly.

2. **Server Components** — Dashboard, issue list, and latest issues fetch data on the server with zero client-side JavaScript for data fetching.

3. **Prisma `cache()`** — prevents duplicate DB queries in the same request (issue detail page).

4. **Skeleton loading screens** — `loading.tsx` files in `new/`, `list/`, `[id]/` show skeletons while data loads, improving perceived performance.

5. **Pagination** — Only 10 issues are fetched per page (`take: 10`), preventing large data payloads.

6. **`react-loading-skeleton`** — reusable `Skeleton` component used in `AssigneeSelect` and NavBar to avoid layout shift.

7. **Next.js font optimization** — Inter font loaded via `next/font/google` which self-hosts and avoids Google Fonts blocking.

---

### Q22. How does the dashboard work — what does it display and how is data fetched?

**Answer:**
The dashboard (`app/page.tsx`) is a **Server Component** that makes 3 parallel Prisma queries:

```tsx
const open       = await prisma.issue.count({ where: { status: "OPEN" } });
const inProgress = await prisma.issue.count({ where: { status: "IN_PROGRESS" } });
const closed     = await prisma.issue.count({ where: { status: "CLOSED" } });
```

It renders:
- **`IssueSummary`** — 3 cards with counts, each links to the filtered list (e.g., clicking "Open Issues" → `/issues/list?status=OPEN`)
- **`IssueChart`** — a Recharts bar chart visualizing the same 3 counts (client component because Recharts needs the DOM)
- **`LatestIssues`** — 5 most recent issues with their assignee avatar

The `BarChart` uses `ResponsiveContainer` to be fully responsive across screen sizes.

---

## 📌 SECTION 7: ERROR HANDLING & MONITORING

---

### Q23. How did you handle errors in the application?

**Answer:**
Multiple layers:

1. **API-level errors** — All API routes return proper HTTP status codes (400, 401, 404, 500) with JSON error messages

2. **Form errors** — Zod + React Hook Form display inline validation messages via `<ErrorMessage>` component

3. **Axios errors in UI** — Caught in try/catch, shown via:
   - Callout (red banner) in `IssueForm`
   - AlertDialog in `DeleteIssueButton`
   - Toast notification in `AssigneeSelect`

4. **Not Found** — `notFound()` from Next.js is called in issue detail page when issue ID doesn't exist → shows Next.js 404 page

5. **Global error boundary** — `app/global-error.tsx` catches unhandled errors at the root layout level

6. **Sentry** — Integrated for production error monitoring. `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` capture and report errors with full stack traces to the Sentry dashboard.

---

### Q24. What is Sentry and why did you add it?

**Answer:**
Sentry is an **error monitoring and performance tracking** platform. When an unhandled error occurs in production, Sentry captures the full stack trace, user context, and breadcrumbs, then sends an alert.

I integrated it with Next.js using `@sentry/nextjs`. It has three config files:
- `sentry.client.config.ts` — tracks browser errors
- `sentry.server.config.ts` — tracks server/API route errors
- `sentry.edge.config.ts` — tracks middleware errors (Edge runtime)
- `instrumentation.ts` — initializes Sentry at startup

`tracesSampleRate: 1` means 100% of transactions are traced (good for development, should be reduced in production, e.g., 0.1 for 10%).

In a real interview scenario, mention that you'd lower the sample rate in production to control costs.

---

## 📌 SECTION 8: TYPESCRIPT & CODE QUALITY

---

### Q25. How did you use TypeScript in this project? Give specific examples.

**Answer:**

1. **Zod inferred types:**
```ts
type IssueFormData = z.infer<typeof issueSchema>;
```
The form data type is derived from the Zod schema — single source of truth.

2. **Prisma generated types:**
`Issue`, `User`, `Status` are all auto-generated by Prisma from the schema. Fully typed.

3. **IssueQuery interface:**
```ts
export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;   // only valid Issue column names
  page: string;
  orderDirection: "asc" | "desc";
}
```
`keyof Issue` ensures only valid field names can be used as sort columns.

4. **Record type for status map:**
```ts
const statusMap: Record<Status, { label: string; color: "red" | "violet" | "green" }> = { ... }
```

5. **Props interfaces** for every component — no implicit `any`.

6. **`NextAuthOptions`** type annotation on `authOptions`.

---

### Q26. What is the `index.ts` file in the components folder and why is it used?

**Answer:**
`app/components/index.ts` is a **barrel file** — it re-exports all components from one place:

```ts
export { default as ErrorMessage } from "./ErrorMessage";
export { default as IssueStatusBadge } from "./IssueStatusBadge";
export { default as Pagination } from "./Pagination";
export { default as Skeleton } from "./Skeleton";
export { default as Spinner } from "./Spinner";
```

**Benefits:**
- Clean imports: `import { Spinner, Skeleton } from "@/app/components"` instead of separate imports for each file
- Easy to refactor — move a component file, update only the barrel file, not every consumer
- Acts as a public API for the components folder

---

## 📌 SECTION 9: UI & STYLING

---

### Q27. How did you handle styling in this project?

**Answer:**
I used a combination of:

1. **Tailwind CSS** — utility classes for layout, spacing, responsive design (e.g., `hidden md:table-cell` for responsive table columns)

2. **Radix UI Themes** — component library with built-in accessibility. I used: `Button`, `Card`, `Badge`, `Table`, `Select`, `AlertDialog`, `Avatar`, `DropdownMenu`, `Flex`, `Grid`, `Text`, `Heading`

3. **`@tailwindcss/typography`** — the `prose` class for rendering markdown content beautifully in `IssueDetails`:
```tsx
<Card className="prose max-w-full">
  <ReactMarkdown>{issue.description}</ReactMarkdown>
</Card>
```

4. **`classnames` library** — conditionally applies CSS classes in NavBar:
```ts
classnames({ "nav-link": true, "!text-zinc-900": link.href === currentPath })
```

5. **CSS custom properties** — Recharts bar color uses `style={{ fill: "var(--violet-9)" }}` which is a Radix UI CSS variable, keeping colors consistent with the theme.

---

### Q28. How does the responsive design work in the issues list?

**Answer:**
The `IssueTable` uses Tailwind's responsive prefixes:

- `hidden md:table-cell` — Status and Created columns are hidden on mobile, visible on `md` (768px+) and above
- On mobile, the status badge moves **inside the title cell** via `block md:hidden`:
```tsx
<div className="block md:hidden">
  <IssueStatusBadge status={issue.status} />
</div>
```

This means mobile users see: Issue Title + Badge stacked vertically.
Desktop users see: Title | Status | Created Date in columns.

The layout page uses Radix UI's `Grid` with `columns={{ initial: "1", md: "2" }}` for the dashboard — 1 column on mobile, 2 columns on medium+ screens.

---

## 📌 SECTION 10: COMMON INTERVIEW QUESTIONS (BEHAVIOR / DESIGN)

---

### Q29. What was the most challenging part of building this project?

**Answer (suggested):**
The most challenging part was managing the **interaction between Server Components and Client Components** in Next.js 13 App Router.

For example, in the issue list page, the filtering and sorting needed to work with URL search params. Server components read `searchParams` directly as props, but the filter dropdown (`IssueStatusFilter`) is a client component that needs to update the URL using `useRouter` and `useSearchParams`.

Getting both to work together — where the server re-fetches data on URL change and the client updates the URL on user interaction — required understanding the data flow clearly.

Another challenge was the `"use client"` boundary — certain components like the markdown editor must be client-side, but I had to make sure parent server components could still pass props to them correctly.

---

### Q30. What would you improve if you had more time?

**Answer (suggested):**
1. **Real-time updates** — Add WebSocket or Server-Sent Events so users see new issues without refreshing
2. **Comments system** — Allow users to comment on issues, with a `Comment` model in Prisma
3. **Role-based access control** — Admins can delete, members can only edit/comment
4. **Search functionality** — Full-text search on issue title/description using PostgreSQL `ILIKE` or full-text search
5. **Tests** — Write unit tests with Jest + React Testing Library and integration/E2E tests with Playwright or Cypress
6. **Optimistic updates** — Use React Query's `useMutation` with optimistic UI for the assignee select
7. **Email notifications** — Notify assigned users via email using something like Resend or Nodemailer
8. **Better error handling** — Implement a proper error.tsx boundary per route segment

---

### Q31. How does the NavBar highlight the active link?

**Answer:**
`NavLinks` is a client component that uses `usePathname()` hook to get the current route:

```tsx
const currentPath = usePathname();

className={classnames({
  "nav-link": true,
  "!text-zinc-900": link.href === currentPath,
})}
```

`!text-zinc-900` uses Tailwind's `!` prefix (important modifier) to override the default muted link color with a darker color for the active link. The `classnames` library conditionally applies it only when the href matches the current path.

---

### Q32. How do the loading states (Skeleton screens) work?

**Answer:**
Next.js 13 App Router supports `loading.tsx` files that automatically wrap the page in a **Suspense boundary**.

- `app/issues/new/loading.tsx` → shows `<IssueFormSkeleton />` while the new issue page loads
- `app/issues/list/loading.tsx` → shows a table skeleton
- `app/issues/[id]/loading.tsx` → shows a detail page skeleton

`IssueFormSkeleton` uses the custom `<Skeleton>` component which wraps `react-loading-skeleton` to show animated placeholder bars matching the form layout.

In `AssigneeSelect`, if users are still loading: `if (isLoading) return <Skeleton />` — shows a single animated bar while the dropdown data fetches.

In `NavBar`'s `AuthStatus`:
```tsx
if (status === "loading") return <Skeleton width='3rem'/>;
```
Prevents layout shift while the session is being checked.

---

### Q33. What is the difference between `router.push()` and `router.refresh()` and when did you use both?

**Answer:**

- **`router.push(url)`** — Navigates to a new URL. Updates the browser history and renders the new page.
- **`router.refresh()`** — Keeps the current URL but **re-fetches server component data** for the current page. It does NOT navigate — it just tells Next.js to re-run the server components and update the UI with fresh data.

**Where I used both together:**
```ts
router.push("/issues/list");  // navigate away from the form
router.refresh();             // re-fetch the list data so new issue appears
```

After creating or editing an issue, I push to the list page. The `refresh()` ensures the server component (`IssuesPage`) re-queries the database so the new/updated issue appears immediately rather than showing a cached version.

---

### Q34. How does `generateMetadata` work in your project?

**Answer:**
Next.js 13 supports dynamic metadata via the `generateMetadata` async function exported from a page:

```ts
export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));
  return {
    title: issue?.title,
    description: "Detail of issue " + issue?.id,
  };
}
```

This sets the `<title>` tag dynamically — so the browser tab shows the actual issue title (e.g., "Fix login bug") instead of a generic title.

**Key optimization:** I wrapped the Prisma query in `cache()`:
```ts
const fetchUser = cache((issueId: number) => prisma.issue.findUnique(...));
```
Both `generateMetadata` and the main page component call `fetchUser()` — but because of `cache()`, Prisma only queries the DB **once per request**, not twice.

Static metadata is used for the list page:
```ts
export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};
```

---

## 📌 QUICK REFERENCE — KEY DECISIONS SUMMARY

| Decision | Why |
|---|---|
| Next.js App Router | Server Components, collocated data fetching, built-in layouts |
| Prisma + PostgreSQL | Type-safe ORM, migrations, relations |
| NextAuth.js | Google OAuth, PrismaAdapter, JWT sessions |
| Zod | Shared client+server validation, type inference |
| React Hook Form | Performance (minimal re-renders), Zod integration |
| TanStack React Query | Caching, staleTime, retry for AssigneeSelect |
| Radix UI | Accessible, unstyled-first component library |
| Tailwind CSS | Utility-first, responsive design, no CSS files |
| Sentry | Production error monitoring across client/server/edge |
| `cache()` | Deduplicate Prisma calls in same request |
| URL search params | Shareable, bookmarkable filter/sort/pagination state |
| Middleware | Protect routes before page renders (Edge runtime) |

---

*Good luck with your interview! You built this — own it confidently! 🚀*

E:\myDownloadedProject\IssueTracker2-main\IssueTracker2-main\Issue_Tracker_INTERVIEW_QA.md