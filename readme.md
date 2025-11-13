Below is a clean, professional, production-ready **README.md** for your **Natours Website** project.
You can copy/paste it directly into `README.md`.
If you want additional badges, screenshots, or deployment instructions, just tell me!

---

# 🌿 Natours — Nature Tours Booking Website

A modern, responsive website for booking exciting nature and adventure tours. Built with **Node.js**, **Express**, **MongoDB**, and a clean **RESTful API** architecture.

This project follows professional backend patterns, environment variables, MVC architecture, and modern JavaScript standards.

---

## 🚀 Features

### 🔐 **User Accounts & Authentication**

* Signup & login using JWT
* Password reset via email
* Secure cookie authentication
* Protected and restricted routes

### 🧭 **Tour Management**

* View all tours
* View individual tours
* Create, edit, update, delete tours (admin only)
* Upload tour images
* Image resizing using Sharp

### 💰 **Bookings & Payments**

* Stripe payment checkout
* Create bookings
* See your purchased tours

### ⭐ **Reviews**

* Create, edit, delete reviews
* Rate tours
* Nested routes (user → review → tour)

### 🗺️ **Advanced Features**

* Geospatial queries
* Filtering, sorting, pagination
* Rate limiting
* Data sanitization
* Error handling (global error handler)

---

## 🏗️ Tech Stack

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Stripe API
* Multer + Sharp for image uploads

### **Frontend**

* Pug templates
* HTML/CSS
* Mapbox for interactive maps
* Axios for AJAX requests

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/natours.git
cd natours
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```
NODE_ENV=development
PORT=3000
DATABASE=<your-mongodb-connection-string>
DATABASE_PASSWORD=<your-db-password>

JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=<your-email>
EMAIL_PASSWORD=<your-password>
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
```

---

## ▶️ Run the Application

### Development mode:

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

The server will run at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
natours
├── controllers
├── models
├── routes
├── utils
├── public
├── views
├── dev-data
├── app.js
└── server.js
```

---

## 🗂️ API Endpoints

### 🔹 Tours

`GET /api/v1/tours`
`GET /api/v1/tours/:id`
`POST /api/v1/tours`
`PATCH /api/v1/tours/:id`
`DELETE /api/v1/tours/:id`

### 🔹 Users

`POST /api/v1/users/signup`
`POST /api/v1/users/login`
`PATCH /api/v1/users/updateMe`
`GET /api/v1/users/me`

### 🔹 Reviews

`POST /api/v1/reviews`
`PATCH /api/v1/reviews/:id`

### 🔹 Bookings

`GET /api/v1/bookings/checkout-session/:tourId`

---

## 🔒 Security Features

* Rate limiting
* Helmet HTTP headers
* Password hashing (bcrypt)
* Data sanitization (NoSQL injection protection)
* HPP protection
* CORS support

---

## 📸 Screenshots (optional)

*(Tell me if you want me to add placeholders for screenshots.)*

---

## 🤝 Contributing

Pull requests are welcome!
Open an issue to discuss any changes.

---

## 📜 License

MIT License © 2025
Feel free to use this project for learning or portfolio purposes.

---

If you'd like, I can also create:
✅ `CONTRIBUTING.md`
✅ `API documentation.md`
✅ A polished GitHub profile description
Just ask!
