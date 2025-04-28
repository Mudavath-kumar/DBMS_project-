# HealthBook - Medical Appointment Booking System

HealthBook is a comprehensive medical appointment booking system built with Next.js, MongoDB, and Tailwind CSS. It allows users to book appointments with doctors, manage their appointments, and provides an admin interface for system management.

## Features

- **User Authentication**: Secure signup and login functionality
- **Doctor Listings**: Browse and search for doctors by specialty
- **Appointment Booking**: Book, reschedule, and cancel appointments
- **User Dashboard**: View upcoming and past appointments
- **Admin Panel**: Manage users, doctors, and appointments
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/healthbook.git
   cd healthbook
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   \`\`\`

4. Seed the database:
   \`\`\`bash
   npm run seed
   \`\`\`
   Or visit `/api/seed` after starting the application.

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Account

- Email: admin@example.com
- Password: admin123

## Usage

### For Patients

1. Create an account or log in
2. Browse doctors by specialty
3. View doctor profiles and availability
4. Book appointments
5. Manage appointments from the dashboard

### For Administrators

1. Log in with admin credentials
2. Access the admin panel at `/admin`
3. Manage users, doctors, and appointments
4. Add new doctors to the system

## Project Structure

- `/app`: Next.js App Router pages and components
- `/components`: Reusable UI components
- `/lib`: Utility functions and database operations
- `/public`: Static assets

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Now, let's update the package.json file to include the seed script:
