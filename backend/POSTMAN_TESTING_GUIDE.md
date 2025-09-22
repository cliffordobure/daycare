# Postman Testing Guide - Daycare Management API

## Base Configuration
- **Base URL**: `http://localhost:5000/api` (for local testing)
- **Production URL**: `https://daycare-kvoi.onrender.com/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

## Environment Variables Setup
Create these environment variables in Postman:
- `base_url`: `http://localhost:5000/api`
- `token`: (will be set after login)
- `user_id`: (will be set after login)
- `child_id`: (will be set after creating a child)
- `activity_id`: (will be set after creating an activity)
- `center_id`: (will be set after login)

---

## 1. Authentication Endpoints

### 1.1 User Registration
**POST** `{{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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
  "preferredLanguage": "en"
}
```

**Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.environment.set("user_id", response.data.user.id);
}
```

### 1.2 User Login
**POST** `{{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john.doe@example.com",
  "password": "TestPass123!"
}
```

**Test Script:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.environment.set("user_id", response.data.user.id);
    pm.environment.set("center_id", response.data.user.center);
}
```

### 1.3 Refresh Token
**POST** `{{base_url}}/auth/refresh-token`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

### 1.4 Forgot Password
**POST** `{{base_url}}/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john.doe@example.com"
}
```

---

## 2. User Management Endpoints

### 2.1 Get User Profile
**GET** `{{base_url}}/users/profile`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 2.2 Update User Profile
**PUT** `{{base_url}}/users/profile`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
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
**PUT** `{{base_url}}/users/change-password`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "currentPassword": "TestPass123!",
  "newPassword": "NewPass123!"
}
```

### 2.4 Upload Profile Picture
**POST** `{{base_url}}/users/profile-picture`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (form-data):**
```
image: [Select a file]
```

---

## 3. Child Management Endpoints

### 3.1 Get Children (Parent)
**GET** `{{base_url}}/parent/children`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 3.2 Get Children (Teacher)
**GET** `{{base_url}}/teacher/children`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
classId: 60f7b3b3b3b3b3b3b3b3b3b3
date: 2023-01-01
```

