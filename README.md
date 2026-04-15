# Legal Tech Dashboard - Full Stack Application

A professional, fully-functional legal tech dashboard application built with Node.js/Express backend and React frontend. The application manages legal cases, clients, tasks, and documents with an interactive dashboard featuring charts, tables, and data visualizations.

## 🚀 Features

### Dashboard
- **Comprehensive Statistics**: Real-time overview of cases, tasks, clients, and documents
- **Interactive Charts**:
  - Case Status Distribution (Pie Chart)
  - Document Status Distribution (Pie Chart)
  - Cases by Type (Bar Chart)
  - Cases by Priority (Bar Chart)
  - Task Completion Rate (Pie Chart)
- **Summary Statistics**: Detailed breakdown of all metrics
- **Recent Cases Table**: Quick view of latest cases with status badges

### Case Management
- Add, view, update, and delete legal cases
- Filter by status, priority, and case type
- Search functionality for quick access
- Detailed case information display

### Client Management
- Manage client information (name, email, phone, address)
- Grid and table view layouts
- Search and filter capabilities
- Quick contact links

### Task Tracking
- Track tasks linked to specific cases
- Real-time progress bars (0-100% completion)
- Status tracking (Pending/Completed)
- Task statistics dashboard
- Due date management

### Document Management
- Organize documents by case
- Document status workflow (Pending → Reviewed → Approved)
- Document type categorization
- Multiple view formats (grid and table)
- Audit trail with creation dates

## 📋 Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin requests
- **Dotenv** - Environment configuration

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **CSS3** - Professional styling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB (running locally or remote)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
MONGO_URI=mongodb://127.0.0.1:27017/legalDashboard
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 🗄️ Database Schema

### Collections

#### Clients
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "phone": String,
  "address": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Cases
```json
{
  "_id": ObjectId,
  "caseTitle": String,
  "clientId": ObjectId,
  "caseType": String,
  "status": "Pending|Ongoing|Closed",
  "startDate": Date,
  "nextHearingDate": Date,
  "priority": "Low|Medium|High",
  "description": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Tasks
```json
{
  "_id": ObjectId,
  "caseId": ObjectId,
  "taskTitle": String,
  "dueDate": Date,
  "status": "Pending|Completed",
  "completionPercentage": Number (0-100),
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Documents
```json
{
  "_id": ObjectId,
  "caseId": ObjectId,
  "documentName": String,
  "documentType": String,
  "status": "Pending|Reviewed|Approved",
  "createdAt": Date,
  "updatedAt": Date
}
```

## 🔌 API Endpoints

### Seed Data
- `POST /api/seed/seed` - Populate database with sample data

### Cases
- `GET /api/cases` - Retrieve all cases
- `GET /api/cases/:id` - Get specific case
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Clients
- `GET /api/clients` - Retrieve all clients
- `GET /api/clients/:id` - Get specific client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Documents
- `GET /api/documents` - Retrieve all documents
- `GET /api/documents/:id` - Get specific document
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Deadlines / Calendar
- `GET /api/deadlines` - Retrieve all deadlines
- `GET /api/deadlines/upcoming?days=30` - Get upcoming deadlines within N days (default 7)
- `POST /api/deadlines` - Create a deadline (body: title, description, date, type, caseId)
- `PUT /api/deadlines/:id` - Update a deadline (mark completed, change date, etc.)
- `DELETE /api/deadlines/:id` - Delete a deadline

WebSocket events (Socket.io): the backend emits these events on changes and reminders:
- `deadlineCreated`, `deadlineUpdated`, `deadlineDeleted` — emitted when deadlines change
- `deadlineReminder` — emitted daily (09:00 server time) with upcoming deadlines within 24 hours

Frontend notes:
- **Calendar**: available on the Dashboard card; use the top controls to switch between day/week/month. Navigate with the arrow buttons or "today". **Click any date to add a new deadline** (enter title/type in prompts); click an event to view its details. Hovering also shows info.
- **Adding/Updating deadlines**: can be done via the API (`POST /api/deadlines`, `PUT /api/deadlines/:id`) or by seeding. Deadlines immediately appear on the calendar and in the Upcoming panel.
- **Upcoming Deadlines panel**: right-hand sidebar shows deadlines due in the next 30 days. Use the export buttons to save this list as Excel or PDF. (Exports rely on `xlsx`, `jspdf` and `html2canvas`.)
- **Timeline**: shows a horizontal view of deadlines. It defaults to a simple static timeline; install `gantt-task-react` with `npm install gantt-task-react` in the frontend to enable the interactive Gantt chart.
- **Notifications panel**: at the top of the sidebar; displays real-time events such as "Deadline created" or reminder alerts. Use the **Test Notification** button or wait for automatic alerts from realtime updates.- **Reminders toast**: when deadlines are detected within 24 hours (either via daily cron or real-time), a toast banner pops up in the bottom-right. Click the ✕ to dismiss.

Quick run (frontend):
```bash
cd frontend
npm install
npm start
```

Quick run (frontend):
```bash
cd frontend
npm install
npm start
```

### Health Check
- `GET /api/health` - Backend health status

## 🎨 UI Features

### Professional Design
- Modern gradient backgrounds
- Responsive grid layouts
- Smooth animations and transitions
- Color-coded status badges
- Clean typography and spacing

### Data Visualization
- Interactive pie charts
- Bar charts for comparisons
- Progress tracking bars
- Statistics cards with icons
- Summary tables with sorting

### User Experience
- Real-time search filtering
- Multi-criteria filtering
- Empty state messaging
- Success/error notifications
- Toggle forms for data entry
- Grid and table view options
- Responsive mobile design

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1400px+)
- Tablet (768px - 1200px)
- Mobile (320px - 768px)

