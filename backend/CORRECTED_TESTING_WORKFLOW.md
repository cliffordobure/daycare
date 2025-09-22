# CORRECTED Complete API Testing Workflow - Step by Step

## Base URL: `http://localhost:5000/api`

---

## STEP 1: Register Center with Admin (Public Endpoint)

### Register Center and Admin Together
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
      "email": "info@sunshinedaycare.com",
      "website": "https://sunshinedaycare.com"
    },
    "licenseNumber": "DC-2024-001",
    "capacity": 50,
    "ageRange": {
      "min": 2,
      "max": 5
    },
    "operatingHours": {
      "monday": { "open": "07:00", "close": "18:00" },
      "tuesday": { "open": "07:00", "close": "18:00" },
      "wednesday": { "open": "07:00", "close": "18:00" },
      "thursday": { "open": "07:00", "close": "18:00" },
      "friday": { "open": "07:00", "close": "18:00" },
      "saturday": { "open": "08:00", "close": "12:00" },
      "sunday": { "open": "closed", "close": "closed" }
    },
    "amenities": ["Playground", "Library", "Art Room", "Music Room"],
    "description": "A nurturing environment for children to learn and grow"
  },
  "adminData": {
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@sunshinedaycare.com",
    "phone": "+1234567891",
    "dateOfBirth": "1985-01-01T00:00:00.000Z",
    "gender": "male",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postalCode": "10001"
    },
    "preferredLanguage": "en"
  }
}
```

**Response:** Save the `centerId` and `adminId` from the response.

---

## STEP 2: Login Admin

### Login Admin
**URL:** `POST http://localhost:5000/api/auth/login`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "admin@sunshinedaycare.com",
  "password": "admin@sunshinedaycare.com"
}
```

**Note:** The password is set to the email address by default.

**Response:** Save the `token` from the response.

---

## STEP 3: Create Class (Admin)

### Create Class
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
    "min": 2,
    "max": 3
  },
  "capacity": 15,
  "centerId": "CENTER_ID_FROM_STEP_1",
  "schedule": {
    "monday": { "start": "09:00", "end": "15:00" },
    "tuesday": { "start": "09:00", "end": "15:00" },
    "wednesday": { "start": "09:00", "end": "15:00" },
    "thursday": { "start": "09:00", "end": "15:00" },
    "friday": { "start": "09:00", "end": "15:00" }
  },
  "curriculum": ["Basic motor skills", "Social interaction", "Language development"],
  "room": "Room 101",
  "academicYear": "2024",
  "term": "Spring"
}
```

**Response:** Save the `classId` from the response.

---

## STEP 4: Create Teacher User (Admin)

### Create Teacher User
**URL:** `POST http://localhost:5000/api/centers/CENTER_ID_FROM_STEP_1/users`
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
  "preferredLanguage": "en",
  "address": {
    "street": "456 Oak Avenue",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10002"
  },
  "teacherInfo": {
    "qualifications": ["Early Childhood Education", "CPR Certified"],
    "experience": "5 years",
    "specializations": ["Toddler Development", "Creative Arts"],
    "certifications": ["ECE Certificate", "CPR", "First Aid"]
  }
}
```

**Response:** Save the `teacherId` from the response.

---

## STEP 5: Update Class with Teacher (Admin)

### Update Class
**URL:** `PUT http://localhost:5000/api/classes/CLASS_ID_FROM_STEP_3`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "teachers": ["TEACHER_ID_FROM_STEP_4"]
}
```

---

## STEP 6: Create Parent User (Admin)

### Create Parent User
**URL:** `POST http://localhost:5000/api/centers/CENTER_ID_FROM_STEP_1/users`
**Headers:** 
- `Authorization: Bearer YOUR_ADMIN_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Johnson",
  "lastName": "Smith",
  "email": "johnson@gmail.com",
  "phone": "+1234567893",
  "role": "parent",
  "preferredLanguage": "en",
  "address": {
    "street": "789 Pine Street",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10003"
  },
  "parentInfo": {
    "emergencyContact": {
      "name": "Jane Smith",
      "relationship": "Spouse",
      "phone": "+1234567894",
      "email": "jane.smith@gmail.com"
    },
    "preferredContactMethod": "email",
    "pickupAuthorization": [
      {
        "name": "Jane Smith",
        "relationship": "Spouse",
        "phone": "+1234567894",
        "idRequired": true
      }
    ]
  }
}
```

