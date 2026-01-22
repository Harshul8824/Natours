🌍 Natours — MERN Tour Booking Application

Natours is a full-stack MERN (MongoDB, Express, React, Node.js) tour booking platform that allows users to explore, book, and review nature tours.

This project demonstrates real-world backend and frontend engineering practices used in production systems, including:

✅ Secure authentication & authorization
💳 Online payments with Stripe
🚀 Scalable REST API architecture
🎨 Modern React UI patterns
🔒 Production-ready security practices

🚀 Features
🧭 Tours

Browse all available tours with detailed information
(price, difficulty, duration, max group size)

Tour images, locations, and interactive map integration

Advanced filtering, sorting, and pagination

Search tours by price, duration, and difficulty

👤 Authentication & Security

JWT authentication (access & refresh tokens)

Secure password hashing with bcrypt

Role-based access control (admin, lead-guide, user)

Protected API routes

Forgot & reset password flow via email

🔐 Security Best Practices

Rate limiting

Data sanitization (NoSQL & XSS protection)

Helmet & CORS configuration

🛒 Bookings & Payments

Stripe Checkout integration

Secure online payments

Automatic booking creation after successful payment

Prevention of duplicate bookings

View booking history in user dashboard

📝 User Account

User profile management

Upload & update profile photo

Change password

View all booked tours

Account deactivation

⭐ Reviews & Ratings

Users can post reviews & ratings for booked tours

One review per user per tour

Auto-calculated average ratings

Ratings displayed on tour pages

🛠️ Tech Stack
Frontend

React.js

React Router

Context API / Redux (optional)

Axios

Reusable component-based UI

Backend

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

Stripe Payments API

Architecture & Patterns

MERN Stack

RESTful API

MVC architecture (backend)

Factory controllers for reusable CRUD logic

Centralized error handling

📁 Project Structure
Natours/
│
├── client/                  # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       ├── hooks/
│       └── App.js
│
├── server/                  # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/yourusername/natours.git
cd natours

2️⃣ Install Dependencies
npm install
cd client
npm install

3️⃣ Environment Variables

Create a .env file in the root directory:

NODE_ENV=development
PORT=3000

DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
DATABASE_LOCAL=mongodb://127.0.0.1:27017/natours

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret


⚠️ Never commit your .env file to version control.

4️⃣ Run the Application
Backend
npm run dev

Frontend
cd client
npm start


Open in browser:

http://localhost:3000

📦 API Endpoints (Summary)
Tours
Method	Endpoint	Description
GET	/api/v1/tours	Get all tours
GET	/api/v1/tours/:id	Get single tour
POST	/api/v1/tours	Create tour (admin)
PATCH	/api/v1/tours/:id	Update tour
DELETE	/api/v1/tours/:id	Delete tour
Users
Method	Endpoint	Description
POST	/api/v1/users/signup	Register
POST	/api/v1/users/login	Login
PATCH	/api/v1/users/updateMyPassword	Change password
PATCH	/api/v1/users/updateMe	Update profile
DELETE	/api/v1/users/deleteMe	Deactivate account
Bookings
Method	Endpoint	Description
POST	/api/v1/bookings/checkout-session/:tourId	Stripe checkout
GET	/api/v1/bookings/my-tours	Get booked tours
🧪 Testing (Optional)
npm test

🛠️ Recommended Tools

Postman / Thunder Client

MongoDB Compass

Nodemon

Stripe Dashboard

🚀 Deployment

You can deploy this application using:

Render (Backend)

Vercel / Netlify (Frontend)

Railway

Docker

Heroku (legacy)

🌐 Render Deployment Guide (Backend)
✅ Prerequisites

Render account

MongoDB Atlas database

Stripe account

GitHub repository connected to Render

🧱 Step 1 – Prepare the Project
Ensure production scripts exist

In your root package.json:

"scripts": {
  "start": "node server/server.js",
  "dev": "nodemon server/server.js"
}

Enable dynamic port usage

In server.js:

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


Render automatically injects a PORT.

☁️ Step 2 – Create a Web Service on Render

Go to Render Dashboard

Click New → Web Service

Connect your GitHub repository

Select repository and branch

⚙️ Step 3 – Configure Build Settings
Setting	Value
Environment	Node
Build Command	npm install
Start Command	npm start
Root Directory	Leave blank (or set to server if backend is inside /server)
🔐 Step 4 – Add Environment Variables

Add all .env variables inside Render dashboard:

DATABASE
JWT_SECRET
JWT_EXPIRES_IN
JWT_COOKIE_EXPIRES_IN
EMAIL_USERNAME
EMAIL_PASSWORD
EMAIL_HOST
EMAIL_PORT
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NODE_ENV=production


❗ Never store secrets directly in GitHub.

🚀 Step 5 – Deploy

Render will:

Install dependencies

Build the project

Start the server

Provide a live URL

Example:

https://natours-api.onrender.com

🔁 Step 6 – Update Frontend API URL

Update Axios base URL:

const API_BASE_URL = "https://natours-api.onrender.com/api/v1";


Redeploy frontend.

💳 Step 7 – Stripe Webhook Configuration

Stripe Dashboard → Developers → Webhooks

Add endpoint:

https://natours-api.onrender.com/api/v1/bookings/webhook-checkout


Copy webhook secret and update it in Render environment variables.

🐞 Common Render Issues
❌ App crashes on deploy

Check logs in Render dashboard

Ensure start script exists

Verify Node version compatibility

❌ MongoDB connection fails

Whitelist Render IP in MongoDB Atlas (0.0.0.0/0)

Verify connection string

❌ Stripe webhook not firing

Confirm webhook URL is public

Ensure webhook secret matches

📦 Production Build (Optional)
npm run build
npm start