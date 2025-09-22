# Complete API Testing Guide - All Endpoints

## Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints ✅

### 1.1 User Login
**URL:** `POST http://localhost:5000/api/auth/login`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "admin@sunshinedaycare.com",
  "password": "admin@sunshinedaycare.com"
}
```

### 1.2 User Registration
**URL:** `POST http://localhost:5000/api/auth/register`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
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
  "preferredLanguage": "en",
  "center": "CENTER_ID_HERE"
}
```

### 1.3 Forgot Password
**URL:** `POST http://localhost:5000/api/auth/forgot-password`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### 1.4 Reset Password
**URL:** `POST http://localhost:5000/api/auth/reset-password/RESET_TOKEN`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "password": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

### 1.5 Refresh Token
**URL:** `POST http://localhost:5000/api/auth/refresh-token`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

### 1.6 Change Password
**URL:** `POST http://localhost:5000/api/auth/change-password`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### 1.7 Logout
**URL:** `POST http://localhost:5000/api/auth/logout`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 1.8 Get Current User
**URL:** `GET http://localhost:5000/api/auth/me`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 2. User Management Endpoints ✅

### 2.1 Get User Profile
**URL:** `GET http://localhost:5000/api/users/profile`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 2.2 Update User Profile
**URL:** `PUT http://localhost:5000/api/users/profile`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "John",
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

### 2.3 Change Password
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

### 2.4 Upload Profile Picture
**URL:** `POST http://localhost:5000/api/users/profile-picture`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
**Body:** `form-data` with `image` field

### 2.5 Get All Users (Admin)
**URL:** `GET http://localhost:5000/api/users?role=teacher&center=CENTER_ID&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 2.6 Get User by ID
**URL:** `GET http://localhost:5000/api/users/USER_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 2.7 Update User (Admin)
**URL:** `PUT http://localhost:5000/api/users/USER_ID`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last",
  "role": "teacher",
  "isActive": true
}
```

### 2.8 Delete User (Admin)
**URL:** `DELETE http://localhost:5000/api/users/USER_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## 3. Child Management Endpoints ✅

### 3.1 Get Children (Parent)
**URL:** `GET http://localhost:5000/api/parent/children`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

### 3.2 Get Children (Teacher)
**URL:** `GET http://localhost:5000/api/teacher/children?classId=CLASS_ID&date=2024-01-01`
**Headers:** `Authorization: Bearer YOUR_TEACHER_TOKEN`

### 3.3 Get All Children
**URL:** `GET http://localhost:5000/api/children?centerId=CENTER_ID&classId=CLASS_ID&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 3.4 Get Child by ID
**URL:** `GET http://localhost:5000/api/children/CHILD_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 3.5 Create Child
**URL:** `POST http://localhost:5000/api/children`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "dateOfBirth": "2021-06-15T00:00:00.000Z",
  "gender": "female",
  "parents": ["PARENT_ID"],
  "currentClass": "CLASS_ID",
  "emergencyContacts": [
    {
      "name": "Jane Smith",
      "relationship": "Mother",
      "phone": "+1234567894",
      "email": "jane.smith@gmail.com",
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
    ]
  },
  "dietary": {
    "restrictions": ["Peanuts", "Tree nuts"],
    "preferences": ["Vegetables", "Fruits"],
    "specialInstructions": "No nuts allowed"
  }
}
```

### 3.6 Update Child
**URL:** `PUT http://localhost:5000/api/children/CHILD_ID`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
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

### 3.7 Delete Child (Admin)
**URL:** `DELETE http://localhost:5000/api/children/CHILD_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 3.8 Upload Child Photo
**URL:** `POST http://localhost:5000/api/children/CHILD_ID/photo`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`
**Body:** `form-data` with `image` field

### 3.9 Get Children Statistics
**URL:** `GET http://localhost:5000/api/children/stats/summary?centerId=CENTER_ID&startDate=2024-01-01&endDate=2024-12-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 4. Activity Management Endpoints ✅

### 4.1 Get Activities (Parent)
**URL:** `GET http://localhost:5000/api/parent/activities?childId=CHILD_ID&date=2024-01-01&type=academic&status=completed`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

### 4.2 Get Activities (Teacher)
**URL:** `GET http://localhost:5000/api/teacher/activities?classId=CLASS_ID&date=2024-01-01&type=academic`
**Headers:** `Authorization: Bearer YOUR_TEACHER_TOKEN`

