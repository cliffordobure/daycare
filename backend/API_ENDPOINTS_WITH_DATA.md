# Complete API Endpoints with Test Data

## Base URL
```
http://localhost:5000/api
```

---

## 1. Authentication Endpoints

### Register User
**URL:** `POST http://localhost:5000/api/auth/register`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Johnson",
  "lastName": "Smith",
  "email": "johnson@gmail.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "role": "parent",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  },
  "preferredLanguage": "en"
}
```

### Login User
**URL:** `POST http://localhost:5000/api/auth/login`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "johnson@gmail.com",
  "password": "TestPass123!"
}
```

### Refresh Token
**URL:** `POST http://localhost:5000/api/auth/refresh-token`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

### Forgot Password
**URL:** `POST http://localhost:5000/api/auth/forgot-password`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "johnson@gmail.com"
}
```

---

## 2. User Management Endpoints

### Get User Profile
**URL:** `GET http://localhost:5000/api/users/profile`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Update User Profile
**URL:** `PUT http://localhost:5000/api/users/profile`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Johnson",
  "lastName": "Smith",
  "phone": "+1234567891",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "gender": "male",
  "address": {
    "street": "456 Oak Ave",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10002"
  },
  "preferredLanguage": "en"
}
```

### Change Password
**URL:** `PUT http://localhost:5000/api/users/change-password`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "currentPassword": "TestPass123!",
  "newPassword": "NewPass123!"
}
```

### Upload Profile Picture
**URL:** `POST http://localhost:5000/api/users/profile-picture`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
**Body:** `form-data` with `image` field

---

## 3. Child Management Endpoints

### Get Children (Parent)
**URL:** `GET http://localhost:5000/api/parent/children`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Children (Teacher)
**URL:** `GET http://localhost:5000/api/teacher/children?classId=60f7b3b3b3b3b3b3b3b3b3b3&date=2023-01-01`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Create Child
**URL:** `POST http://localhost:5000/api/children`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "dateOfBirth": "2019-01-01T00:00:00.000Z",
  "gender": "female",
  "parentId": "YOUR_USER_ID",
  "parents": ["YOUR_USER_ID"],
  "centerId": "YOUR_CENTER_ID",
  "emergencyContacts": [
    {
      "name": "Jane Smith",
      "relationship": "Mother",
      "phone": "+1234567890",
      "email": "jane@example.com",
      "isPrimary": true
    }
  ],
  "health": {
    "allergies": [
      {
        "allergen": "Peanuts",
        "severity": "severe",
        "symptoms": ["Swelling", "Difficulty breathing"],
        "treatment": "Epinephrine",
        "emergencyAction": "Call 911 immediately"
      }
    ],
    "medicalConditions": [
      {
        "condition": "Asthma",
        "diagnosis": "Mild asthma",
        "diagnosedDate": "2020-01-01T00:00:00.000Z",
        "treatment": "Inhaler as needed",
        "notes": "Child responds well to treatment"
      }
    ]
  },
  "dietary": {
    "restrictions": ["Peanuts", "Tree nuts"],
    "preferences": ["Vegetables", "Fruits"],
    "specialInstructions": "No nuts allowed"
  }
}
```

### Get Child by ID
**URL:** `GET http://localhost:5000/api/children/CHILD_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Update Child
**URL:** `PUT http://localhost:5000/api/children/CHILD_ID`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "dateOfBirth": "2019-01-01T00:00:00.000Z",
  "gender": "female",
  "health": {
    "allergies": [
      {
        "allergen": "Peanuts",
        "severity": "severe",
        "symptoms": ["Swelling", "Difficulty breathing"],
        "treatment": "Epinephrine",
        "emergencyAction": "Call 911 immediately"
      },
      {
        "allergen": "Dairy",
        "severity": "mild",
        "symptoms": ["Rash"],
        "treatment": "Antihistamine",
        "emergencyAction": "Monitor symptoms"
      }
    ]
  }
}
```

### Upload Child Photo
**URL:** `POST http://localhost:5000/api/children/CHILD_ID/photo`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
**Body:** `form-data` with `image` field

---

## 4. Activity Management Endpoints

