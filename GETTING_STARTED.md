# 🚀 Getting Started with Legal Tech Dashboard

## Quick Start (5 minutes)

### Requirements
- Node.js (v14 or higher)
- MongoDB (running locally or connection string ready)
- Code Editor (VS Code recommended)

### Step 1: Verify MongoDB
Ensure MongoDB is running. If local:
```bash
# Start MongoDB locally
mongod
```

### Step 2: Setup Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend runs on http://localhost:5000

### Step 3: Setup Frontend (New Terminal/Tab)
```bash
cd frontend
npm install
npm start
```
✅ Frontend runs on http://localhost:3000

### Step 4: View Application
Open your browser to http://localhost:3000

---

## 📋 Initial Setup Steps

### 1️⃣ Backend Configuration

**Navigate to backend:**
```bash
cd c:\SEM-6\Aparna-Shegade\backend
```

**Check `.env` file exists:**
```env
MONGO_URI=mongodb://127.0.0.1:27017/legalDashboard
PORT=5000
```

**Install dependencies:**
```bash
npm install
```

**Start server:**
```bash
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected
```

---

### 2️⃣ Frontend Configuration

**Navigate to frontend:**
```bash
cd c:\SEM-6\Aparna-Shegade\frontend
```

**Install dependencies:**
```bash
npm install
```

**Start development server:**
```bash
npm start
```

Expected: Browser opens automatically to http://localhost:3000

---

## 🎯 Using the Application

### Dashboard (Home Page)
- **View**: Real-time statistics, charts, and data visualizations
- **Charts**: Case status, document status, task completion rates
- **Stats**: Total cases, active cases, completed tasks, pending documents
- **Auto-seeding**: Sample data loads automatically on first visit

### Cases Management
1. Click "Cases" in navigation
2. View all legal cases in a professional table
3. **Add New Case**:
   - Click "➕ Add New Case" button
   - Fill in case details (title, type, status, priority)
   - Click "✓ Add Case"
4. **Search & Filter**:
   - Search by title or description
   - Filter by status (Pending, Ongoing, Closed)
   - Filter by priority (Low, Medium, High)
   - Filter by case type
5. **Delete**: Click "🗑️ Delete" to remove a case

### Clients Management
1. Click "Clients" in navigation
2. View all clients in grid layout and detailed table
3. **Add New Client**:
   - Click "➕ Add New Client"
   - Enter name, email, phone, address
   - Click "✓ Add Client"
4. **Search**: Find clients by name, email, or phone
5. **Contact**: Click email/phone for quick contact links
6. **Delete**: Remove clients with "🗑️ Delete"

### Tasks Management
1. Click "Tasks" in navigation
2. View task statistics at top
3. **Add New Task**:
   - Select a case from dropdown
   - Enter task title and due date
   - Select status (Pending/Completed)
   - Set completion percentage (0-100%)
   - Click "✓ Add Task"
4. **Track Progress**: 
   - See visual progress bars
   - Monitor overall completion rate
5. **Filter**: 
   - Search by task name
   - Filter by status

### Documents Management
1. Click "Documents" in navigation
2. View document statistics
3. **Add New Document**:
   - Select associated case
   - Enter document name and type
   - Select status (Pending, Reviewed, Approved)
   - Click "✓ Add Document"
4. **View**: 
   - Grid layout for quick browsing
   - Detailed table for complete info
5. **Track Workflow**: Monitor document status through approval process
6. **Filter**: Search by name/type and filter by status

---

## 📊 Dashboard Features

### Statistics Cards
- **Total Cases**: All legal cases in system
- **Active Cases**: Cases currently ongoing
- **Completed Tasks**: Tasks marked as completed
- **Pending Documents**: Documents awaiting review/approval

### Charts Available
1. **Pie Charts**:
   - Case Status Distribution
   - Document Status Distribution
   - Task Completion Rate

2. **Bar Charts**:
   - Cases by Type
   - Cases by Priority

3. **Tables**:
   - Recent Cases Overview
   - Summary Statistics

---

## 🔍 Search & Filter Guide

### Quick Search
- Search bars accept partial text matches
- Real-time filtering as you type
- Case-insensitive search

