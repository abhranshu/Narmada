# Daily Expense Tracker

A web application to track daily expenses with MongoDB integration.

## Features

- Add new expenses with description, amount, and category
- View list of expenses
- Delete expenses
- Calculate total expenses
- Persistent storage using MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running on your system
4. Create a `.env` file in the root directory (optional):
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter expense details in the form:
   - Description
   - Amount
   - Category
2. Click "Add Expense" to save
3. View your expenses in the list below
4. Delete expenses using the delete button

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Additional: Mongoose, CORS 