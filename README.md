# MTO Maintenance Plan Dashboard

A comprehensive equipment maintenance planning and management system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### Equipment Management
- Manage four categories of equipment:
  - **B Vehicles** - Heavy transport vehicles
  - **C Vehicles** - Light commercial vehicles  
  - **Plant Equipment** - Construction and industrial machinery
  - **Generator Sets** - Power generation equipment

### Maintenance Scheduling
- Flexible maintenance frequencies:
  - Weekly
  - Fortnightly
  - Monthly
  - Quarterly
- Task assignment and tracking
- Driver nominations for vehicle maintenance
- Due date monitoring and overdue alerts

### Dashboard & Analytics
- Real-time maintenance status overview
- Equipment categorization statistics
- Task completion tracking
- Overdue maintenance alerts
- Upcoming maintenance notifications

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend  
- **React** - User interface library
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API calls

## Project Structure

```
MTO Maint Plan/
├── backend/
│   ├── models/          # Database schemas
│   │   ├── driver.model.js
│   │   ├── equipment.model.js
│   │   └── maintenance.model.js
│   ├── routes/          # API endpoints
│   │   ├── drivers.js
│   │   ├── equipment.js
│   │   └── maintenance.js
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EquipmentManager.jsx
│   │   │   ├── DriverManager.jsx
│   │   │   └── MaintenanceScheduler.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── data/               # Sample data files
    ├── sample_equipment.csv
    ├── sample_drivers.csv
    └── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)

### Installation

1. **Clone or download the project**
   ```bash
   cd "MTO Maint Plan"
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   - Edit `backend/.env` file
   - Add your MongoDB connection string:
     ```
     ATLAS_URI=your_mongodb_connection_string
     PORT=5000
     ```

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on: http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on: http://localhost:5173

### Database Setup

#### Option 1: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env` file

#### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/mto_maintenance`

## API Endpoints

### Equipment
- `GET /equipment` - Get all equipment
- `POST /equipment/add` - Add new equipment

### Drivers  
- `GET /drivers` - Get all drivers
- `POST /drivers/add` - Add new driver

### Maintenance
- `GET /maintenance` - Get all maintenance tasks
- `POST /maintenance/add` - Create new maintenance task
- `GET /maintenance/:id` - Get specific task
- `POST /maintenance/update/:id` - Update task status

## Data Models

### Equipment
```javascript
{
  name: String,
  category: String // 'B Vehicle', 'C Vehicle', 'Plant', 'Generator Set'
}
```

### Driver
```javascript
{
  name: String
}
```

### Maintenance
```javascript
{
  equipment: ObjectId,     // Reference to Equipment
  driver: ObjectId,        // Reference to Driver (optional)
  task: String,           // Task description
  frequency: String,      // 'Weekly', 'Fortnightly', 'Monthly', 'Quarterly'
  dueDate: Date,
  isCompleted: Boolean
}
```

## Deployment Options

### Option 1: Heroku (Backend) + Vercel (Frontend)
1. **Backend to Heroku:**
   - Create Heroku app
   - Connect to GitHub repository
   - Set environment variables
   - Deploy

2. **Frontend to Vercel:**
   - Connect Vercel to GitHub repository
   - Update API base URL to Heroku backend
   - Deploy

### Option 2: Full Stack Hosting
- **Railway** - Single deployment for both frontend and backend
- **Render** - Free hosting with database included
- **DigitalOcean App Platform** - Scalable cloud hosting

### Option 3: Container Deployment
- Create Docker containers
- Deploy to AWS ECS, Google Cloud Run, or Azure Container Instances

## Features to Implement

### Phase 1 (Current)
- ✅ Equipment management
- ✅ Driver management  
- ✅ Maintenance scheduling
- ✅ Dashboard overview

### Phase 2 (Future Enhancements)
- 📁 CSV import functionality
- 📊 Advanced reporting and analytics
- 📧 Email notifications for due maintenance
- 📱 Mobile-responsive design improvements
- 🔐 User authentication and roles
- 📈 Maintenance cost tracking
- 🔍 Advanced search and filtering
- 📅 Calendar view for maintenance schedule

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Note:** This application is designed to replace spreadsheet-based maintenance planning with a modern, web-based solution that can be accessed from anywhere and provides real-time collaboration capabilities.