### Advanced Filters
- **Multi-criteria**: Combine search + multiple filters
- **Status Filters**: Show only items with specific status
- **Priority Filters**: Organize by importance
- **Type Filters**: Group by category

### Example Searches
- Search "contract" → finds cases with "contract" in title
- Filter "High" priority → shows only high-priority items
- Filter "Approved" status → shows only approved documents

---

## ⚙️ Troubleshooting

### Backend Not Starting
❌ Problem: `Port 5000 already in use`
✅ Solution: 
- Change PORT in `.env` to 5001
- Or kill process on port 5000

❌ Problem: `MongoDB connection failed`
✅ Solution:
- Verify MongoDB is running
- Check MONGO_URI in `.env`
- Try `mongod` in another terminal

### Frontend Not Loading
❌ Problem: `Cannot GET /api/...`
✅ Solution:
- Ensure backend is running
- Check backend URL in `frontend/src/services/api.js`
- Verify CORS is enabled

❌ Problem: `Blank page loading`
✅ Solution:
- Check browser console for errors
- Clear browser cache
- Try incognito/private window

### Data Not Appearing
❌ Problem: `Empty tables/no data showing`
✅ Solution:
- Dashboard auto-seeds on first load
- Or manually POST to `/api/seed/seed`
- Add data through UI forms
- Check MongoDB has the `legalDashboard` database

---

## 📝 API Quick Reference

### Test Endpoints

**Health Check:**
```
GET http://localhost:5000/api/health
```

**Fetch All Data:**
```
GET http://localhost:5000/api/cases
GET http://localhost:5000/api/clients
GET http://localhost:5000/api/tasks
GET http://localhost:5000/api/documents
```

**Seed Sample Data:**
```
POST http://localhost:5000/api/seed/seed
```

---

## 💾 Sample Data

The application includes sample data for 6 cases:
1. **Smith v. Johnson** - Civil lawsuit
2. **Estate Planning Matter** - Estate management
3. **ABC Corp Merger** - Corporate transaction
4. **Intellectual Property Dispute** - Patent case
5. **Employment Contract Review** - HR matter
6. **Real Estate Transaction** - Property deal

Plus:
- 5 sample clients
- 8 sample tasks with progress tracking
- 10 sample documents in various states

---

## 🎨 UI/UX Highlights

### Color Scheme
- **Primary**: Professional blue (#2c3e50)
- **Success**: Green (#27ae60)
- **Warning**: Orange (#f39c12)
- **Danger**: Red (#e74c3c)

### Status Badges
- 🟨 **Pending**: Yellow background
- 🟩 **Approved/Completed**: Green background
- 🟦 **Ongoing/Reviewed**: Blue background
- 🟥 **Closed**: Red background

### Responsive Features
- Desktop: Full layout
- Tablet: Optimized grid
- Mobile: Single column, touch-friendly

---

## 📱 Mobile Access

The dashboard is fully responsive:
1. All features work on mobile
2. Touch-friendly buttons
3. Optimized form inputs
4. Responsive tables convert to mobile format

---

## 🔐 Security Notes

- Monitor production MONGO_URI
- Set strong database credentials
- Enable HTTPS for production
- Validate all user inputs
- Implement authentication/authorization

---

## 💡 Advanced Tips

### Performance
- Use search/filters for large datasets
- Dashboard loads efficiently
- Pagination recommended for 1000+ items

### Data Organization
- Use meaningful case titles
- Consistent document naming
- Regular status updates
- Progress tracking for tasks

### Best Practices
- Set realistic due dates
- Keep descriptions concise
- Update task progress regularly
- Archive closed cases periodically

---

## 📞 Need Help?

1. **Check browser console** for error messages
2. **Review backend logs** in terminal
3. **Verify MongoDB connection**
4. **Clear cache and restart**
5. **Check file permissions** (if modified files)

---

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend started (port 5000)
- [ ] Frontend started (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Sample data visible in dashboard
- [ ] Can add new items
- [ ] Search/filter working
- [ ] Charts displaying properly

---

## 🚀 Ready to Go!

Your Legal Tech Dashboard is fully set up and ready to use. Start exploring all the features and enjoy the professional interface designed for managing legal operations efficiently! 

**Happy coding! 💻**
