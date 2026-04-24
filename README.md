# CityResolve  
### Local Community Problem Reporting System  

----

## Overview  
CityResolve is a full-stack web application that enables citizens to report local civic issues and allows authorities to manage and resolve them efficiently. It provides a transparent and scalable solution to bridge the communication gap between citizens and municipal authorities.

**Live Application:** https://city-resolve.vercel.app  
**Repository:** https://github.com/dnvrmhra/CityResolve  

----

## Features  

### Citizen Features    
- Submit complaints with title, category, and description  
- View all complaints  
- Track complaint status (Pending to Resolved)  

### Admin / Authority Features  
- View all complaints in a centralized dashboard  
- Update complaint status  
- Delete invalid or duplicate complaints  
- Manage complaint records efficiently  

----

## Problem Statement  
Traditional complaint systems are often slow, non-transparent, and inefficient. Many rely on manual processes or outdated portals that do not allow real-time tracking.  

CityResolve addresses these issues by:  
- Providing real-time complaint tracking  
- Offering a centralized digital platform  
- Improving transparency and accountability  

----

## Technology Stack  

| Layer       | Technology |
|------------|-----------|
| Frontend   | React.js, Tailwind CSS |
| Backend    | Node.js, Express.js |
| Database   | MongoDB (Mongoose) |
| Deployment | Vercel (Frontend), Render (Backend) |
| Others     | Axios, bcryptjs |

----

## System Architecture  

CityResolve follows a three-tier architecture:  

- Presentation Layer: React.js frontend  
- Application Layer: Node.js and Express.js API  
- Data Layer: MongoDB database  

The frontend communicates with the backend using REST APIs as described in the system design (Page 16). :contentReference[oaicite:1]{index=1}  

----

## Complaint Workflow  

1. User submits a complaint  
2. Request sent via `POST /api/complaints`  
3. Data stored in MongoDB  
4. Admin reviews complaint  
5. Status updated via `PUT /api/complaints/:id`  
6. Updated status reflected to user  

----

## Project Structure  

```
CITYRESOLVE/
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.js
│ └── package.json
│
└── backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── server.js
└── package.json

```

----



----

## Testing  

Testing includes:  
- Unit Testing  
- Integration Testing  
- End-to-End Testing  

Sample test cases (Page 22): :contentReference[oaicite:2]{index=2}  
- Valid complaint → 201 Created  
- Missing token → 401 Unauthorized  
- Invalid ID → 404 Not Found  

----

## Performance  

- Average API response time: ~180 ms  
- Tested under concurrent requests  
- Scalable using MongoDB and cloud deployment  

----

## Challenges and Solutions  

### Challenges  
- CORS issues between frontend and backend  
- MongoDB connection instability  
- API contract mismatches  
- Missing authorization headers  

### Solutions  
- Configured CORS properly  
- Implemented centralized error handling  
- Defined API contract  
- Used Axios instance for token handling  

----

## Results  

- Users can submit complaints in under 3 minutes  
- Clean and responsive UI  
- Real-time complaint tracking  
- Positive user feedback (Page 28) :contentReference[oaicite:3]{index=3}  

----

## Learning Outcomes  

- Full-stack MERN development  
- REST API design  
- MongoDB schema design  
- Cloud deployment (Vercel and Render)  
- Debugging and testing  

----

## Future Scope  

- Geolocation-based complaint mapping  
- Role-Based Access Control (RBAC)  
- Email notifications  
- Mobile application  
- Advanced admin analytics  

----

## Authors  

- Daanveer Mehra (24BAI70059)  
- Priyanshu Kumar (24BAI70070)  

Chandigarh University  
Academic Session: 2026–2027  

----

## License  

This project is intended for academic and educational purposes.  

----