**Response:** Save the `parentId` from the response.

---

## STEP 7: Login Parent

### Login Parent
**URL:** `POST http://localhost:5000/api/auth/login`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "johnson@gmail.com",
  "password": "johnson@gmail.com"
}
```

**Note:** The password is set to the email address by default.

**Response:** Save the `token` from the response.

---

## STEP 8: Create Child (Parent)

### Create Child
**URL:** `POST http://localhost:5000/api/children`
**Headers:** 
- `Authorization: Bearer YOUR_PARENT_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "dateOfBirth": "2021-06-15T00:00:00.000Z",
  "gender": "female",
  "parentId": "PARENT_ID_FROM_STEP_6",
  "parents": ["PARENT_ID_FROM_STEP_6"],
  "centerId": "CENTER_ID_FROM_STEP_1",
  "currentClass": "CLASS_ID_FROM_STEP_3",
  "emergencyContacts": [
    {
      "name": "Jane Smith",
      "relationship": "Mother",
      "phone": "+1234567894",
      "email": "jane.smith@gmail.com",
      "isPrimary": true
    },
    {
      "name": "Robert Smith",
      "relationship": "Grandfather",
      "phone": "+1234567895",
      "email": "robert.smith@gmail.com",
      "isPrimary": false
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
        "condition": "Mild Asthma",
        "diagnosis": "Diagnosed at age 2",
        "diagnosedDate": "2023-01-01T00:00:00.000Z",
        "treatment": "Inhaler as needed",
        "notes": "Child responds well to treatment"
      }
    ],
    "medications": [
      {
        "name": "Children's Inhaler",
        "dosage": "1 puff",
        "frequency": "As needed",
        "instructions": "Use when coughing or wheezing"
      }
    ]
  },
  "dietary": {
    "restrictions": ["Peanuts", "Tree nuts"],
    "preferences": ["Vegetables", "Fruits"],
    "specialInstructions": "No nuts allowed, prefers finger foods"
  },
  "pickupAuthorization": [
    {
      "name": "Jane Smith",
      "relationship": "Mother",
      "phone": "+1234567894",
      "idRequired": true
    },
    {
      "name": "Robert Smith",
      "relationship": "Grandfather",
      "phone": "+1234567895",
      "idRequired": true
    }
  ]
}
```

**Response:** Save the `childId` from the response.

---

## STEP 9: Login Teacher