## 🔐 Features Implemented

✅ Database Design (3-4 collections)
✅ RESTful Backend API
✅ React Frontend with Routing
✅ Dynamic Dashboard with Charts
✅ Search & Filter Functionality
✅ CRUD Operations
✅ Professional UI/UX
✅ Responsive Design
✅ Sample Data Seeding
✅ Status Badge System
✅ Progress Tracking
✅ Data Validation
✅ Error Handling

## 🚀 Getting Started Guide

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Seed Sample Data**:
   - Go to Dashboard tab
   - Sample data will automatically seed on first load
   - Or manually call: `POST /api/seed/seed`

4. **Navigate**:
   - Dashboard: View all statistics and charts
   - Cases: Manage legal cases
   - Clients: Manage client information
   - Tasks: Track case-related tasks
   - Documents: Manage case documents

## 💡 Usage Examples

### Adding a Case
1. Go to Cases page
2. Click "Add New Case" button
3. Fill in case details
4. Select status and priority
5. Click "Add Case"

### Tracking Progress
1. Go to Tasks page
2. Create tasks linked to cases
3. Update completion percentage
4. Track overall completion rate

### Managing Documents
1. Go to Documents page
2. Add documents for specific cases
3. Track document status (Pending → Reviewed → Approved)
4. View document workflow progress

## 🎯 Assignment Completion

This project fulfills all requirements:

1. **Database Setup** ✅
   - MongoDB with 4 collections (Clients, Cases, Tasks, Documents)
   - Flexible schema for scalability

2. **Backend Development** ✅
   - Node.js/Express REST API
   - CRUD operations on all collections
   - Proper error handling

3. **Frontend Development** ✅
   - React application with routing
   - Connected to backend API
   - Dynamic data loading

4. **Dashboard Creation** ✅
   - Multiple visualizations (pie, bar charts)
   - Tables for data display
   - Filters and search functionality
   - Interactive elements

## 📞 Support

For issues or questions, please check:
- Backend logs in terminal
- Browser console for frontend errors
- Ensure MongoDB is running
- Verify environment variables

## 📄 License

This project is part of a Full-Stack Web Application Development assignment for Legal Tech Dashboard.