### Get Activities (Parent)
**URL:** `GET http://localhost:5000/api/parent/activities?childId=CHILD_ID&date=2023-01-01&type=academic&status=completed`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Activities (Teacher)
**URL:** `GET http://localhost:5000/api/teacher/activities`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Create Activity
**URL:** `POST http://localhost:5000/api/activities`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "title": "Morning Circle Time",
  "description": "Singing songs and sharing stories",
  "startTime": "2023-01-01T09:00:00.000Z",
  "endTime": "2023-01-01T09:30:00.000Z",
  "type": "academic",
  "childrenInvolved": ["CHILD_ID"],
  "location": "Main Classroom",
  "materials": ["Books", "Musical instruments"],
  "notes": "Special focus on sharing"
}
```

### Get Activity by ID
**URL:** `GET http://localhost:5000/api/activities/ACTIVITY_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Update Activity
**URL:** `PUT http://localhost:5000/api/activities/ACTIVITY_ID`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "title": "Morning Circle Time - Updated",
  "description": "Singing songs and sharing stories with focus on numbers",
  "startTime": "2023-01-01T09:00:00.000Z",
  "endTime": "2023-01-01T09:45:00.000Z",
  "type": "academic",
  "status": "in_progress",
  "location": "Main Classroom",
  "materials": ["Books", "Musical instruments", "Number cards"],
  "notes": "Focus on counting and sharing"
}
```

### Add Activity Update
**URL:** `POST http://localhost:5000/api/activities/ACTIVITY_ID/updates`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "message": "Emma participated well in singing and counting",
  "childId": "CHILD_ID",
  "attachments": ["https://example.com/photo1.jpg"]
}
```

### Upload Activity Photo
**URL:** `POST http://localhost:5000/api/activities/photos`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
**Body:** `form-data` with fields:
- `photo`: file
- `activityId`: "ACTIVITY_ID"
- `childId`: "CHILD_ID"
- `description`: "Emma enjoying circle time"

---

## 5. Attendance Management Endpoints

### Get Attendance (Parent)
**URL:** `GET http://localhost:5000/api/parent/attendance?childId=CHILD_ID&date=2023-01-01&startDate=2023-01-01&endDate=2023-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Attendance (Teacher)
**URL:** `GET http://localhost:5000/api/teacher/attendance?classId=60f7b3b3b3b3b3b3b3b3b3b3&date=2023-01-01`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Record Attendance
**URL:** `POST http://localhost:5000/api/attendance`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID",
  "classId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2023-01-01T00:00:00.000Z",
  "status": "present",
  "checkInTime": "2023-01-01T08:30:00.000Z",
  "notes": "Child was excited to be back"
}
```

### Bulk Attendance Update
**URL:** `POST http://localhost:5000/api/attendance/bulk`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "classId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2023-01-01T00:00:00.000Z",
  "attendance": [
    {
      "childId": "CHILD_ID",
      "status": "present",
      "checkInTime": "2023-01-01T08:30:00.000Z",
      "notes": "On time"
    },
    {
      "childId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "status": "late",
      "checkInTime": "2023-01-01T09:15:00.000Z",
      "notes": "Traffic delay"
    }
  ]
}
```

### Check Out Child
**URL:** `PUT http://localhost:5000/api/attendance/ATTENDANCE_ID/checkout`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "checkOutTime": "2023-01-01T15:30:00.000Z",
  "notes": "Child had a great day"
}
```

---

## 6. Communication Endpoints

### Get Messages
**URL:** `GET http://localhost:5000/api/communication/messages?recipientId=60f7b3b3b3b3b3b3b3b3b3b5&limit=20&offset=0`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Send Message
**URL:** `POST http://localhost:5000/api/communication/messages`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "recipientId": "60f7b3b3b3b3b3b3b3b3b3b5",
  "content": "Emma had a great day today! She participated well in all activities.",
  "type": "text",
  "attachments": ["https://example.com/photo1.jpg"],
  "metadata": {
    "childId": "CHILD_ID",
    "activityId": "ACTIVITY_ID"
  }
}
```

### Get Conversations
**URL:** `GET http://localhost:5000/api/communication/conversations`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Notifications
**URL:** `GET http://localhost:5000/api/communication/notifications?type=activity&isRead=false&limit=10&offset=0`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Create Notification
**URL:** `POST http://localhost:5000/api/communication/notifications`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "title": "Activity Update",
  "message": "Emma participated in circle time",
  "type": "activity",
  "priority": "medium",
  "recipientId": "USER_ID",
  "childId": "CHILD_ID",
  "activityId": "ACTIVITY_ID",
  "attachments": ["https://example.com/photo1.jpg"]
}
```

### Mark All Notifications as Read
**URL:** `PUT http://localhost:5000/api/communication/notifications/read-all`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 7. Dashboard Endpoints

