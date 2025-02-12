#  IRCTC Ticket Management API

This is a **Railway Management System API** similar to IRCTC, where users can:
- **Register & Login** (JWT Authentication)
- **Check Train Availability** between two stations
- **Book Seats** with real-time concurrency handling
- **Admins can Add Trains** (protected by API Key)
- **View Booking Details** (Users can only see their own bookings)

---

##  Tech Stack
- **Backend Framework**: Node.js & Express.js  
- **Database**: PostgreSQL (using `pg` module)  
- **Authentication**: JWT Tokens for users, API Key for admins  
- **Security**: Helmet, CORS  
- **Concurrency Handling**: Transaction-based seat booking  

---

##  Installation & Setup
### 1 Clone the Repository
```bash
git clone https://github.com/AnkitRaj-01/IRCTC_Apis.git
cd IRCTC_Apis
```
### 2 Install Dependencies
```bash
npm install
```
### 3 Create a .env File
``` bash
PORT=3000
DATABASE_URL=postgresql://your_username:your_password@your_host:5432/your_database
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_admin_api_key

```
### 4 Set Up Database
```bash
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user')) NOT NULL
);

CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    source VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    train_id INT REFERENCES trains(id) ON DELETE CASCADE,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
### 5 Start the Server
```bash
npm start
```

Server runs on http://localhost:3000.

##  API Endpoints
### 1 Authentication
Register a User
POST /api/auth/register
Body (JSON):
```bash
{
  "name": "Ankit",
  "email": "ankit@gmial.com",
  "password": "securepassword",
  "role": "user"
}
```
Login User
POST /api/auth/login
Body (JSON):
```bash
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
Response:
```bash
{
  "token": "your_jwt_token"
}
```
### 2 Train Management (Admin Only)
Add a Train ( Protected with API Key)
POST /api/trains
Headers:
x-api-key: your_admin_api_key
Body (JSON):
```bash
{
  "name": "Rajdhani Express",
  "source": "Delhi",
  "destination": "Mumbai",
  "total_seats": 50
}
```
Get Trains Between Stations
GET /api/trains?source=Delhi&destination=Mumbai
Response:
```bash
[
  {
    "id": 1,
    "name": "Rajdhani Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "total_seats": 200,
    "available_seats": 150
  }
]
```
### 3 Seat Booking
Book a Seat (🔒 Requires Auth Token)
POST /api/bookings/book
Headers: Authorization: Bearer your_jwt_token
Body (JSON):
```bash
{
  "trainId": 1
}
```
Response:
```bash
{
  "message": "Seat booked successfully",
  "booking": {
    "booking_id": 1,
    "user_id": 2,
    "train_id": 1,
    "booking_time": "2025-02-12T10:30:00Z"
  }
}
```
Get Booking by ID (Only Own Bookings)

GET /api/bookings/1
Headers: Authorization: Bearer your_jwt_token
Response:
```bash
{
  "booking_id": 1,
  "user_id": 2,
  "user_name": "Ankit Doe",
  "user_email": "Ankit@gmail.com",
  "train_id": 1,
  "train_name": "Rajdhani Express",
  "source": "Delhi",
  "destination": "Mumbai",
  "booking_time": "2025-02-12T10:30:00Z"
}
```
If trying to access someone else's booking:
```bash
{
  "error": "Forbidden: You are not allowed to view this booking"
}
```
##  Concurrency Handling in Booking
- Only one user can book a seat at a time on a train due to PostgreSQL transaction locks.
- If no seats are available, booking fails.
  
##  How to Use
1. Register & Login to get a JWT token.
2. Admins can add trains using an API Key.
3. Users can check train availability.
4. Users can book seats and only view their own bookings.
5. Concurrency control ensures only one seat is booked at a time.

