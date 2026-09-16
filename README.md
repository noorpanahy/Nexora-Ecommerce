# NEXORA — E-Commerce Platform

NEXORA is a modern full-stack e-commerce platform built with **Laravel** and **React**.

The project provides a complete online shopping experience for customers and an administration system for managing products, categories, customers, orders, and product images.

---

## 🚀 Features

### Customer Features

- User registration and login
- Secure authentication with Laravel Sanctum
- Browse products
- Browse products by category
- Product details
- Multiple product images
- Product pricing and discount pricing
- Shopping cart
- Update cart quantities
- Remove products from cart
- Stock validation
- Checkout
- Cash on Delivery
- Customer order history
- Order details
- Order status tracking

### Admin Features

- Admin authentication
- Admin dashboard
- Sales statistics
- Revenue statistics
- Order statistics
- Recent orders
- Top-selling products
- Monthly revenue information
- Product management
- Create products
- Edit products
- Delete products
- Product image management
- Set primary product image
- Category management
- Create categories
- Edit categories
- Delete categories
- Customer management
- View customers
- Create customers
- Edit customers
- Delete customers
- View customer details
- Order management
- Update order status

---

## 🛠️ Technology Stack

### Backend

- PHP
- Laravel
- Laravel Sanctum
- REST API
- Eloquent ORM
- MySQL
- Laravel Storage

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Context API
- Recharts
- React Icons

### Deployment

- Docker
- GitHub
- Render

---

## 📁 Project Structure

```text
E-Commerce Laravel/
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── Dockerfile
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── public/
│   └── ...
│
└── README.md
🔐 Authentication

NEXORA uses Laravel Sanctum for API authentication.

Users can:

Register
Login
Logout
Access their account
Access protected customer endpoints

The application uses role-based authorization.

Roles
CUSTOMER
ADMIN

Administrators have access to the admin dashboard and management APIs.

🛍️ Shopping System

The shopping system includes:

Products
   ↓
Product Details
   ↓
Add to Cart
   ↓
Shopping Cart
   ↓
Checkout
   ↓
Order

The backend validates product availability and stock before creating an order.

Order items store product information at the time of purchase so that historical orders remain consistent even if product information changes later.

📦 Product Management

Administrators can manage:

Product name
Description
Category
Price
Discount price
SKU
Stock
Status
Product images
Primary product image

Products can contain multiple images.

Product images are stored using Laravel's public storage system.

📊 Admin Dashboard

The administration dashboard provides information such as:

Total customers
Total products
Total orders
Total revenue
Today's revenue
Today's orders
Active orders
Cancelled orders
Monthly revenue
Top products
Recent orders
Order status information

Charts and statistics are displayed using Recharts.

🗄️ Database

The application uses MySQL.

Main database entities include:

users
categories
products
product_images
carts
cart_items
addresses
orders
order_items
Main relationships
Category
   │
   └── Products
          │
          └── Product Images

User
 ├── Cart
 ├── Orders
 └── Addresses

Cart
 └── Cart Items

Order
 └── Order Items
        │
        └── Product
⚙️ Backend Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/nexora-ecommerce.git

Enter the project:

cd nexora-ecommerce
2. Install Laravel dependencies
cd backend
composer install
3. Create environment file

Copy the example environment file:

cp .env.example .env

On Windows PowerShell:

Copy-Item .env.example .env
4. Configure database

Update your .env file:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=
5. Generate application key
php artisan key:generate
6. Run migrations
php artisan migrate
7. Create storage link
php artisan storage:link
8. Seed the admin account

If the project includes the admin seeder:

php artisan db:seed

Development admin credentials:

Email: admin@ecommerce.test
Password: admin12345

Change development credentials before using the application in production.

9. Start Laravel
php artisan serve

The API will normally be available at:

http://127.0.0.1:8000
💻 Frontend Installation

Open another terminal.

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
🔗 API Configuration

The frontend communicates with the Laravel API through Axios.

Development API:

http://127.0.0.1:8000/api

For production, configure the frontend to use the deployed Render API URL.

Example:

VITE_API_URL=https://your-backend.onrender.com/api
🔑 API Authentication

Protected requests use a Laravel Sanctum bearer token.

Example:

Authorization: Bearer YOUR_TOKEN

The frontend automatically attaches the authentication token to protected API requests.

📋 Order Status

Orders use the following statuses:

PENDING
IN_PROGRESS
READY
DELIVERED
CANCELLED

The customer can view their order status, while administrators can update order status.

💳 Payment

The current version supports:

Cash on Delivery (COD)

Additional online payment providers can be integrated in future versions.

🐳 Docker

The Laravel backend is prepared for containerized deployment using Docker.

Example Docker workflow:

docker build -t nexora-backend ./backend

Run the container:

docker run -p 8000:8000 nexora-backend

Production Docker configuration will use environment variables for:

Application configuration
Database connection
Application key
Storage configuration

Sensitive environment variables should never be committed to GitHub.

☁️ Deployment

The project is designed to be deployed using:

GitHub
   ↓
Render
   ↓
Docker
   ↓
Laravel API
   ↓
MySQL

The React frontend can be deployed separately as a Render Static Site.

Recommended production structure:

                    GitHub
                       │
                       ▼
                    Render
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       React Frontend       Laravel Backend
                                  │
                                  ▼
                                MySQL
🔒 Environment Variables

Never commit your production .env file.

Important backend environment variables include:

APP_NAME=NEXORA
APP_ENV=production
APP_DEBUG=false
APP_KEY=

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

Frontend:

VITE_API_URL=
🧪 Development

Backend:

cd backend
php artisan serve

Frontend:

cd frontend
npm run dev
📌 Future Improvements

Planned improvements may include:

Online payment integration
Product reviews and ratings
Wishlist
Advanced product filtering
Product search
Email notifications
Order email confirmation
Coupon and discount system
Inventory management improvements
Advanced analytics
Image optimization
Cloud image storage
Automated testing
CI/CD pipeline
Production monitoring
👨‍💻 Author

Noorulhoda Panahy

Full-Stack Developer

Technologies
Laravel
PHP
React
JavaScript
MySQL
REST API
Docker
Git
GitHub
Tailwind CSS
📄 License

This project is developed for educational, portfolio, and development purposes.


### One important change before you commit

Because we're going to deploy this with **Docker + Render**, I would actually make one small improvement to this README before uploading it: we should document your **actual GitHub repository name, actual Render URLs, Docker commands, and exact production environment variables** once we configure them.

For now, save this as:

```text
E-Commerce Laravel/README.md

Then run:

git add README.md
git commit -m "Add project documentation"
git push origin main
