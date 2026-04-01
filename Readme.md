# Natours
A robust, feature-rich RESTful API for a tour booking platform. This backend is built using Node.js, Express, and MongoDB, showcasing modern web development practices, data security, and an advanced decoupled architecture. It currently serves a Vite React frontend but also maintains full support for server-side rendered templates using Pug.

## 🚀 Key Features

*   **Advanced Authentication & Authorization**: JSON Web Tokens (JWT) based authentication via cookies, password resets via email, password hashing (bcrypt), and role-based access control (user, guide, lead-guide, admin).
*   **Security Best Practices**: Includes advanced protection against XSS (`xss-clean`), NoSQL Query Injection (`express-mongo-sanitize`), Parameter Pollution (`hpp`), and Denial of Service (DoS) attacks (`express-rate-limit`). Configured security HTTP headers using `helmet`.
*   **Comprehensive API Functionalities**: 
    * Advanced filtering, sorting, field limiting, and pagination.
    * Geospatial queries for finding tours within a certain radius or distance from a specific point.
    * Factory handler functions for centralized CRUD operations.
*   **File Uploads & Image Processing**: Integrates `multer` for receiving image uploads and `sharp` for resizing and formatting images dynamically before saving to the server.
*   **Cross-Origin Resource Sharing (CORS)**: Configured seamlessly to allow requests from the React + Vite frontend (`http://localhost:5173`).
*   **Server-Side Rendering (SSR)**: Capable of rendering robust templates utilizing Pug, with built-in Content Security Policy (CSP) tailored for mapping libraries like Leaflet.
*   **Centralized Error Handling**: Unified system to catch operational and programming errors throughout the application architecture cleanly and predictably.

## 💻 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **Security:** Helmet, express-mongo-sanitize, xss-clean, hpp, express-rate-limit
*   **View Engine:** Pug
*   **Tooling:** Nodemon, Parcel (for bundling frontend JS), dotenv

## 📂 Project Structure

```text
├── Controller/        # Express route controllers & factory handlers
├── dev-data/          # Sample JSON data for initially seeding the database
├── models/            # Mongoose schemas & models (Tour, User, Review)
├── public/            # Static assets (images, bundled frontend JS, CSS)
├── Routes/            # Express separate routers for individual resources
├── utils/             # Helper utilities (Email, APIFeatures, AppError, catchAsync)
├── views/             # Pug templates for SSR pages
├── app.js             # Express configuration & global middleware
├── server.js          # Entry point, database connection & server initialization
└── package.json       # Dependencies and npm scripts
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd Natours
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables Configuration:**
   Create a `config.env` file in the root directory and define the following variables (refer to `config.env.example` if present):
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE=<Your_MongoDB_URI>
   DATABASE_PASSWORD=<Your_MongoDB_Password>

   JWT_SECRET=<Your_Secret_Key>
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90

   # Email credentials for Nodemailer (e.g., Mailtrap, SendGrid)
   EMAIL_USERNAME=<Your_Email_Username>
   EMAIL_PASSWORD=<Your_Email_Password>
   EMAIL_HOST=<Your_Email_Host>
   EMAIL_PORT=<Your_Email_Port>
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The API will now be listening on port 3000 (or the port defined in your env variables).

## 🌍 Connecting the React Frontend

The API's Cross-Origin Resource Sharing (CORS) is configured to seamlessly accept credentialed connections (cookies attached) from a Vite app running locally.

1. Start your Vite React app:
   ```bash
   # Navigate to your client application directory
   npm run dev
   ```
2. Your frontend client at `http://localhost:5173` will automatically be permitted to make requests to the Natours API, facilitating cross-origin API data fetching with intact JWT cookie sessions.

## 📝 API Endpoints Summary

| Resource | Endpoints Base | Key Functionality |
| :--- | :--- | :--- |
| **Tours** | `/api/v1/tours` | Discover, filter, sort tours, fetch geospatial tour data, access top-5-cheap alias. |
| **Users** | `/api/v1/users` | Registration, login, password updates/reset, retrieving user profile details. |
| **Reviews** | `/api/v1/reviews` | Create and retrieve reviews linked to specific tours dynamically. |
| **Views** | `/` | Root routes delivering server-side rendering views using Pug templates. |
