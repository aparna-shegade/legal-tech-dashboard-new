# ⚡ Quick Reference Guide

## 🚀 Start Application (3 Steps)

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ Runs on `http://localhost:5000`

### Terminal 2: Frontend
```bash
cd frontend
npm start
```
✅ Runs on `http://localhost:3000`

### Verify
- Open browser to `http://localhost:3000`
- Dashboard loads with sample data
- See charts and statistics

---

## 📍 Navigation

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | View statistics & charts |
| Cases | `/cases` | Manage legal cases |
| Clients | `/clients` | Manage clients |
| Tasks | `/tasks` | Track tasks & progress |
| Documents | `/documents` | Manage documents |

---

## 🎯 Common Tasks

### Add a Case
1. Click "Cases"
2. Click "➕ Add New Case"
3. Fill form (title, type, status, priority)
4. Click "✓ Add Case"

### Find Cases
1. Use search bar to type
2. Use filters for status/priority/type
3. Results update in real-time

### Track Progress
1. Click "Tasks"
2. Create task linked to case
3. Set completion percentage (0-100%)
4. See progress bar update

### Review Documents
1. Click "Documents"
2. Add documents to cases
3. Track status: Pending → Reviewed → Approved
4. Monitor document statistics

---

## 📊 Data Displayed

### Dashboard
- 4 stat cards (cases, tasks, documents)
- 5 interactive charts
- Recent cases table
- Summary statistics

### Cases Table
- Title, Type, Status, Priority
- Start Date, Next Hearing
- Color-coded badges

### Clients
- Grid cards (name, email, phone, address)
- Detailed table view
- Contact links

### Tasks
- Title, Case, Status, Due Date
- Visual progress bars
- Completion percentage

### Documents
- Name, Type, Case, Status
- Grid and table views
- Creation date

---

## 🔍 Search & Filter Tips

### Search
- Real-time as you type
- Case-insensitive
- Matches any part of text

### Filters
- Combine multiple filters
- Status (Pending, Ongoing, Closed)
- Priority (Low, Medium, High)
- Type (various options)

### Example
Search: "contract"
Filter: Status = "Ongoing"
Result: All ongoing cases with "contract" in title

---

## 🎨 Color Key

| Color | Meaning |
|-------|---------|
| 🔵 Blue | Primary/Info |
| 🟢 Green | Success/Completed |
| 🟡 Orange | Warning/Pending |
| 🔴 Red | Danger/Closed |

---

## ⚙️ API Endpoints

### Test Backend
```bash
curl http://localhost:5000/api/health
```

### Seed Data
```bash
POST http://localhost:5000/api/seed/seed
```

### Get Data
```bash
GET http://localhost:5000/api/cases
GET http://localhost:5000/api/clients
GET http://localhost:5000/api/tasks
GET http://localhost:5000/api/documents
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Kill process or use different port |
| MongoDB error | Start `mongod` in another terminal |
| Blank page | Clear cache, restart, check console |
| No data showing | Dashboard seed table auto-populates |
| API not working | Check backend is running on 5000 |

---

## 📁 File Structure

```
project/
├── backend/
│   ├── config/db.js
│   ├── models/ (Case, Client, Task, Document)
│   ├── controllers/ (CRUD logic)
│   ├── routes/ (API endpoints)
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/ (Dashboard, Cases, etc.)
│   │   ├── components/ (Navbar)
│   │   ├── services/ (API calls)
│   │   ├── styles.css
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## ✅ Verification

- [ ] Backend running on 5000
- [ ] Frontend running on 3000
- [ ] Can access dashboard
- [ ] Data visible in tables
- [ ] Search works
- [ ] Filters work
- [ ] Can add items
- [ ] Can delete items
- [ ] Charts display
- [ ] Responsive on mobile

---

## 💡 Pro Tips

1. **Dashboard Auto-Seed**: Sample data loads on first visit
2. **Multiple Browsers**: Open both frontend and backend URLs
3. **Search First**: Use search before scrolling large tables
4. **Filter Combine**: Use search + filters together
5. **Progress Tracking**: Update task percentage for visual progress
6. **Status Workflow**: Follow Pending → Reviewed → Approved
7. **Contact Links**: Click email/phone for quick contact

---

## 📋 Sample Data

### Pre-loaded Cases (6)
- Smith v. Johnson
- Estate Planning
- ABC Corp Merger
- IP Dispute
- Employment Review
- Real Estate Deal

### Pre-loaded Clients (5)
- John Doe
- Jane Smith
- ABC Corp
- Sarah Johnson
- Tech Inc

### Pre-loaded Tasks (8)
- Various tasks at different completion levels

### Pre-loaded Documents (10)
- Various documents in different statuses

---

## 🎓 What You're Learning

- Full-stack development
- MongoDB database design
- Express REST API
- React components
- Data visualization
- UI/UX design
- State management
- API integration

---

## 📞 Support

1. Check browser console for errors
2. Review backend terminal output
3. Verify MongoDB is running
4. Read GETTING_STARTED.md for detailed help
5. Check FEATURES.md for complete overview

---

## 🎉 You're All Set!

Your Legal Tech Dashboard is ready to use. Explore all features, add your own data, and customize as needed!

**Happy exploring!** 🚀
