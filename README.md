# Odin Book

A full-featured Twitter/X-inspired social network built as the final project of [The Odin Project Node.js](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book) course. It brings together everything learned throughout the entire curriculum: authentication, real-time communication, complex data modeling, file handling, and a polished frontend, into a production-grade social platform powered by Express, Prisma, Socket.IO, and React.

This is the largest project in the course and the one that pulls it all together. It is designed as a real social network where users can post, reply, share, like, bookmark, follow, get notified in real time, search for content, upload images, and explore trending posts. All in a Twitter-like experience built from scratch.

## Project Objective

The main goal was to practice and demonstrate:
- Architecting a complete full-stack social network from the ground up
- Modeling complex relational data with self-referencing tables, partial indexes, and composite unique constraints
- Building a RESTful API with 30+ endpoints covering posts, replies, shares, likes, bookmarks, follows, notifications, trending, search, and user management
- Integrating real-time push notifications through WebSocket (Socket.IO)
- Handling image uploads with Multer and processing them with Sharp for metadata extraction
- Implementing cursor-based and offset pagination across multiple resources
- Managing authentication and authorization with JWT and Passport
- Building a responsive, multi-page React SPA with context-based state management
- Writing a rich seeding script with 12 users, 21 interconnected posts, 30 follow relationships, 80+ likes, and 50 bookmarks for instant demo readiness

## What Is It?

A social network inspired by Twitter/X, split into a Node.js backend API and a React frontend.

The app includes:
- User registration and login with profile picture upload at signup
- JWT-based authentication on every protected route
- Post creation with optional image attachments
- Four distinct post types: original posts, replies, shares (repost), and share-with-reply (quote tweet)
- Like, unlike, bookmark, and unbookmark posts
- Share and unshare (repost and undo repost) posts
- Threaded reply system with media support
- Follow and unfollow users, remove followers
- Full user profiles with bio, profile picture, background image, post count, followers, and following
- Customizable profiles: upload, change, and remove profile picture and background
- Real-time notifications via Socket.IO for likes, replies, shares, and new follows
- Notification center with unread count and mark-as-read (auto-cleanup of old notifications)
- Search for posts and users with "people you follow" filter
- Trending posts section based on like count, auto-refreshed periodically
- "Who to Follow" suggestions using randomized raw SQL queries
- Paginated feeds, user lists, and search results
- Tabbed profile pages: posts, replies, shares, and likes
- Full-screen image viewer for post media
- Bookmarks page for saved posts
- Toast notifications for user actions feedback
- Database seeding with a complete social graph for demo and testing

## Real-Time Communication

The project uses Socket.IO for live notification delivery between users.

This was not part of the course material. The socket implementation was researched and built independently to provide a real-time experience. It is used to:
- Push instant notification events when someone likes, replies, shares, or follows
- Update the unread notification count in the UI without polling or manual refresh
- Authenticate socket connections using the same JWT token as the REST API

## How to Use

The project is split into two separate apps.

### Backend

1. Open the backend folder:

```bash
cd NodeJS/top-odin-book/backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure your environment variables using `.env.example` as a reference:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db_name>?schema=public"
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Apply the Prisma migration:

```bash
npx prisma migrate dev
```

5. Generate the Prisma client:

```bash
npx prisma generate
```

6. Seed the database with sample data (12 users, 21 posts, follows, likes, bookmarks, and media):

```bash
npm run seed
```

7. Run the development server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

> **Seed credentials:** all seeded users share the password `pass`. Usernames are printed to the console after seeding.

### Frontend

1. Open the frontend folder:

```bash
cd NodeJS/top-odin-book/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the Vite development server:

```bash
npm run dev
```

4. Open the app in the browser using the local Vite address.

## Features

### Core Social Features
- **Post Creation**: create text posts with optional image attachments, with content limited to 280 characters
- **Replies**: threaded reply system linked to original posts, with media support
- **Shares (Repost)**: share another user's post
- **Share with Reply (Quote Tweet)**: share a post while adding your own commentary
- **Likes**: like and unlike posts, with duplicate prevention via composite unique constraints
- **Bookmarks**: save posts for later, accessible from a dedicated bookmarks page

