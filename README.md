# Invoice Management System

A full-stack web application for managing invoices, built with React.js frontend and Express.js backend using SQLite database.

## Features

- User authentication (Login/Signup)
- Create, read, update, and delete invoices
- Filter invoices by status (Paid, Unpaid, Pending)
- Sort invoices by date or amount
- Responsive UI with professional styling

## Tech Stack

- **Frontend:** React.js, React Router, Vite
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Authentication:** JWT, bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd invoice-management-system
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
   The server will run on http://localhost:5000

2. Start the frontend:
   ```bash
   cd ../client
   npm run dev
   ```
   The app will run on http://localhost:5173

### Database
The SQLite database (`invoices.db`) will be created automatically when the server starts.

## API Endpoints

- `POST /api/signup` - Register a new user
- `POST /api/login` - Login user
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create a new invoice
- `PUT /api/invoices/:id` - Update an invoice
- `DELETE /api/invoices/:id` - Delete an invoice

## Usage

1. Sign up for a new account or login with existing credentials.
2. View the list of invoices on the home page.
3. Use filters and sorting to manage invoices.
4. Add new invoices or edit/delete existing ones.

## Screenshots

(Add screenshots here if available)

## Deployment

### Backend (Render)
1. Create account on Render.com
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variable: `NODE_ENV=production`

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy `dist` folder to Vercel or Netlify
3. Update API URLs in components to point to deployed backend

## Live Demo

- **Frontend:** [Your Vercel/Netlify URL]
- **Backend:** [Your Render URL]

## License

This project is for educational purposes.