### 4.3 Get All Activities
**URL:** `GET http://localhost:5000/api/activities?centerId=CENTER_ID&teacherId=TEACHER_ID&type=academic&status=completed&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 4.4 Get Activity by ID
**URL:** `GET http://localhost:5000/api/activities/ACTIVITY_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 4.5 Create Activity
**URL:** `POST http://localhost:5000/api/activities`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "title": "Morning Circle Time",
  "description": "Singing songs and sharing stories",
  "startTime": "2024-01-15T09:00:00.000Z",
  "endTime": "2024-01-15T09:30:00.000Z",
  "type": "academic",
  "childrenInvolved": ["CHILD_ID"],
  "location": "Main Classroom",
  "materials": ["Books", "Musical instruments"],
  "notes": "Special focus on sharing",
  "learningObjectives": ["Social skills", "Language development"]
}
```

### 4.6 Update Activity
**URL:** `PUT http://localhost:5000/api/activities/ACTIVITY_ID`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "title": "Morning Circle Time - Updated",
  "description": "Singing songs and sharing stories with focus on numbers",
  "status": "in_progress",
  "materials": ["Books", "Musical instruments", "Number cards"],
  "notes": "Focus on counting and sharing"
}
```

### 4.7 Delete Activity (Admin)
**URL:** `DELETE http://localhost:5000/api/activities/ACTIVITY_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 4.8 Add Activity Update
**URL:** `POST http://localhost:5000/api/activities/ACTIVITY_ID/updates`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "message": "Emma participated well in singing and counting",
  "childId": "CHILD_ID",
  "attachments": ["https://example.com/photo1.jpg"]
}
```

### 4.9 Upload Activity Photo
**URL:** `POST http://localhost:5000/api/activities/photos`
**Headers:** `Authorization: Bearer YOUR_TEACHER_TOKEN`
**Body:** `form-data` with fields:
- `photo`: file
- `activityId`: "ACTIVITY_ID"
- `childId`: "CHILD_ID"
- `description`: "Emma enjoying circle time"

---

## 5. Attendance Management Endpoints ✅

### 5.1 Get Attendance (Parent)
**URL:** `GET http://localhost:5000/api/parent/attendance?childId=CHILD_ID&date=2024-01-01&startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

### 5.2 Get Attendance (Teacher)
**URL:** `GET http://localhost:5000/api/teacher/attendance?classId=CLASS_ID&date=2024-01-01`
**Headers:** `Authorization: Bearer YOUR_TEACHER_TOKEN`

### 5.3 Get All Attendance Records
**URL:** `GET http://localhost:5000/api/attendance?centerId=CENTER_ID&classId=CLASS_ID&date=2024-01-01&status=present&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 5.4 Get Attendance Record by ID
**URL:** `GET http://localhost:5000/api/attendance/ATTENDANCE_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 5.5 Record Attendance
**URL:** `POST http://localhost:5000/api/attendance`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID",
  "classId": "CLASS_ID",
  "date": "2024-01-15T00:00:00.000Z",
  "status": "present",
  "checkInTime": "2024-01-15T08:30:00.000Z",
  "notes": "Child was excited to be back"
}
```

### 5.6 Bulk Attendance Update
**URL:** `POST http://localhost:5000/api/attendance/bulk`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "classId": "CLASS_ID",
  "date": "2024-01-15T00:00:00.000Z",
  "attendance": [
    {
      "childId": "CHILD_ID_1",
      "status": "present",
      "checkInTime": "2024-01-15T08:30:00.000Z",
      "notes": "On time"
    },
    {
      "childId": "CHILD_ID_2",
      "status": "late",
      "checkInTime": "2024-01-15T09:15:00.000Z",
      "notes": "Traffic delay"
    }
  ]
}
```

### 5.7 Check Out Child
**URL:** `PUT http://localhost:5000/api/attendance/ATTENDANCE_ID/checkout`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "checkOutTime": "2024-01-15T15:30:00.000Z",
  "notes": "Child had a great day"
}
```

### 5.8 Update Attendance Record
**URL:** `PUT http://localhost:5000/api/attendance/ATTENDANCE_ID`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "status": "late",
  "checkInTime": "2024-01-15T09:15:00.000Z",
  "notes": "Updated arrival time"
}
```

### 5.9 Delete Attendance Record (Admin)
**URL:** `DELETE http://localhost:5000/api/attendance/ATTENDANCE_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## 6. Communication Endpoints ✅

### 6.1 Get Messages
**URL:** `GET http://localhost:5000/api/communication/messages?recipientId=USER_ID&limit=20&offset=0`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 6.2 Send Message
**URL:** `POST http://localhost:5000/api/communication/messages`
**Headers:** 
- `Authorization: Bearer YOUR_JWT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "recipientId": "USER_ID",
  "content": "Emma had a great day today! She participated well in all activities.",
  "type": "text",
  "attachments": ["https://example.com/photo1.jpg"],
  "metadata": {
    "childId": "CHILD_ID",
    "activityId": "ACTIVITY_ID"
  }
}
```