### 3.3 Create Child
**POST** `{{base_url}}/children`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "Emma",
  "lastName": "Doe",
  "dateOfBirth": "2019-01-01T00:00:00.000Z",
  "gender": "female",
  "parentId": "{{user_id}}",
  "parents": ["{{user_id}}"],
  "centerId": "{{center_id}}",
  "emergencyContacts": [
    {
      "name": "Jane Doe",
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

**Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("child_id", response.data.child._id);
}
```

### 3.4 Get Child by ID
**GET** `{{base_url}}/children/{{child_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 3.5 Update Child
**PUT** `{{base_url}}/children/{{child_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
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

### 3.6 Upload Child Photo
**POST** `{{base_url}}/children/{{child_id}}/photo`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (form-data):**
```
image: [Select a file]
```

---

## 4. Activity Management Endpoints

### 4.1 Get Activities (Parent)
**GET** `{{base_url}}/parent/activities`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
date: 2023-01-01
type: academic
status: completed
```

### 4.2 Get Activities (Teacher)
**GET** `{{base_url}}/teacher/activities`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 4.3 Create Activity
**POST** `{{base_url}}/activities`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Morning Circle Time",
  "description": "Singing songs and sharing stories",
  "startTime": "2023-01-01T09:00:00.000Z",
  "endTime": "2023-01-01T09:30:00.000Z",
  "type": "academic",
  "childrenInvolved": ["{{child_id}}"],
  "location": "Main Classroom",
  "materials": ["Books", "Musical instruments"],
  "notes": "Special focus on sharing"
}
```

**Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("activity_id", response.data.activity._id);
}
```

### 4.4 Get Activity by ID
**GET** `{{base_url}}/activities/{{activity_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 4.5 Update Activity
**PUT** `{{base_url}}/activities/{{activity_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
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

### 4.6 Add Activity Update
**POST** `{{base_url}}/activities/{{activity_id}}/updates`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "message": "Emma participated well in singing and counting",
  "childId": "{{child_id}}",
  "attachments": ["https://example.com/photo1.jpg"]
}
```

### 4.7 Upload Activity Photo
**POST** `{{base_url}}/activities/photos`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (form-data):**
```
photo: [Select a file]
activityId: {{activity_id}}
childId: {{child_id}}
description: Emma enjoying circle time
```

---

## 5. Attendance Management Endpoints

### 5.1 Get Attendance (Parent)
**GET** `{{base_url}}/parent/attendance`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
date: 2023-01-01
startDate: 2023-01-01
endDate: 2023-01-31
```

### 5.2 Get Attendance (Teacher)
**GET** `{{base_url}}/teacher/attendance`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 5.3 Record Attendance
**POST** `{{base_url}}/attendance`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "childId": "{{child_id}}",
  "classId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2023-01-01T00:00:00.000Z",
  "status": "present",
  "checkInTime": "2023-01-01T08:30:00.000Z",
  "notes": "Child was excited to be back"
}
```

### 5.4 Bulk Attendance Update
**POST** `{{base_url}}/attendance/bulk`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "classId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2023-01-01T00:00:00.000Z",
  "attendance": [
    {
      "childId": "{{child_id}}",
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

### 5.5 Check Out Child
**PUT** `{{base_url}}/attendance/{{attendance_id}}/checkout`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "checkOutTime": "2023-01-01T15:30:00.000Z",
  "notes": "Child had a great day"
}
```

---

## 6. Communication Endpoints

### 6.1 Get Messages
**GET** `{{base_url}}/communication/messages`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
recipientId: 60f7b3b3b3b3b3b3b3b3b3b5
limit: 20
offset: 0
```

### 6.2 Send Message
**POST** `{{base_url}}/communication/messages`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "recipientId": "60f7b3b3b3b3b3b3b3b3b3b5",
  "content": "Emma had a great day today! She participated well in all activities.",
  "type": "text",
  "attachments": ["https://example.com/photo1.jpg"],
  "metadata": {
    "childId": "{{child_id}}",
    "activityId": "{{activity_id}}"
  }
}
```

### 6.3 Mark Message as Read
**PUT** `{{base_url}}/communication/messages/{{message_id}}/read`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 6.4 Get Conversations
**GET** `{{base_url}}/communication/conversations`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 6.5 Get Notifications
**GET** `{{base_url}}/communication/notifications`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
type: activity
isRead: false
limit: 10
offset: 0
```

### 6.6 Create Notification
**POST** `{{base_url}}/communication/notifications`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Activity Update",
  "message": "Emma participated in circle time",
  "type": "activity",
  "priority": "medium",
  "recipientId": "{{user_id}}",
  "childId": "{{child_id}}",
  "activityId": "{{activity_id}}",
  "attachments": ["https://example.com/photo1.jpg"]
}
```

### 6.7 Mark Notification as Read
**PUT** `{{base_url}}/communication/notifications/{{notification_id}}/read`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 6.8 Mark All Notifications as Read
**PUT** `{{base_url}}/communication/notifications/read-all`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 7. Dashboard Statistics Endpoints

### 7.1 Get Parent Dashboard Stats
**GET** `{{base_url}}/parent/dashboard/stats`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 7.2 Get Teacher Dashboard Stats
**GET** `{{base_url}}/teacher/dashboard/stats`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 8. Health Records Endpoints

### 8.1 Get Health Records
**GET** `{{base_url}}/health/records`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
date: 2023-01-01
startDate: 2023-01-01
endDate: 2023-01-31
```

### 8.2 Create Health Record
**POST** `{{base_url}}/health/records`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "childId": "{{child_id}}",
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
    },
    {
      "mealType": "lunch",
      "items": ["Sandwich", "Apple slices"],
      "amount": "some",
      "notes": "Picky eater today"
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

### 8.3 Get Health Record by ID
**GET** `{{base_url}}/health/records/{{health_record_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 8.4 Update Health Record
**PUT** `{{base_url}}/health/records/{{health_record_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
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

### 8.5 Get Health Statistics
**GET** `{{base_url}}/health/stats`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
startDate: 2023-01-01
endDate: 2023-01-31
```

---

## 9. Payment Endpoints

### 9.1 Get Payment Status
**GET** `{{base_url}}/payments`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
status: pending
startDate: 2023-01-01
endDate: 2023-01-31
```

### 9.2 Get Payment by ID
**GET** `{{base_url}}/payments/{{payment_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 9.3 Create Payment (Admin only)
**POST** `{{base_url}}/payments`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "childId": "{{child_id}}",
  "amount": 500.00,
  "currency": "USD",
  "dueDate": "2023-01-01T00:00:00.000Z",
  "description": "Monthly tuition - January 2023",
  "billingType": "monthly",
  "baseAmount": 450.00,
  "additionalFees": [
    {
      "description": "Late pickup fee",
      "amount": 25.00,
      "type": "late_pickup"
    },
    {
      "description": "Field trip fee",
      "amount": 25.00,
      "type": "field_trip"
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
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-31T23:59:59.000Z"
  },
  "notes": "Payment due by end of month"
}
```

### 9.4 Record Payment (Admin only)
**POST** `{{base_url}}/payments/{{payment_id}}/pay`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "paymentMethod": "bank_transfer",
  "paymentReference": "TXN123456789",
  "transactionId": "TXN123456789",
  "paidAmount": 500.00,
  "notes": "Payment received via bank transfer"
}
```

### 9.5 Get Payment Statistics
**GET** `{{base_url}}/payments/stats/summary`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
startDate: 2023-01-01
endDate: 2023-01-31
```

---

## 10. Report Endpoints

### 10.1 Get Attendance Report
**GET** `{{base_url}}/reports/attendance`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
startDate: 2023-01-01
endDate: 2023-01-31
format: json
```

### 10.2 Get Activity Report
**GET** `{{base_url}}/reports/activities`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
startDate: 2023-01-01
endDate: 2023-01-31
type: academic
```

### 10.3 Get Payment Report
**GET** `{{base_url}}/reports/payments`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters:**
```
childId: {{child_id}}
startDate: 2023-01-01
endDate: 2023-01-31
```

---

## Testing Workflow

### Step 1: Setup
1. Create a new Postman collection
2. Set up environment variables
3. Start with authentication endpoints

### Step 2: Authentication Flow
1. Register a new user
2. Login to get JWT token
3. Test token refresh

### Step 3: User Management
1. Get user profile
2. Update profile
3. Upload profile picture
4. Change password

### Step 4: Child Management
1. Create a child
2. Get child details
3. Update child information
4. Upload child photo

### Step 5: Activity Management
1. Create an activity
2. Get activities
3. Update activity
4. Add activity updates
5. Upload activity photos

### Step 6: Attendance Management
1. Record attendance
2. Bulk attendance update
3. Check out child
4. Get attendance records

### Step 7: Communication
1. Send messages
2. Get conversations
3. Create notifications
4. Mark messages/notifications as read

### Step 8: Dashboard & Reports
1. Get dashboard statistics
2. Generate reports

### Step 9: Health Records
1. Create health records
2. Update health records
3. Get health statistics

### Step 10: Payments
1. Create payments (Admin)
2. Record payments (Admin)
3. Get payment statistics

---

## Common Test Scenarios

### Error Testing
Test these scenarios to ensure proper error handling:

1. **Invalid Authentication**
   - Use invalid token
   - Use expired token
   - Missing authorization header

2. **Validation Errors**
   - Missing required fields
   - Invalid data types
   - Invalid enum values

3. **Authorization Errors**
   - Access resources without permission
   - Cross-center data access

4. **Not Found Errors**
   - Access non-existent resources
   - Invalid IDs

### Success Testing
Verify these success scenarios:

1. **Complete User Journey**
   - Register → Login → Create Child → Create Activity → Record Attendance

2. **Role-based Access**
   - Test parent, teacher, and admin permissions

3. **Data Relationships**
   - Verify child-parent relationships
   - Verify activity-child relationships
   - Verify attendance-child relationships

---

## Postman Collection Import

You can create a Postman collection with all these endpoints. The collection should include:

1. **Authentication Folder**
   - Register, Login, Refresh Token, etc.

2. **User Management Folder**
   - Profile management, password change, etc.

3. **Child Management Folder**
   - CRUD operations for children

4. **Activity Management Folder**
   - Activity CRUD and updates

5. **Attendance Management Folder**
   - Attendance recording and management

6. **Communication Folder**
   - Messages and notifications

7. **Dashboard Folder**
   - Statistics endpoints

8. **Health Records Folder**
   - Health record management

9. **Payments Folder**
   - Payment management

10. **Reports Folder**
    - Report generation

Each endpoint should include proper headers, test scripts, and example data as shown above.
