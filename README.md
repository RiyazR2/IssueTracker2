## Issue Tracker App

- npm install react-icons
- npm i classnames
- Installed MySQL
- DataGrip
- setting up prisma
- npm i prisma
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

- npm i zod - validations
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

- npm install react-hook-form
- npm i axios
- npm i @hookform/resolvers
- implemented client side validation
- PropsWithChildren
- Extract ErrorMessage Component
- Added Spinner - tailwind elements spinner
- Seperation of Concern
- shows issue page
- build the issue status badge
- Add loading skeleton
  - npm i delay
  - npm i react-loading-skeleton
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
- add the login and logout links