### 6.3 Mark Message as Read
**URL:** `PUT http://localhost:5000/api/communication/messages/MESSAGE_ID/read`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 6.4 Get Conversations
**URL:** `GET http://localhost:5000/api/communication/conversations`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 6.5 Get Notifications
**URL:** `GET http://localhost:5000/api/communication/notifications?type=activity&isRead=false&limit=10&offset=0`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 6.6 Create Notification
**URL:** `POST http://localhost:5000/api/communication/notifications`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
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

### 6.7 Mark Notification as Read
**URL:** `PUT http://localhost:5000/api/communication/notifications/NOTIFICATION_ID/read`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 6.8 Mark All Notifications as Read
**URL:** `PUT http://localhost:5000/api/communication/notifications/read-all`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 7. Dashboard Statistics Endpoints ✅

### 7.1 Get Parent Dashboard Stats
**URL:** `GET http://localhost:5000/api/parent/dashboard/stats`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

### 7.2 Get Teacher Dashboard Stats
**URL:** `GET http://localhost:5000/api/teacher/dashboard/stats`
**Headers:** `Authorization: Bearer YOUR_TEACHER_TOKEN`

---

## 8. Health Records Endpoints ✅

### 8.1 Get Health Records
**URL:** `GET http://localhost:5000/api/health/records?childId=CHILD_ID&date=2024-01-01&startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 8.2 Get Health Record by ID
**URL:** `GET http://localhost:5000/api/health/records/HEALTH_RECORD_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 8.3 Create Health Record
**URL:** `POST http://localhost:5000/api/health/records`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID",
  "date": "2024-01-15T00:00:00.000Z",
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
        "startTime": "2024-01-15T13:00:00.000Z",
        "endTime": "2024-01-15T14:30:00.000Z",
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
      "time": "2024-01-15T11:00:00.000Z",
      "location": "Playground",
      "actionTaken": "Comforted child, checked for injuries",
      "parentNotified": true,
      "parentNotifiedAt": "2024-01-15T11:05:00.000Z"
    }
  ],
  "notes": "Overall good day with minor incident handled well"
}
```

### 8.4 Update Health Record
**URL:** `PUT http://localhost:5000/api/health/records/HEALTH_RECORD_ID`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "temperature": {
    "value": 99.1,
    "unit": "fahrenheit"
  },
  "symptoms": ["cough", "runny nose", "slight fever"],
  "observations": "Temperature slightly elevated, monitoring closely",
  "notes": "Updated temperature reading"
}
```

### 8.5 Delete Health Record (Admin)
**URL:** `DELETE http://localhost:5000/api/health/records/HEALTH_RECORD_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 8.6 Get Health Statistics
**URL:** `GET http://localhost:5000/api/health/stats?startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 9. Payment Endpoints ✅

### 9.1 Get Payment Status
**URL:** `GET http://localhost:5000/api/payments?childId=CHILD_ID&status=pending&startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 9.2 Get Payment by ID
**URL:** `GET http://localhost:5000/api/payments/PAYMENT_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 9.3 Create Payment (Admin)
**URL:** `POST http://localhost:5000/api/payments`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID",
  "amount": 500.00,
  "currency": "USD",
  "dueDate": "2024-01-01T00:00:00.000Z",
  "description": "Monthly tuition - January 2024",
  "billingType": "monthly",
  "baseAmount": 450.00,
  "additionalFees": [
    {
      "description": "Late pickup fee",
      "amount": 25.00,
      "type": "late_pickup"
    }
  ],
  "discounts": [
    {
      "description": "Sibling discount",
      "amount": 50.00,
      "type": "sibling_discount"
    }
  ],
  "billingPeriod": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  },
  "notes": "Payment due by end of month"
}
```

### 9.4 Update Payment (Admin)
**URL:** `PUT http://localhost:5000/api/payments/PAYMENT_ID`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "amount": 525.00,
  "status": "overdue",
  "notes": "Payment overdue, late fee applied"
}
```

### 9.5 Record Payment (Admin)
**URL:** `POST http://localhost:5000/api/payments/PAYMENT_ID/pay`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "paymentMethod": "bank_transfer",
  "paymentReference": "TXN123456789",
  "transactionId": "TXN123456789",
  "paidAmount": 500.00,
  "notes": "Payment received via bank transfer"
}
```

### 9.6 Get Payment Statistics
**URL:** `GET http://localhost:5000/api/payments/stats/summary?startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 9.7 Delete Payment (Admin)
**URL:** `DELETE http://localhost:5000/api/payments/PAYMENT_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## 10. Report Endpoints ✅

### 10.1 Get Attendance Report
**URL:** `GET http://localhost:5000/api/reports/attendance?childId=CHILD_ID&startDate=2024-01-01&endDate=2024-01-31&format=json`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 10.2 Get Activity Report
**URL:** `GET http://localhost:5000/api/reports/activities?childId=CHILD_ID&startDate=2024-01-01&endDate=2024-01-31&type=academic`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 10.3 Get Payment Report
**URL:** `GET http://localhost:5000/api/reports/payments?childId=CHILD_ID&startDate=2024-01-01&endDate=2024-01-31`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 11. Center Management Endpoints ✅