### User System
- **Authentication**: register with username, name, password, and optional profile picture; log in with JWT
- **Profiles**: full profile pages with bio, profile picture, background image, post count, followers, and following counts
- **Profile Customization**: upload, update, and remove profile picture and background image
- **Follow System**: follow and unfollow users, remove followers from your own follower list
- **User Search**: search users by username or name, with "people you follow" filter
- **Who to Follow**: randomized suggestions of users you don't follow yet, powered by raw SQL

### Notifications & Real-Time
- **Real-Time Notifications**: Socket.IO pushes events instantly when someone interacts with your content
- **Notification Types**: like, reply, share, and follow: each with contextual information
- **Unread Count**: live badge showing unread notification count
- **Mark as Read**: batch mark-as-read with auto-cleanup of old notifications via Prisma transactions

### Discovery & Navigation
- **Feed**: paginated timeline of posts from users across the platform
- **Trending Posts**: top posts ranked by like count, cached and auto-refreshed
- **Post Search**: search posts by content with relevance ordering and "people you follow" filter
- **Tabbed Profiles**: view a user's posts, replies, shares, and liked posts in separate tabs
- **Full-Screen Image Viewer**: dedicated route for viewing post images at full resolution
- **Pagination**: offset-based pagination across feeds, user lists, search results, and profile tabs

### Technical Highlights
- **Express 5**: latest major version of Express for routing and middleware
- **Prisma with Partial Indexes**: composite unique constraints with `where` clauses for business rules (e.g., only one share per user per post)
- **Prisma Transactions**: atomic operations for post+media creation and notification cleanup
- **Sharp Integration**: automatic image metadata extraction (width × height) on upload
- **Socket.IO Auth**: WebSocket connections authenticated via JWT, with per-user rooms for targeted event delivery
- **Input Validation**: express-validator for all user-facing endpoints
- **Global Error Handler**: centralized error middleware with development stack traces
- **Multer Memory Storage**: in-memory file handling for profile pictures, backgrounds, and post media
- **Raw SQL**: `$queryRaw` used for randomized "Who to Follow" queries not expressible through Prisma's query builder
- **Comprehensive Seed**: transactional seed script creating a full social graph ready for demo

## Project Structure

- `backend/`: Express API with controllers, routes, validators, Prisma schema, seed script, and Socket.IO server
- `backend/controllers/`: business logic for auth, posts, users, follows, and notifications
- `backend/routes/`: route definitions for all API endpoints
- `backend/prisma/`: database schema, migrations, and seed data (including base64-encoded picture buffers)
- `backend/generated/`: Prisma client generated output
- `frontend/`: React/Vite application with pages, components, contexts, and utilities
- `frontend/src/components/`: reusable UI components (Post, UserCard, SearchPane, NotificationsPane, etc.)
- `frontend/src/contexts/`: React contexts for auth, feed, notifications, pictures, and toasts

## Technologies Used

- Node.js
- Express 5
- PostgreSQL
- Prisma (with partial indexes and raw SQL)
- JWT
- Passport
- Socket.IO
- Multer
- Sharp
- bcryptjs
- express-validator
- React 19
- React Router 8
- Socket.IO Client
- Vite

## Visualization

Feed:
<img width="1920" height="918" alt="the-odin-book-feed-screenshot" src="https://github.com/user-attachments/assets/265712fd-a5bb-4222-992e-8c1a2e20a1ce" />

Profile page: 
<img width="1920" height="918" alt="the-odin-book-profile-screenshot" src="https://github.com/user-attachments/assets/de062ca4-e8a3-473b-b277-ca9551dd5da5" />

Search page:
<img width="1920" height="918" alt="the-odin-book-search-page-screenshot" src="https://github.com/user-attachments/assets/4d93f323-a524-48c6-ae12-2583feb1fdb9" />

---

>**Note on file storage:** storing uploaded files directly in the database isn't the best long-term choice for a production app, but it was a deliberate trade-off here. It keeps the project self-contained and easy for anyone to clone, run, and test without setting up external file storage.

Project developed following: [The Odin Project - Odin Book](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book)

📍 **Main repository with all projects**: [ChristoferLv/TheOdinProject](https://github.com/ChristoferLv/TheOdinProject)
