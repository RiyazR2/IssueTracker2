## Issue Tracker App

- npm install react-icons@4.11.0
- npm i classnames@2.3.2
- Installed MySQL
- DataGrip
- setting up prisma
- npm i prisma@5.3.1
- npx prisma init
- npx prisma format - after creating issue model
- npx prisma migrate dev - initial migration

# DataGrip

- new project > Issue Tracker
- Database Explorer > Data Source > MySql
- host : localhost, Port : 3306, Username : root, password : YourPassword, Database : issue-tracker
- update driver(if available) - that link at bottom
- Test Connection

# Building an API

- npm i zod@3.22.2 - validations
- to store issue in Database, we need prisma client, single instance of prisma client
- search next.js prisma client, we get sample code for creating instance of prisma client
- prisma folder create client.ts then paste that code

# Radix-ui

- npm install @radix-ui/themes
- Import the global CSS file at the root of your application.
- Add Theme to your application, wrapping the root component inside of body.
- ThemePanel - radix-ui/themes
- Customized radix ui themes
- added markdown editor

  - npm install --save react-simplemde-editor easymde

- npm install react-hook-form@7.46.1
- npm install axios@1.5.0
- npm i @hookform/resolvers@3.3.1
- implemented client side validation
- PropsWithChildren
- Extract ErrorMessage Component
- Added Spinner - tailwind elements spinner
- Seperation of Concern
- shows issue page
- build the issue status badge
- Add loading skeleton
  - npm i delay
  - npm i react-loading-skeleton@3.3.1
- Showing Issue Details
- Style the Issue Detail Page
- Add Markdown Preview - for proper markdown style, we need to install one more package
  - npm i react-markdown
  - tailwind typography
    - npm install -D @tailwindcss/typography
    - Then add the plugin to your main style.css file:
      - import typography from "@tailwindcss/typography";
      - plugins: [typography],
    - then use className="prose"
- Build a Style Link Component
- Add Additional Loading Skeleton
- Disable Server Side Rendering
- Re-Factor organizing imports
- Adding the Edit Button
  - for icons - npm i @radix-ui/react-icons
- Single Responsiblity Principle
  - Refactor: Apply the SRP
- Build the Issue Edit Page
- Building an API
  - build an API for updating an Issue
- Update Issues
- nextjs route segmnet config
- Caching
  - Data Cache
    - When we fetch data using fetch()
    - Stored in the file system
    - Permanent until we redeploy
  - Full Route Cache (Cache on the Server)
    - Used to store the output of statically rendered routes
  - Router Cache (client-sided Cache)
    - To store the payload of pages in browser
    - lasts for a session
    - Gets refreshed when we reload
- Fixed Caching Issue
- Improve the loading skeleton
  - Fix for the ssr: false Issue in EditIssuePage: Added use client at the top of IssueForm,Create a new Client Component (IssueFormWrapper.tsx) to dynamically load IssueForm
- Add Delete Button
- Add Confirmation Dialog Box
- Build an API for deleting an Issue
- Delete an Issue
- Handle Errors
- Improve User Experience while deleting
- Remove Duplicate skeletons

# Authentication - nextAuth

- npm install next-auth
- setup nextAuth
- Configure Google Provider
- Adding the Prisma Adapter
  - npm install @prisma/client @next-auth/prisma-adapter
  - npm install prisma --save-dev
- Add the login and logout links
- Change layout of the navbar
- Added Dropdown Menu
- Troubleshoot Avatar not loading
- Adding a loading skeleton to login
- Secure the Application

# Assigning Issues to Users

- Build the AssigneeSelect Component
- Populate the AssigneeSelect Component
- Setting up React Query
  - npm install @tanstack/react-query
- Fetch Data with React Query
- Add Assigned Issue to Prisma Schema
- Implementing the API
  - Postman Extension started Using
- Assign an issue to user
- Shows Toast Notifications
  - npm i react-hot-toast
- Refactor the AssigneeSelect Component

# Filter, Sorting and Pagination

- Building the filter component
- Sort Issues
  - Added an orderDirection parameter to searchParams to toggle between "asc" and "desc".
  - Adjusted the orderBy in the Prisma query to use orderDirection.
  - Added the ArrowDownIcon for descending order and toggled the icon based on the current sorting direction.
- Pagination - build the layout of pagination component
- Paginate Issue
- Refactor: Extract IssueTable Component

# Dashboard

- Build LatestIssue Component
- Build the IssueSummary Component
- Build the BarChart Component
  - npm install recharts@2.8.0
- Laying out the Dashboard

# Going to production

- add metadata
- optimize performance using react cache
- Removing .env file
  - python git-filter-repo.py --path .env --invert-paths --force
- Settup Error Tracking
- Error Tracking Tools
  - Sentry
  - BugSnag
  - LockRocket
- sentry.io