### 11.1 Register Center (Public)
**URL:** `POST http://localhost:5000/api/centers/register`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "centerData": {
    "name": "Sunshine Daycare Center",
    "type": "daycare",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postalCode": "10001"
    },
    "contactInfo": {
      "phone": "+1234567890",
      "email": "info@sunshinedaycare.com"
    },
    "capacity": 50
  },
  "adminData": {
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@sunshinedaycare.com",
    "phone": "+1234567891",
    "dateOfBirth": "1985-01-01T00:00:00.000Z",
    "gender": "male"
  }
}
```

### 11.2 Get Center Details
**URL:** `GET http://localhost:5000/api/centers/CENTER_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 11.3 Update Center
**URL:** `PUT http://localhost:5000/api/centers/CENTER_ID`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "name": "Updated Center Name",
  "capacity": 60,
  "contactInfo": {
    "phone": "+1234567891",
    "email": "updated@sunshinedaycare.com"
  }
}
```

### 11.4 Get Center Users
**URL:** `GET http://localhost:5000/api/centers/CENTER_ID/users?role=teacher&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 11.5 Create Center User
**URL:** `POST http://localhost:5000/api/centers/CENTER_ID/users`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@sunshinedaycare.com",
  "phone": "+1234567892",
  "role": "teacher",
  "teacherInfo": {
    "qualifications": ["Early Childhood Education"],
    "experience": "5 years",
    "specializations": ["Toddler Development"]
  }
}
```

---

## 12. Class Management Endpoints ✅

### 12.1 Get All Classes
**URL:** `GET http://localhost:5000/api/classes?centerId=CENTER_ID&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 12.2 Get Class by ID
**URL:** `GET http://localhost:5000/api/classes/CLASS_ID`
**Headers:** `Authorization: Bearer YOUR_JWT_TOKEN`

### 12.3 Create Class
**URL:** `POST http://localhost:5000/api/classes`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "name": "Toddler Class",
  "description": "Class for children aged 2-3 years",
  "ageGroup": {
    "minAge": 2,
    "maxAge": 3
  },
  "capacity": 15,
  "schedule": {
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "startTime": "09:00",
    "endTime": "15:00",
    "duration": 360
  },
  "teachers": ["TEACHER_ID"],
  "academicYear": "2024",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "tuition": {
    "monthly": 500.00
  },
  "centerId": "CENTER_ID"
}
```

### 12.4 Update Class
**URL:** `PUT http://localhost:5000/api/classes/CLASS_ID`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "name": "Updated Toddler Class",
  "capacity": 18,
  "teachers": ["TEACHER_ID_1", "TEACHER_ID_2"]
}
```

### 12.5 Delete Class (Admin)
**URL:** `DELETE http://localhost:5000/api/classes/CLASS_ID`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## Testing Workflow Summary

### Complete Testing Order:
1. **Register Center** (public) → Creates center + admin
2. **Login Admin** → Get admin token
3. **Create Class** → Admin creates class
4. **Create Teacher** → Admin creates teacher user
5. **Create Parent** → Admin creates parent user
6. **Login Users** → Get tokens for teacher/parent
7. **Create Child** → Parent creates child
8. **Create Activity** → Teacher creates activity
9. **Record Attendance** → Teacher records attendance
10. **Send Message** → Teacher sends message to parent
11. **Create Health Record** → Teacher creates health record
12. **Generate Reports** → Get various reports
13. **Test All Other Endpoints** → Complete API testing

### Important Notes:
- Replace all placeholder IDs with actual IDs from responses
- Use appropriate JWT tokens for each user role
- All dates should be in ISO 8601 format
- File uploads use `form-data` content type
- Query parameters are optional for filtering
- All endpoints return JSON responses with `status`, `message`, and `data` fields

This comprehensive guide covers all 40+ endpoints with complete request/response examples! 🚀
