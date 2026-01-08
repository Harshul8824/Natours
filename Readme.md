🌍 Natours — MERN Tour Booking Application

Natours is a full-stack MERN (MongoDB, Express, React, Node.js) tour booking platform that allows users to explore, book, and review nature tours.

This project demonstrates real-world backend and frontend engineering practices used in production systems, including:

Secure authentication & authorization

Online payments with Stripe

Scalable REST API architecture

Modern React UI patterns

Production-ready security practices

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

Security Best Practices

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
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── tourController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── tourModel.js
│   │   └── bookingModel.js
│   │
│   ├── routes/
│   │   ├── tourRoutes.js
│   │   ├── userRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── utils/
│   │   ├── apiFeatures.js
│   │   ├── catchAsync.js
│   │   └── appError.js
│   │
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


Open your browser at:

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

Build for Production
npm run build
npm start