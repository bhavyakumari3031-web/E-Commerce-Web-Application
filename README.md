# LumaCart — Thiranex Task 3

A basic full-stack E-Commerce Web Application built specifically for the Thiranex Task 3 requirements.

## Task 3 scope
- Product catalog
- Add products to cart
- Checkout and order creation
- User login/registration with User/Admin roles
- Admin product management (add, edit, delete)
- Backend APIs for products and orders
- MySQL database integration
- Order tracking through order status

No separate payment gateway, wishlist, reviews, coupons, chat, recommendation system, or other unrelated features are included.

## Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL
- Authentication: JWT with password hashing

## Requirements
- Node.js 18+
- MySQL 8+
- VS Code
- Optional: Live Server extension

## Setup

### 1. Database
Open MySQL Workbench or the MySQL command line and run `database/ecommerce.sql`.

### 2. Backend
Open a terminal inside `backend` and run:

```bash
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ecommerce_db
JWT_SECRET=use_a_long_random_secret
```

Then run:

```bash
npm run seed
npm start
```

The API runs at `http://localhost:5000`.

### 3. Frontend
Open `frontend/index.html` with VS Code Live Server.

## Demo accounts
- Admin: `admin@shop.com` / `Admin@123`
- User: `user@shop.com` / `User@123`

## Main API endpoints
- POST `/api/auth/register` — register
- POST `/api/auth/login` — login
- GET `/api/products` — product catalog
- GET `/api/products/:id` — product details
- POST `/api/products` — admin adds product
- PUT `/api/products/:id` — admin edits product
- DELETE `/api/products/:id` — admin deletes product
- POST `/api/orders` — logged-in user checkout
- GET `/api/orders/my` — user's orders
- GET `/api/orders` — admin views orders
- PUT `/api/orders/:id/status` — admin updates order status

## Suggested demonstration
1. Login as User.
2. View the product catalog.
3. Add a product to the cart.
4. Open the cart and proceed to checkout.
5. Place the order.
6. Open My Orders and show the order status.
7. Logout and login as Admin.
8. Open Product Management and add/edit/delete a product.
9. Open Order Management and update an order status.
10. Login as User again and show the updated order status.

## Important
Do not upload the real `.env` file or real passwords to GitHub.