### Get Parent Dashboard Stats
**URL:** `GET http://localhost:5000/api/parent/dashboard/stats`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Teacher Dashboard Stats
**URL:** `GET http://localhost:5000/api/teacher/dashboard/stats`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 8. Health Records Endpoints

### Get Health Records
**URL:** `GET http://localhost:5000/api/health/records?childId=CHILD_ID&date=2023-01-01&startDate=2023-01-01&endDate=2023-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Create Health Record
**URL:** `POST http://localhost:5000/api/health/records`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID",
  "date": "2023-01-01T00:00:00.000Z",
  "temperature": {
    "value": 98.6,
    "unit": "fahrenheit"
  },
  "symptoms": ["cough", "runny nose"],
  "observations": "Child seems tired but in good spirits",
  "medications": [
    {
      "name": "Children's Tylenol",
      "dosage": "5ml",
      "frequency": "Every 6 hours",
      "notes": "Given at 10:00 AM"
    }
  ],
  "meals": [
    {
      "mealType": "breakfast",
      "items": ["Oatmeal", "Banana"],
      "amount": "most",
      "notes": "Ate well"
    }
  ],
  "sleep": {
    "napTimes": [
      {
        "startTime": "2023-01-01T13:00:00.000Z",
        "endTime": "2023-01-01T14:30:00.000Z",
        "duration": 90,
        "quality": "good",
        "notes": "Slept peacefully"
      }
    ],
    "totalSleepTime": 90,
    "sleepQuality": "good"
  },
  "behavior": {
    "mood": "happy",
    "energyLevel": "normal",
    "socialInteraction": "active",
    "notes": "Very social today, played well with others"
  },
  "physicalActivity": {
    "outdoorTime": 60,
    "indoorActivity": ["Blocks", "Drawing", "Story time"],
    "notes": "Active play both indoors and outdoors"
  },
  "incidents": [
    {
      "type": "fall",
      "description": "Minor fall during outdoor play",
      "severity": "minor",
      "time": "2023-01-01T11:00:00.000Z",
      "location": "Playground",
      "actionTaken": "Comforted child, checked for injuries",
      "parentNotified": true,
      "parentNotifiedAt": "2023-01-01T11:05:00.000Z"
    }
  ],
  "notes": "Overall good day with minor incident handled well"
}
```

### Get Health Statistics
**URL:** `GET http://localhost:5000/api/health/stats?startDate=2023-01-01&endDate=2023-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 9. Payment Endpoints

### Get Payment Status
**URL:** `GET http://localhost:5000/api/payments?childId=CHILD_ID&status=pending&startDate=2023-01-01&endDate=2023-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Payment Statistics
**URL:** `GET http://localhost:5000/api/payments/stats/summary?startDate=2023-01-01&endDate=2023-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 10. Report Endpoints

### Get Attendance Report
**URL:** `GET http://localhost:5000/api/reports/attendance?childId=CHILD_ID&startDate=2023-01-01&endDate=2023-01-31&format=json`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Activity Report
**URL:** `GET http://localhost:5000/api/reports/activities?childId=CHILD_ID&startDate=2023-01-01&endDate=2023-01-31&type=academic`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### Get Payment Report
**URL:** `GET http://localhost:5000/api/reports/payments?childId=CHILD_ID&startDate=2023-01-01&endDate=2023-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## Testing Workflow

### Step 1: Start Server
```bash
cd backend
npm start
```

### Step 2: Test Authentication
1. **Register:** `POST http://localhost:5000/api/auth/register`
2. **Login:** `POST http://localhost:5000/api/auth/login` (save the JWT token)

### Step 3: Test with Token
Use the JWT token from login in the `Authorization: Bearer YOUR_JWT_TOKEN` header for all protected endpoints.

### Step 4: Test Complete Flow
1. Create a child
2. Create an activity
3. Record attendance
4. Send a message
5. Create health record
6. Generate reports

---

## Important Notes

- Replace `YOUR_JWT_TOKEN` with the actual token from login
- Replace `CHILD_ID`, `ACTIVITY_ID`, `USER_ID` with actual IDs from responses
- All dates should be in ISO 8601 format
- File uploads use `form-data` content type
- Query parameters are optional for filtering
- All endpoints return JSON responses with `status`, `message`, and `data` fields
