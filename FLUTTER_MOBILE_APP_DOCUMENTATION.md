# Flutter Mobile App Documentation for Daycare Management System

## Table of Contents
1. [Overview](#overview)
2. [API Base Configuration](#api-base-configuration)
3. [Authentication Endpoints](#authentication-endpoints)
4. [User Management Endpoints](#user-management-endpoints)
5. [Child Management Endpoints](#child-management-endpoints)
6. [Attendance Endpoints](#attendance-endpoints)
7. [Activities Endpoints](#activities-endpoints)
8. [Communication Endpoints](#communication-endpoints)
9. [Health Records Endpoints](#health-records-endpoints)
10. [Payments Endpoints](#payments-endpoints)
11. [Reports Endpoints](#reports-endpoints)
12. [Data Models](#data-models)
13. [Flutter Implementation Guide](#flutter-implementation-guide)
14. [State Management](#state-management)
15. [UI/UX Guidelines](#uiux-guidelines)

## Overview

This documentation provides comprehensive API endpoints and implementation guidelines for building a Flutter mobile app for the Nurtura Daycare Management System. The app will serve both teachers and parents with role-based access and functionality.

### User Roles
- **Admin**: Full system access
- **Teacher**: Class management, attendance, activities, health records
- **Parent**: View children, attendance, activities, payments, communications

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## API Base Configuration

### HTTP Headers
```dart
Map<String, String> headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer $token',
};
```

### Response Format
```json
{
  "status": "success|error",
  "message": "Response message",
  "data": {},
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Authentication Endpoints

### 1. User Registration
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "password": "Password123!",
  "role": "parent",
  "preferredLanguage": "en",
  "address": {
    "street": "123 Main St",
    "city": "Nairobi",
    "state": "Nairobi",
    "country": "Kenya",
    "postalCode": "00100"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+254700000001",
    "email": "jane@example.com"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "parent",
      "isActive": true
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 2. User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "parent",
      "center": "center_id",
      "isActive": true
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 3. Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### 4. Reset Password
```http
POST /api/auth/reset-password/:token
```

**Request Body:**
```json
{
  "password": "NewPassword123!"
}
```

### 5. Refresh Token
```http
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

## User Management Endpoints

### 1. Get User Profile
```http
GET /api/users/profile
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+254700000000",
      "role": "parent",
      "profilePicture": "url_to_image",
      "address": {
        "street": "123 Main St",
        "city": "Nairobi",
        "state": "Nairobi",
        "country": "Kenya",
        "postalCode": "00100"
      },
      "center": {
        "_id": "center_id",
        "name": "Nurtura Daycare"
      }
    }
  }
}
```

### 2. Update User Profile
```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254700000000",
  "address": {
    "street": "123 Main St",
    "city": "Nairobi",
    "state": "Nairobi",
    "country": "Kenya",
    "postalCode": "00100"
  }
}
```

### 3. Change Password
```http
PUT /api/users/change-password
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### 4. Get Center Users (Admin Only)
```http
GET /api/centers/:centerId/users?page=1&limit=10&search=&role=
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name or email
- `role`: Filter by role (admin, teacher, parent)

## Child Management Endpoints

### 1. Get Children (Filtered by User Role)
```http
GET /api/children?page=1&limit=10&search=&status=&classId=
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for child name
- `status`: Filter by enrollment status
- `classId`: Filter by class ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "children": [
      {
        "_id": "child_id",
        "firstName": "Alice",
        "lastName": "Johnson",
        "dateOfBirth": "2020-01-15T00:00:00.000Z",
        "gender": "female",
        "enrollmentStatus": "enrolled",
        "currentClass": {
          "_id": "class_id",
          "name": "Toddler Class"
        },
        "parents": [
          {
            "_id": "parent_id",
            "firstName": "John",
            "lastName": "Johnson",
            "email": "john@example.com"
          }
        ],
        "emergencyContacts": [
          {
            "name": "Jane Johnson",
            "relationship": "Mother",
            "phone": "+254700000000",
            "email": "jane@example.com"
          }
        ]
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get Child Details
```http
GET /api/children/:childId
```

### 3. Create Child (Admin/Teacher Only)
```http
POST /api/children
```

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "dateOfBirth": "2020-01-15",
  "gender": "female",
  "parents": ["parent_id"],
  "emergencyContacts": [
    {
      "name": "Jane Johnson",
      "relationship": "Mother",
      "phone": "+254700000000",
      "email": "jane@example.com"
    }
  ],
  "health": {
    "allergies": [
      {
        "allergen": "Peanuts",
        "severity": "severe",
        "symptoms": ["Swelling", "Difficulty breathing"],
        "treatment": "Epinephrine injection",
        "emergencyAction": "Call 911 immediately"
      }
    ],
    "medicalConditions": ["Asthma"],
    "medications": [
      {
        "name": "Inhaler",
        "dosage": "As needed",
        "instructions": "Use when experiencing shortness of breath"
      }
    ]
  }
}
```

### 4. Update Child
```http
PUT /api/children/:childId
```

### 5. Delete Child
```http
DELETE /api/children/:childId
```

## Attendance Endpoints

### 1. Get Attendance Records
```http
GET /api/attendance?date=2024-01-15&childId=&classId=&page=1&limit=10
```

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format
- `childId`: Filter by child ID
- `classId`: Filter by class ID
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "attendance": [
      {
        "_id": "attendance_id",
        "child": {
          "_id": "child_id",
          "firstName": "Alice",
          "lastName": "Johnson"
        },
        "class": {
          "_id": "class_id",
          "name": "Toddler Class"
        },
        "date": "2024-01-15T00:00:00.000Z",
        "status": "present",
        "checkInTime": "2024-01-15T08:00:00.000Z",
        "checkOutTime": "2024-01-15T16:00:00.000Z",
        "notes": "Had a great day!",
        "recordedBy": {
          "_id": "teacher_id",
          "firstName": "Sarah",
          "lastName": "Teacher"
        }
      }
    ]
  }
}
```

### 2. Mark Attendance
```http
POST /api/attendance
```

**Request Body:**
```json
{
  "childId": "child_id",
  "classId": "class_id",
  "date": "2024-01-15",
  "status": "present",
  "checkInTime": "2024-01-15T08:00:00.000Z",
  "notes": "Arrived on time"
}
```

### 3. Update Attendance
```http
PUT /api/attendance/:attendanceId
```

### 4. Bulk Attendance Marking
```http
POST /api/attendance/bulk
```

**Request Body:**
```json
{
  "classId": "class_id",
  "date": "2024-01-15",
  "attendance": [
    {
      "childId": "child_id_1",
      "status": "present",
      "checkInTime": "2024-01-15T08:00:00.000Z"
    },
    {
      "childId": "child_id_2",
      "status": "absent",
      "notes": "Called in sick"
    }
  ]
}
```

## Activities Endpoints

### 1. Get Activities
```http
GET /api/activities?page=1&limit=10&classId=&date=&type=
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `classId`: Filter by class
- `date`: Filter by date
- `type`: Filter by activity type

**Response:**
```json
{
  "status": "success",
  "data": {
    "activities": [
      {
        "_id": "activity_id",
        "title": "Art and Craft",
        "description": "Painting with watercolors",
        "type": "creative",
        "date": "2024-01-15T00:00:00.000Z",
        "startTime": "2024-01-15T10:00:00.000Z",
        "endTime": "2024-01-15T11:00:00.000Z",
        "class": {
          "_id": "class_id",
          "name": "Toddler Class"
        },
        "materials": ["Paint", "Brushes", "Paper"],
        "learningObjectives": ["Fine motor skills", "Color recognition"],
        "photos": ["url_to_photo_1", "url_to_photo_2"],
        "createdBy": {
          "_id": "teacher_id",
          "firstName": "Sarah",
          "lastName": "Teacher"
        }
      }
    ]
  }
}
```

### 2. Create Activity (Teacher Only)
```http
POST /api/activities
```

**Request Body:**
```json
{
  "title": "Art and Craft",
  "description": "Painting with watercolors",
  "type": "creative",
  "date": "2024-01-15",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "classId": "class_id",
  "materials": ["Paint", "Brushes", "Paper"],
  "learningObjectives": ["Fine motor skills", "Color recognition"]
}
```

### 3. Update Activity
```http
PUT /api/activities/:activityId
```

### 4. Delete Activity
```http
DELETE /api/activities/:activityId
```

### 5. Upload Activity Photos
```http
POST /api/activities/:activityId/photos
```

**Content-Type:** `multipart/form-data`

## Communication Endpoints

### 1. Get Messages
```http
GET /api/communication/messages?page=1&limit=10&type=&recipientId=
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `type`: Message type (announcement, direct, group)
- `recipientId`: Filter by recipient

**Response:**
```json
{
  "status": "success",
  "data": {
    "messages": [
      {
        "_id": "message_id",
        "title": "Important Announcement",
        "content": "Parent-teacher meeting next week",
        "type": "announcement",
        "sender": {
          "_id": "teacher_id",
          "firstName": "Sarah",
          "lastName": "Teacher"
        },
        "recipients": [
          {
            "_id": "parent_id",
            "firstName": "John",
            "lastName": "Johnson"
          }
        ],
        "attachments": ["url_to_attachment"],
        "readBy": ["parent_id"],
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### 2. Send Message
```http
POST /api/communication/messages
```

**Request Body:**
```json
{
  "title": "Important Announcement",
  "content": "Parent-teacher meeting next week",
  "type": "announcement",
  "recipientIds": ["parent_id_1", "parent_id_2"],
  "attachments": ["file_url_1", "file_url_2"]
}
```

### 3. Mark Message as Read
```http
PUT /api/communication/messages/:messageId/read
```

### 4. Get Notifications
```http
GET /api/communication/notifications?page=1&limit=10
```

## Health Records Endpoints

### 1. Get Health Records
```http
GET /api/health/records?childId=&page=1&limit=10
```

**Query Parameters:**
- `childId`: Filter by child ID
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "_id": "record_id",
        "child": {
          "_id": "child_id",
          "firstName": "Alice",
          "lastName": "Johnson"
        },
        "type": "incident",
        "title": "Minor fall in playground",
        "description": "Child fell while playing, no injuries",
        "date": "2024-01-15T14:00:00.000Z",
        "severity": "minor",
        "actionTaken": "Applied ice pack",
        "parentNotified": true,
        "recordedBy": {
          "_id": "teacher_id",
          "firstName": "Sarah",
          "lastName": "Teacher"
        }
      }
    ]
  }
}
```

### 2. Create Health Record (Teacher Only)
```http
POST /api/health/records
```

**Request Body:**
```json
{
  "childId": "child_id",
  "type": "incident",
  "title": "Minor fall in playground",
  "description": "Child fell while playing, no injuries",
  "date": "2024-01-15T14:00:00.000Z",
  "severity": "minor",
  "actionTaken": "Applied ice pack",
  "parentNotified": true
}
```

### 3. Update Health Record
```http
PUT /api/health/records/:recordId
```

## Payments Endpoints

### 1. Get Payments
```http
GET /api/payments?page=1&limit=10&status=&childId=
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Payment status (pending, paid, overdue)
- `childId`: Filter by child ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "payments": [
      {
        "_id": "payment_id",
        "child": {
          "_id": "child_id",
          "firstName": "Alice",
          "lastName": "Johnson"
        },
        "amount": 50000,
        "currency": "KES",
        "type": "tuition",
        "dueDate": "2024-01-31T00:00:00.000Z",
        "status": "paid",
        "paidDate": "2024-01-25T10:00:00.000Z",
        "paymentMethod": "mpesa",
        "reference": "MPESA_REF_123",
        "description": "January 2024 Tuition Fee"
      }
    ]
  }
}
```

### 2. Create Payment (Admin Only)
```http
POST /api/payments
```

**Request Body:**
```json
{
  "childId": "child_id",
  "amount": 50000,
  "type": "tuition",
  "dueDate": "2024-01-31",
  "description": "January 2024 Tuition Fee"
}
```

### 3. Update Payment Status
```http
PUT /api/payments/:paymentId/status
```

**Request Body:**
```json
{
  "status": "paid",
  "paymentMethod": "mpesa",
  "reference": "MPESA_REF_123"
}
```

## Reports Endpoints

### 1. Get Attendance Report
```http
GET /api/reports/attendance?startDate=2024-01-01&endDate=2024-01-31&childId=&classId=
```

### 2. Get Activity Report
```http
GET /api/reports/activities?startDate=2024-01-01&endDate=2024-01-31&classId=
```

### 3. Get Payment Report
```http
GET /api/reports/payments?startDate=2024-01-01&endDate=2024-01-31&status=
```

## Data Models

### User Model
```dart
class User {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String role; // admin, teacher, parent
  final String? profilePicture;
  final DateTime? dateOfBirth;
  final String? gender;
  final Address? address;
  final String preferredLanguage;
  final bool isActive;
  final String? centerId;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    required this.role,
    this.profilePicture,
    this.dateOfBirth,
    this.gender,
    this.address,
    this.preferredLanguage = 'en',
    this.isActive = true,
    this.centerId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      phone: json['phone'],
      role: json['role'],
      profilePicture: json['profilePicture'],
      dateOfBirth: json['dateOfBirth'] != null 
          ? DateTime.parse(json['dateOfBirth']) 
          : null,
      gender: json['gender'],
      address: json['address'] != null 
          ? Address.fromJson(json['address']) 
          : null,
      preferredLanguage: json['preferredLanguage'] ?? 'en',
      isActive: json['isActive'] ?? true,
      centerId: json['center']?['_id'] ?? json['center'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}

class Address {
  final String? street;
  final String? city;
  final String? state;
  final String? country;
  final String? postalCode;

  Address({
    this.street,
    this.city,
    this.state,
    this.country,
    this.postalCode,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      street: json['street'],
      city: json['city'],
      state: json['state'],
      country: json['country'],
      postalCode: json['postalCode'],
    );
  }
}
```

### Child Model
```dart
class Child {
  final String id;
  final String firstName;
  final String lastName;
  final DateTime dateOfBirth;
  final String gender;
  final List<User> parents;
  final List<EmergencyContact> emergencyContacts;
  final DateTime enrollmentDate;
  final String enrollmentStatus;
  final DateTime? expectedGraduationDate;
  final Class? currentClass;
  final HealthInfo? health;
  final DateTime createdAt;
  final DateTime updatedAt;

  Child({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.dateOfBirth,
    required this.gender,
    required this.parents,
    required this.emergencyContacts,
    required this.enrollmentDate,
    required this.enrollmentStatus,
    this.expectedGraduationDate,
    this.currentClass,
    this.health,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Child.fromJson(Map<String, dynamic> json) {
    return Child(
      id: json['_id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      dateOfBirth: DateTime.parse(json['dateOfBirth']),
      gender: json['gender'],
      parents: (json['parents'] as List)
          .map((parent) => User.fromJson(parent))
          .toList(),
      emergencyContacts: (json['emergencyContacts'] as List)
          .map((contact) => EmergencyContact.fromJson(contact))
          .toList(),
      enrollmentDate: DateTime.parse(json['enrollmentDate']),
      enrollmentStatus: json['enrollmentStatus'],
      expectedGraduationDate: json['expectedGraduationDate'] != null 
          ? DateTime.parse(json['expectedGraduationDate']) 
          : null,
      currentClass: json['currentClass'] != null 
          ? Class.fromJson(json['currentClass']) 
          : null,
      health: json['health'] != null 
          ? HealthInfo.fromJson(json['health']) 
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}

class EmergencyContact {
  final String name;
  final String relationship;
  final String phone;
  final String? email;
  final bool isPrimary;

  EmergencyContact({
    required this.name,
    required this.relationship,
    required this.phone,
    this.email,
    this.isPrimary = false,
  });

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      name: json['name'],
      relationship: json['relationship'],
      phone: json['phone'],
      email: json['email'],
      isPrimary: json['isPrimary'] ?? false,
    );
  }
}
```

## Flutter Implementation Guide

### 1. Project Structure
```
lib/
├── main.dart
├── app.dart
├── config/
│   ├── api_config.dart
│   ├── app_config.dart
│   └── theme.dart
├── models/
│   ├── user.dart
│   ├── child.dart
│   ├── attendance.dart
│   ├── activity.dart
│   └── message.dart
├── services/
│   ├── api_service.dart
│   ├── auth_service.dart
│   ├── storage_service.dart
│   └── notification_service.dart
├── providers/
│   ├── auth_provider.dart
│   ├── user_provider.dart
│   ├── child_provider.dart
│   └── attendance_provider.dart
├── screens/
│   ├── auth/
│   │   ├── login_screen.dart
│   │   ├── register_screen.dart
│   │   └── forgot_password_screen.dart
│   ├── parent/
│   │   ├── parent_dashboard.dart
│   │   ├── child_details.dart
│   │   ├── attendance_view.dart
│   │   └── activities_view.dart
│   └── teacher/
│       ├── teacher_dashboard.dart
│       ├── class_management.dart
│       ├── attendance_marking.dart
│       └── activity_creation.dart
├── widgets/
│   ├── common/
│   │   ├── loading_widget.dart
│   │   ├── error_widget.dart
│   │   └── custom_button.dart
│   └── forms/
│       ├── login_form.dart
│       └── attendance_form.dart
└── utils/
    ├── constants.dart
    ├── helpers.dart
    └── validators.dart
```

### 2. Dependencies (pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  provider: ^6.1.1
  shared_preferences: ^2.2.2
  image_picker: ^1.0.4
  cached_network_image: ^3.3.0
  intl: ^0.18.1
  flutter_local_notifications: ^16.3.0
  connectivity_plus: ^5.0.2
  flutter_secure_storage: ^9.0.0
  json_annotation: ^4.8.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
```

### 3. API Service Implementation
```dart
class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';
  static const String tokenKey = 'auth_token';
  
  static Future<Map<String, String>> getHeaders() async {
    final token = await StorageService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<Map<String, dynamic>> get(String endpoint, {Map<String, dynamic>? queryParams}) async {
    final headers = await getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    
    final response = await http.get(uri, headers: headers);
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    final headers = await getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');
    
    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode(data),
    );
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> put(String endpoint, Map<String, dynamic> data) async {
    final headers = await getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');
    
    final response = await http.put(
      uri,
      headers: headers,
      body: jsonEncode(data),
    );
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> delete(String endpoint) async {
    final headers = await getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');
    
    final response = await http.delete(uri, headers: headers);
    return _handleResponse(response);
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    final data = jsonDecode(response.body);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      throw ApiException(
        message: data['message'] ?? 'An error occurred',
        statusCode: response.statusCode,
      );
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException({required this.message, required this.statusCode});

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';
}
```

### 4. Authentication Service
```dart
class AuthService {
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await ApiService.post('/auth/login', {
      'email': email,
      'password': password,
    });
    
    if (response['status'] == 'success') {
      await StorageService.saveToken(response['data']['token']);
      await StorageService.saveRefreshToken(response['data']['refreshToken']);
      await StorageService.saveUser(response['data']['user']);
    }
    
    return response;
  }

  static Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final response = await ApiService.post('/auth/register', userData);
    
    if (response['status'] == 'success') {
      await StorageService.saveToken(response['data']['token']);
      await StorageService.saveRefreshToken(response['data']['refreshToken']);
      await StorageService.saveUser(response['data']['user']);
    }
    
    return response;
  }

  static Future<void> logout() async {
    await StorageService.clearAll();
  }

  static Future<bool> isAuthenticated() async {
    final token = await StorageService.getToken();
    return token != null;
  }

  static Future<Map<String, dynamic>> refreshToken() async {
    final refreshToken = await StorageService.getRefreshToken();
    final response = await ApiService.post('/auth/refresh-token', {
      'refreshToken': refreshToken,
    });
    
    if (response['status'] == 'success') {
      await StorageService.saveToken(response['data']['token']);
      await StorageService.saveRefreshToken(response['data']['refreshToken']);
    }
    
    return response;
  }
}
```

### 5. State Management with Provider
```dart
class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await AuthService.login(email, password);
      if (response['status'] == 'success') {
        _user = User.fromJson(response['data']['user']);
        notifyListeners();
        return true;
      } else {
        _setError(response['message']);
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }
}
```

### 6. Main App Structure
```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  await StorageService.init();
  await NotificationService.init();
  
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => ChildProvider()),
        ChangeNotifierProvider(create: (_) => AttendanceProvider()),
      ],
      child: MaterialApp(
        title: 'Nurtura Daycare',
        theme: AppTheme.lightTheme,
        home: AuthWrapper(),
        routes: {
          '/login': (context) => LoginScreen(),
          '/register': (context) => RegisterScreen(),
          '/parent-dashboard': (context) => ParentDashboard(),
          '/teacher-dashboard': (context) => TeacherDashboard(),
        },
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (authProvider.isLoading) {
          return LoadingScreen();
        }
        
        if (authProvider.isAuthenticated) {
          final user = authProvider.user!;
          if (user.role == 'parent') {
            return ParentDashboard();
          } else if (user.role == 'teacher') {
            return TeacherDashboard();
          } else {
            return AdminDashboard();
          }
        }
        
        return LoginScreen();
      },
    );
  }
}
```

## State Management

### Provider Setup
```dart
// Child Provider
class ChildProvider with ChangeNotifier {
  List<Child> _children = [];
  bool _isLoading = false;
  String? _error;

  List<Child> get children => _children;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchChildren({String? search, String? status}) async {
    _setLoading(true);
    
    try {
      final params = <String, dynamic>{};
      if (search != null) params['search'] = search;
      if (status != null) params['status'] = status;
      
      final response = await ApiService.get('/children', queryParams: params);
      _children = (response['data']['children'] as List)
          .map((child) => Child.fromJson(child))
          .toList();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }
}
```

## UI/UX Guidelines

### 1. Color Scheme
```dart
class AppColors {
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color secondary = Color(0xFF10B981);
  static const Color accent = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color textSecondary = Color(0xFF6B7280);
}
```

### 2. Typography
```dart
class AppTypography {
  static const TextStyle heading1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle heading2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle body = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
  );
}
```

### 3. Common Widgets
```dart
class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final Color? color;

  const CustomButton({
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? AppColors.primary,
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: isLoading
          ? SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : Text(
              text,
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
    );
  }
}
```

This documentation provides a comprehensive guide for building the Flutter mobile app for your daycare management system. The API endpoints are well-structured and follow RESTful conventions, making them easy to integrate with Flutter's HTTP client. The state management approach using Provider ensures clean separation of concerns and maintainable code.