### Login Teacher
**URL:** `POST http://localhost:5000/api/auth/login`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "sarah.johnson@sunshinedaycare.com",
  "password": "sarah.johnson@sunshinedaycare.com"
}
```

**Response:** Save the `token` from the response.

---

## STEP 10: Create Activity (Teacher)

### Create Activity
**URL:** `POST http://localhost:5000/api/activities`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "title": "Morning Circle Time",
  "description": "Singing songs, sharing stories, and learning about the day",
  "startTime": "2024-01-15T09:00:00.000Z",
  "endTime": "2024-01-15T09:30:00.000Z",
  "type": "academic",
  "childrenInvolved": ["CHILD_ID_FROM_STEP_8"],
  "location": "Main Classroom",
  "materials": ["Books", "Musical instruments", "Calendar"],
  "notes": "Focus on sharing and turn-taking",
  "learningObjectives": ["Social skills", "Language development", "Listening skills"]
}
```

**Response:** Save the `activityId` from the response.

---

## STEP 11: Record Attendance (Teacher)

### Record Attendance
**URL:** `POST http://localhost:5000/api/attendance`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID_FROM_STEP_8",
  "classId": "CLASS_ID_FROM_STEP_3",
  "date": "2024-01-15T00:00:00.000Z",
  "status": "present",
  "checkInTime": "2024-01-15T08:30:00.000Z",
  "notes": "Emma arrived happy and ready to play"
}
```

---

## STEP 12: Add Activity Update (Teacher)

### Add Activity Update
**URL:** `POST http://localhost:5000/api/activities/ACTIVITY_ID_FROM_STEP_10/updates`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "message": "Emma participated enthusiastically in circle time. She shared her favorite toy and listened well to others.",
  "childId": "CHILD_ID_FROM_STEP_8",
  "attachments": ["https://example.com/photo1.jpg"]
}
```

---

## STEP 13: Create Health Record (Teacher)

### Create Health Record
**URL:** `POST http://localhost:5000/api/health/records`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "childId": "CHILD_ID_FROM_STEP_8",
  "date": "2024-01-15T00:00:00.000Z",
  "temperature": {
    "value": 98.6,
    "unit": "fahrenheit"
  },
  "symptoms": [],
  "observations": "Emma appears healthy and energetic",
  "medications": [
    {
      "name": "Children's Inhaler",
      "dosage": "1 puff",
      "frequency": "Not needed today",
      "notes": "No breathing issues observed"
    }
  ],
  "meals": [
    {
      "mealType": "breakfast",
      "items": ["Oatmeal", "Banana slices"],
      "amount": "most",
      "notes": "Ate well, enjoyed the banana"
    },
    {
      "mealType": "lunch",
      "items": ["Chicken nuggets", "Carrot sticks", "Apple slices"],
      "amount": "some",
      "notes": "Picky with vegetables but ate protein well"
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
    "energyLevel": "high",
    "socialInteraction": "active",
    "notes": "Very social today, played well with others, followed instructions"
  },
  "physicalActivity": {
    "outdoorTime": 45,
    "indoorActivity": ["Blocks", "Drawing", "Story time", "Circle time"],
    "notes": "Active play both indoors and outdoors"
  },
  "incidents": [],
  "notes": "Overall excellent day. Emma was engaged in all activities and showed good social skills."
}
```

---

## STEP 14: Send Message (Teacher to Parent)

### Send Message
**URL:** `POST http://localhost:5000/api/communication/messages`
**Headers:** 
- `Authorization: Bearer YOUR_TEACHER_TOKEN`
- `Content-Type: application/json`
**Body:**
```json
{
  "recipientId": "PARENT_ID_FROM_STEP_6",
  "content": "Hi Johnson! Emma had a wonderful day today. She participated well in circle time and shared her favorite toy with friends. She ate well and took a good nap. No incidents to report. Looking forward to another great day tomorrow!",
  "type": "text",
  "attachments": ["https://example.com/emma_circle_time.jpg"],
  "metadata": {
    "childId": "CHILD_ID_FROM_STEP_8",
    "activityId": "ACTIVITY_ID_FROM_STEP_10"
  }
}
```

---

## STEP 15: Get Dashboard Stats (Parent)

### Get Parent Dashboard
**URL:** `GET http://localhost:5000/api/parent/dashboard/stats`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

---

## STEP 16: Generate Reports (Parent)

### Get Attendance Report
**URL:** `GET http://localhost:5000/api/reports/attendance?childId=CHILD_ID_FROM_STEP_8&startDate=2024-01-01&endDate=2024-01-31&format=json`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

### Get Activity Report
**URL:** `GET http://localhost:5000/api/reports/activities?childId=CHILD_ID_FROM_STEP_8&startDate=2024-01-01&endDate=2024-01-31&type=academic`
**Headers:** `Authorization: Bearer YOUR_PARENT_TOKEN`

---

## Complete Testing Checklist

✅ **Step 1:** Register Center with Admin (Public)  
✅ **Step 2:** Login Admin  
✅ **Step 3:** Create Class  
✅ **Step 4:** Create Teacher User  
✅ **Step 5:** Update Class with Teacher  
✅ **Step 6:** Create Parent User  
✅ **Step 7:** Login Parent  
✅ **Step 8:** Create Child  
✅ **Step 9:** Login Teacher  
✅ **Step 10:** Create Activity  
✅ **Step 11:** Record Attendance  
✅ **Step 12:** Add Activity Update  
✅ **Step 13:** Create Health Record  
✅ **Step 14:** Send Message  
✅ **Step 15:** Get Dashboard Stats  
✅ **Step 16:** Generate Reports  

---

## Important Notes

1. **Center Registration:** Use `/api/centers/register` (public endpoint) - creates both center and admin
2. **User Creation:** Admin creates users via `/api/centers/:centerId/users`
3. **Default Passwords:** All users get password set to their email address
4. **Save IDs:** Keep track of all IDs from responses
5. **Token Management:** Save tokens for each user type
6. **Role Permissions:** Different roles have different access levels
7. **Complete Data:** All required fields are included

This corrected workflow follows the actual API structure where center registration is public and creates both center and admin together!
