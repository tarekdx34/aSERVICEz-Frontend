# aSERVICEa Backend API Documentation

This document outlines all the APIs required to replace the mock/hardcoded data in the frontend application with a real backend server.

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User Management APIs](#2-user-management-apis)
3. [Service APIs](#3-service-apis)
4. [Order APIs](#4-order-apis)
5. [Messaging APIs](#5-messaging-apis)
6. [Notification APIs](#6-notification-apis)
7. [Payment & Earnings APIs](#7-payment--earnings-apis)
8. [Support Ticket APIs](#8-support-ticket-apis)
9. [Admin APIs](#9-admin-apis)
10. [Review APIs](#10-review-apis)
11. [Category APIs](#11-category-apis)

---

## Base URL

```
Production: https://api.aservicea.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication APIs

### 1.1 Register User

**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "fullName": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "accountType": "customer" | "expert",
  "agreeToTerms": true,
  "newsletter": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "fullName": "string",
      "username": "string",
      "email": "string",
      "role": "customer" | "expert",
      "avatar": "string (url)",
      "createdAt": "ISO date string"
    },
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string"
  }
}
```

**Errors:**
- `400` - Validation error (email/username already exists, weak password, etc.)
- `409` - Email or username already registered

---

### 1.2 Login

**POST** `/auth/login`

Authenticates a user and returns tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "accountType": "customer" | "expert"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "customer" | "expert",
      "avatar": "string (url)"
    },
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string"
  }
}
```

---

### 1.3 Social Login

**POST** `/auth/social/{provider}`

Authenticates using OAuth provider (Google, Facebook, Twitter).

**Path Parameters:**
- `provider`: `google` | `facebook` | `twitter`

**Request Body:**
```json
{
  "accessToken": "string",
  "accountType": "customer" | "expert"
}
```

**Response (200):** Same as Login response

---

### 1.4 Refresh Token

**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### 1.5 Check Username Availability

**GET** `/auth/check-username/{username}`

**Response (200):**
```json
{
  "available": true | false
}
```

---

### 1.6 Check Email Availability

**GET** `/auth/check-email/{email}`

**Response (200):**
```json
{
  "available": true | false
}
```

---

### 1.7 Logout

**POST** `/auth/logout`

🔒 **Requires Authentication**

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.8 Forgot Password

**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 1.9 Reset Password

**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

---

## 2. User Management APIs

### 2.1 Get Current User Profile

**GET** `/users/me`

🔒 **Requires Authentication**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "username": "string",
    "role": "customer" | "expert",
    "avatar": "string (url)",
    "bio": "string",
    "phone": "string",
    "memberSince": "ISO date",
    "status": "active" | "suspended",
    "verified": true | false,
    "expertProfile": {
      "level": "new" | "seller" | "featured" | "pro",
      "rating": 4.9,
      "reviewCount": 1245,
      "completedOrders": 856,
      "responseTime": "1 hour",
      "isOnline": true,
      "skills": ["skill1", "skill2"],
      "achievements": [
        { "label": "Top seller January 2024", "labelAr": "أفضل بائع لشهر يناير 2024" }
      ]
    }
  }
}
```

---

### 2.2 Update User Profile

**PUT** `/users/me`

🔒 **Requires Authentication**

**Request Body (multipart/form-data):**
```json
{
  "name": "string",
  "bio": "string",
  "phone": "string",
  "avatar": "File (optional)"
}
```

---

### 2.3 Get Expert Public Profile

**GET** `/users/experts/{expertId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "nameEn": "string",
    "username": "string",
    "avatar": "string (url)",
    "level": "new" | "seller" | "featured" | "pro",
    "badge": "new" | "seller" | "featured" | "pro",
    "rating": 4.9,
    "reviewCount": 1245,
    "completedOrders": 856,
    "memberSince": "2023",
    "isOnline": true,
    "responseTime": "خلال ساعة",
    "bio": "string",
    "bioEn": "string",
    "skills": ["Photoshop", "Illustrator"],
    "achievements": [
      { "label": "أفضل بائع", "labelEn": "Top seller" }
    ]
  }
}
```

---

### 2.4 Update User Settings

**PUT** `/users/me/settings`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "language": "ar" | "en",
  "emailNotifications": true,
  "pushNotifications": true,
  "twoFactorAuth": false
}
```

---

### 2.5 Change Password

**PUT** `/users/me/password`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## 3. Service APIs

### 3.1 Get Services (Marketplace)

**GET** `/services`

Fetches services with filters and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |
| `search` | string | Search query |
| `category` | string | Category slug |
| `subcategory` | string | Subcategory slug |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `deliveryTime` | string | `24h`, `3days`, `7days`, `7plus` |
| `rating` | number | Minimum rating (1-5) |
| `sellerLevel` | string | `new`, `seller`, `featured`, `pro` |
| `sortBy` | string | `relevant`, `newest`, `rating`, `price-low`, `price-high`, `bestseller` |
| `lang` | string | `ar`, `en` |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "string",
        "title": "string",
        "titleEn": "string",
        "thumbnail": "string (url)",
        "expert": {
          "id": "string",
          "name": "string",
          "nameEn": "string",
          "avatar": "string (url)",
          "level": "محترف",
          "levelEn": "Professional",
          "badge": "pro"
        },
        "rating": 4.9,
        "reviewCount": 285,
        "price": 25,
        "deliveryTime": "2days",
        "category": "design",
        "sales": 145
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 120,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 3.2 Get Service Detail

**GET** `/services/{serviceId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "titleEn": "string",
    "category": "string",
    "categoryEn": "string",
    "subcategory": "string",
    "subcategoryEn": "string",
    "images": ["url1", "url2", "url3"],
    "description": "string",
    "descriptionEn": "string",
    "features": [
      { "label": "feature1", "labelEn": "feature1 en" }
    ],
    "excludes": [
      { "label": "exclude1", "labelEn": "exclude1 en" }
    ],
    "requirements": [
      { "label": "req1", "labelEn": "req1 en" }
    ],
    "packages": [
      {
        "id": "basic",
        "name": "باقة أساسية",
        "nameEn": "Basic Package",
        "price": 10,
        "deliveryDays": 3,
        "revisions": 1,
        "features": ["feature1", "feature2"]
      },
      {
        "id": "standard",
        "name": "باقة متقدمة",
        "nameEn": "Standard Package",
        "price": 25,
        "deliveryDays": 5,
        "revisions": 2,
        "features": []
      },
      {
        "id": "premium",
        "name": "باقة احترافية",
        "nameEn": "Premium Package",
        "price": 50,
        "deliveryDays": 7,
        "revisions": 3,
        "features": []
      }
    ],
    "packageFeatures": [
      {
        "label": "عدد التصاميم",
        "labelEn": "Number of designs",
        "basic": "1",
        "standard": "3",
        "premium": "5"
      }
    ],
    "extras": [
      {
        "id": "express",
        "name": "توصيل سريع",
        "nameEn": "Express delivery",
        "price": 15,
        "icon": "⚡"
      }
    ],
    "portfolioImages": ["url1", "url2"],
    "stats": {
      "sales": 145,
      "inQueue": 3,
      "views": 2847,
      "rating": 4.9
    },
    "expert": {
      "id": "string",
      "name": "أحمد محمد",
      "nameEn": "Ahmed Mohamed",
      "username": "ahmed_designer",
      "avatar": "url",
      "level": "بائع محترف",
      "levelEn": "Pro Seller",
      "badge": "pro",
      "rating": 4.9,
      "reviewCount": 1245,
      "completedOrders": 856,
      "memberSince": "2023",
      "isOnline": true,
      "responseTime": "خلال ساعة",
      "bio": "string",
      "bioEn": "string",
      "skills": ["skill1", "skill2"]
    },
    "reviews": {
      "averageRating": 4.9,
      "totalReviews": 285,
      "ratingBreakdown": {
        "5": 245,
        "4": 30,
        "3": 8,
        "2": 2,
        "1": 0
      },
      "items": [
        {
          "id": "string",
          "user": {
            "name": "سارة أحمد",
            "avatar": "url",
            "country": "السعودية",
            "countryFlag": "🇸🇦"
          },
          "rating": 5,
          "comment": "string",
          "date": "2024-01-28",
          "helpfulCount": 12,
          "sellerReply": {
            "comment": "string",
            "date": "2024-01-28"
          }
        }
      ]
    },
    "relatedServices": [
      { /* Same as service list item */ }
    ]
  }
}
```

---

### 3.3 Create Service

**POST** `/services`

🔒 **Requires Authentication (Expert only)**

**Request Body (multipart/form-data):**
```json
{
  "title": "string",
  "titleEn": "string",
  "category": "string",
  "subcategory": "string",
  "tags": ["tag1", "tag2"],
  "mainImage": "File",
  "description": "string",
  "descriptionEn": "string",
  "features": ["feature1", "feature2"],
  "buyerInstructions": "string",
  "packages": {
    "basic": {
      "name": "string",
      "price": 10,
      "deliveryDays": 3,
      "revisions": 1,
      "features": ["f1", "f2"]
    },
    "standard": { /* ... */ },
    "premium": { /* ... */ }
  },
  "extras": [
    { "name": "string", "price": 15 }
  ],
  "portfolioImages": ["File1", "File2"],
  "videoUrl": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "pending_approval"
  }
}
```

---

### 3.4 Update Service

**PUT** `/services/{serviceId}`

🔒 **Requires Authentication (Expert owner only)**

Same request body as Create Service.

---

### 3.5 Delete Service

**DELETE** `/services/{serviceId}`

🔒 **Requires Authentication (Expert owner only)**

---

### 3.6 Get Expert's Services

**GET** `/services/my-services`

🔒 **Requires Authentication (Expert only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `active`, `pending`, `paused`, `rejected` |
| `page` | number | Page number |
| `limit` | number | Items per page |

---

### 3.7 Save Service as Draft

**POST** `/services/drafts`

🔒 **Requires Authentication (Expert only)**

**Request Body:** Same as Create Service

**Response (201):**
```json
{
  "success": true,
  "data": {
    "draftId": "string"
  }
}
```

---

### 3.8 Get Service Draft

**GET** `/services/drafts/{draftId}`

🔒 **Requires Authentication (Expert only)**

---

## 4. Order APIs

### 4.1 Get Customer Orders

**GET** `/orders`

🔒 **Requires Authentication**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `all`, `active`, `completed`, `cancelled` |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-1738756891234",
        "serviceTitle": "Professional Logo Design",
        "serviceTitleAr": "تصميم شعار احترافي",
        "thumbnail": "url",
        "expert": {
          "id": "string",
          "name": "Ahmed Hassan",
          "nameAr": "أحمد حسن",
          "avatar": "AH"
        },
        "package": "Standard",
        "packageAr": "القياسية",
        "price": 100,
        "status": "in_progress",
        "orderDate": "2024-02-01",
        "deliveryDate": "2024-02-06",
        "daysRemaining": 3,
        "unreadMessages": 2
      }
    ],
    "pagination": { /* ... */ },
    "counts": {
      "all": 15,
      "active": 5,
      "completed": 8,
      "cancelled": 2
    }
  }
}
```

---

### 4.2 Get Expert Orders

**GET** `/orders/expert`

🔒 **Requires Authentication (Expert only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `all`, `pending`, `active`, `delivered` |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-001",
        "service": "Professional Logo Design",
        "serviceAr": "تصميم شعار احترافي",
        "customer": {
          "id": "string",
          "name": "Sarah Johnson",
          "nameAr": "سارة جونسون",
          "avatar": "SJ"
        },
        "amount": 100,
        "status": "pending" | "active" | "delivered",
        "deadline": "5 days",
        "deadlineAr": "5 أيام",
        "requirements": "string",
        "requirementsAr": "string",
        "orderDate": "2024-02-05",
        "new": true,
        "progress": 60
      }
    ],
    "newOrdersCount": 2,
    "pagination": { /* ... */ }
  }
}
```

---

### 4.3 Get Order Detail

**GET** `/orders/{orderId}`

🔒 **Requires Authentication**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "ORD-1738756891234",
    "status": "delivered",
    "serviceTitle": "string",
    "serviceTitleAr": "string",
    "thumbnail": "url",
    "package": "Standard",
    "packageAr": "القياسية",
    "price": 100,
    "orderDate": "2024-02-01",
    "deliveryDate": "2024-02-06",
    "daysRemaining": 0,
    "deliveredDate": "2024-02-05",
    "expert": {
      "id": "string",
      "name": "Ahmed Hassan",
      "nameAr": "أحمد حسن",
      "avatar": "AH",
      "rating": 4.9,
      "responseTime": "1 hour"
    },
    "requirements": "string",
    "requirementsAr": "string",
    "timeline": [
      {
        "status": "placed",
        "label": "Order Placed",
        "labelAr": "تم تقديم الطلب",
        "date": "2024-02-01",
        "time": "10:30 AM",
        "completed": true,
        "current": false
      }
    ],
    "attachments": [
      {
        "id": "string",
        "name": "file.pdf",
        "type": "pdf" | "image",
        "size": "2.4 MB",
        "uploadedBy": "customer" | "expert",
        "uploadDate": "2024-02-01",
        "url": "download_url"
      }
    ],
    "deliverables": [
      {
        "id": "string",
        "version": 1,
        "message": "string",
        "messageAr": "string",
        "date": "2024-02-05",
        "files": [
          {
            "id": "string",
            "name": "file.zip",
            "type": "zip",
            "size": "5.2 MB",
            "url": "download_url"
          }
        ]
      }
    ]
  }
}
```

---

### 4.4 Create Order

**POST** `/orders`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "serviceId": "string",
  "packageId": "basic" | "standard" | "premium",
  "extras": ["extraId1", "extraId2"],
  "requirements": "string",
  "attachments": ["fileUrl1", "fileUrl2"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-1738756891234",
    "paymentUrl": "url_to_payment_gateway"
  }
}
```

---

### 4.5 Accept Order (Expert)

**POST** `/orders/{orderId}/accept`

🔒 **Requires Authentication (Expert only)**

---

### 4.6 Decline Order (Expert)

**POST** `/orders/{orderId}/decline`

🔒 **Requires Authentication (Expert only)**

**Request Body:**
```json
{
  "reason": "string"
}
```

---

### 4.7 Deliver Order (Expert)

**POST** `/orders/{orderId}/deliver`

🔒 **Requires Authentication (Expert only)**

**Request Body (multipart/form-data):**
```json
{
  "message": "string",
  "files": ["File1", "File2"]
}
```

---

### 4.8 Accept Delivery (Customer)

**POST** `/orders/{orderId}/accept-delivery`

🔒 **Requires Authentication (Customer only)**

---

### 4.9 Request Revision (Customer)

**POST** `/orders/{orderId}/revision`

🔒 **Requires Authentication (Customer only)**

**Request Body:**
```json
{
  "reason": "string",
  "details": "string"
}
```

---

### 4.10 Cancel Order

**POST** `/orders/{orderId}/cancel`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "reason": "string"
}
```

---

### 4.11 Extend Delivery Time

**POST** `/orders/{orderId}/extend`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "additionalDays": 3,
  "reason": "string"
}
```

---

## 5. Messaging APIs

### 5.1 Get Conversations

**GET** `/messages/conversations`

🔒 **Requires Authentication**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "string",
        "orderId": "ORD-123",
        "participant": {
          "id": "string",
          "name": "Ahmed Hassan",
          "nameAr": "أحمد حسن",
          "avatar": "url",
          "isOnline": true
        },
        "lastMessage": {
          "content": "string",
          "timestamp": "ISO date",
          "isRead": false
        },
        "unreadCount": 2,
        "orderContext": {
          "serviceTitle": "string",
          "package": "Standard",
          "price": 100
        }
      }
    ]
  }
}
```

---

### 5.2 Get Messages

**GET** `/messages/{orderId}`

🔒 **Requires Authentication**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Messages per page (default: 50) |
| `before` | string | ISO date - get messages before this date |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "string",
        "sender": "expert" | "customer",
        "senderName": "string",
        "message": "string",
        "messageAr": "string",
        "timestamp": "ISO date",
        "read": true,
        "attachments": [
          {
            "id": "string",
            "name": "file.jpg",
            "type": "image" | "file",
            "size": "1.2 MB",
            "url": "url"
          }
        ]
      }
    ],
    "pagination": { /* ... */ },
    "orderContext": {
      "id": "ORD-123",
      "serviceTitle": "string",
      "serviceTitleAr": "string",
      "package": "Standard",
      "packageAr": "القياسية",
      "price": 100,
      "deliveryDate": "2024-02-06",
      "daysRemaining": 3,
      "status": "in_progress"
    }
  }
}
```

---

### 5.3 Send Message

**POST** `/messages/{orderId}`

🔒 **Requires Authentication**

**Request Body (multipart/form-data):**
```json
{
  "message": "string",
  "attachments": ["File1", "File2"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "timestamp": "ISO date"
  }
}
```

---

### 5.4 Mark Messages as Read

**POST** `/messages/{orderId}/read`

🔒 **Requires Authentication**

---

## 6. Notification APIs

### 6.1 Get Notifications

**GET** `/notifications`

🔒 **Requires Authentication**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | string | `all`, `unread` |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "string",
        "type": "order_delivered" | "message" | "review_reminder" | "payment_released" | "order_started" | "deadline_approaching",
        "title": "Order Delivered",
        "titleAr": "تم تسليم الطلب",
        "message": "string",
        "messageAr": "string",
        "time": "5 minutes ago",
        "timeAr": "منذ 5 دقائق",
        "read": false,
        "link": "/order-detail/ORD-123",
        "createdAt": "ISO date"
      }
    ],
    "unreadCount": 5,
    "pagination": { /* ... */ }
  }
}
```

---

### 6.2 Mark Notification as Read

**POST** `/notifications/{notificationId}/read`

🔒 **Requires Authentication**

---

### 6.3 Mark All as Read

**POST** `/notifications/read-all`

🔒 **Requires Authentication**

---

### 6.4 Delete Notification

**DELETE** `/notifications/{notificationId}`

🔒 **Requires Authentication**

---

### 6.5 Clear All Notifications

**DELETE** `/notifications`

🔒 **Requires Authentication**

---

### 6.6 Get Notification Preferences

**GET** `/notifications/preferences`

🔒 **Requires Authentication**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "email": {
      "orderUpdates": true,
      "messages": true,
      "promotions": false
    },
    "push": {
      "orderUpdates": true,
      "messages": true,
      "promotions": false
    }
  }
}
```

---

### 6.7 Update Notification Preferences

**PUT** `/notifications/preferences`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "email": {
    "orderUpdates": true,
    "messages": true,
    "promotions": false
  },
  "push": {
    "orderUpdates": true,
    "messages": true,
    "promotions": false
  }
}
```

---

## 7. Payment & Earnings APIs

### 7.1 Get Earnings Summary (Expert)

**GET** `/earnings`

🔒 **Requires Authentication (Expert only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 12450,
    "availableBalance": 2450,
    "pendingPayments": 1200,
    "thisMonth": 3680,
    "currency": "USD"
  }
}
```

---

### 7.2 Get Transactions (Expert)

**GET** `/earnings/transactions`

🔒 **Requires Authentication (Expert only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | `all`, `earning`, `withdrawal`, `commission` |
| `startDate` | string | ISO date |
| `endDate` | string | ISO date |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN-001",
        "type": "earning" | "withdrawal" | "commission",
        "description": "Order #ORD-001 completed",
        "descriptionAr": "اكتمال الطلب #ORD-001",
        "amount": 100,
        "date": "2024-02-05",
        "status": "completed" | "pending" | "failed"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

### 7.3 Request Withdrawal

**POST** `/earnings/withdraw`

🔒 **Requires Authentication (Expert only)**

**Request Body:**
```json
{
  "amount": 500,
  "withdrawalMethod": "bank" | "paypal" | "wise",
  "accountDetails": {
    "bankAccountId": "string"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "withdrawalId": "WD-123",
    "estimatedArrival": "3-5 business days"
  }
}
```

---

### 7.4 Get Withdrawal Methods

**GET** `/earnings/withdrawal-methods`

🔒 **Requires Authentication (Expert only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "string",
        "type": "bank" | "paypal" | "wise",
        "name": "Bank Account (****1234)",
        "isDefault": true
      }
    ]
  }
}
```

---

### 7.5 Add Withdrawal Method

**POST** `/earnings/withdrawal-methods`

🔒 **Requires Authentication (Expert only)**

**Request Body:**
```json
{
  "type": "bank" | "paypal" | "wise",
  "details": {
    "accountNumber": "string",
    "bankName": "string",
    "routingNumber": "string"
  }
}
```

---

### 7.6 Create Payment Intent (Customer)

**POST** `/payments/create-intent`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "orderId": "string",
  "paymentMethod": "card" | "paypal"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "string",
    "paymentIntentId": "string"
  }
}
```

---

### 7.7 Confirm Payment

**POST** `/payments/confirm`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "paymentIntentId": "string"
}
```

---

## 8. Support Ticket APIs

### 8.1 Get Tickets

**GET** `/tickets`

🔒 **Requires Authentication**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `all`, `open`, `in_progress`, `resolved` |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "TKT-001",
        "subject": "Payment not received",
        "subjectAr": "لم أستلم الدفعة",
        "status": "open" | "in_progress" | "resolved",
        "priority": "low" | "medium" | "high",
        "date": "2024-02-05",
        "lastUpdate": "2 hours ago",
        "lastUpdateAr": "منذ ساعتين",
        "messagesCount": 3
      }
    ],
    "counts": {
      "all": 10,
      "open": 3,
      "resolved": 7
    },
    "pagination": { /* ... */ }
  }
}
```

---

### 8.2 Get Ticket Detail

**GET** `/tickets/{ticketId}`

🔒 **Requires Authentication**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "TKT-001",
    "subject": "string",
    "subjectAr": "string",
    "status": "open",
    "priority": "high",
    "createdAt": "ISO date",
    "messages": [
      {
        "id": "string",
        "sender": "user" | "support",
        "senderName": "string",
        "content": "string",
        "timestamp": "ISO date",
        "attachments": []
      }
    ]
  }
}
```

---

### 8.3 Create Ticket

**POST** `/tickets`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "subject": "string",
  "description": "string",
  "priority": "low" | "medium" | "high",
  "attachments": ["File"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "ticketId": "TKT-001"
  }
}
```

---

### 8.4 Reply to Ticket

**POST** `/tickets/{ticketId}/reply`

🔒 **Requires Authentication**

**Request Body:**
```json
{
  "message": "string",
  "attachments": ["File"]
}
```

---

### 8.5 Close Ticket

**POST** `/tickets/{ticketId}/close`

🔒 **Requires Authentication**

---

## 9. Admin APIs

### 9.1 Get Dashboard Stats

**GET** `/admin/dashboard`

🔒 **Requires Authentication (Admin only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 15420,
    "totalExperts": 3250,
    "totalServices": 8540,
    "totalOrders": 45230,
    "totalRevenue": 1250000,
    "pendingApprovals": {
      "services": 24,
      "experts": 12
    },
    "activeDisputes": 8,
    "revenueChart": [
      { "date": "2024-01", "revenue": 125000 }
    ]
  }
}
```

---

### 9.2 Get Users (Admin)

**GET** `/admin/users`

🔒 **Requires Authentication (Admin only)**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | `all`, `customer`, `expert` |
| `status` | string | `all`, `active`, `pending_verification`, `suspended` |
| `search` | string | Search by name/email |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "USR-001",
        "name": "Sarah Johnson",
        "nameAr": "سارة جونسون",
        "email": "sarah@example.com",
        "type": "expert" | "customer",
        "status": "active" | "pending_verification" | "suspended",
        "verified": true,
        "trustBadge": true,
        "orders": 156,
        "revenue": 15600,
        "rating": 4.9,
        "joinDate": "2023-06-15"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

### 9.3 Get User Detail (Admin)

**GET** `/admin/users/{userId}`

🔒 **Requires Authentication (Admin only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "USR-001",
    "name": "string",
    "email": "string",
    "type": "expert",
    "status": "active",
    "verified": true,
    "trustBadge": true,
    "stats": {
      "orders": 156,
      "revenue": 15600,
      "rating": 4.9
    },
    "verificationDocuments": [
      {
        "id": "string",
        "name": "ID_Document.pdf",
        "type": "id" | "address_proof",
        "url": "url",
        "status": "pending" | "approved" | "rejected"
      }
    ]
  }
}
```

---

### 9.4 Approve User Verification (Admin)

**POST** `/admin/users/{userId}/approve-verification`

🔒 **Requires Authentication (Admin only)**

---

### 9.5 Grant Trust Badge (Admin)

**POST** `/admin/users/{userId}/trust-badge`

🔒 **Requires Authentication (Admin only)**

---

### 9.6 Suspend User (Admin)

**POST** `/admin/users/{userId}/suspend`

🔒 **Requires Authentication (Admin only)**

**Request Body:**
```json
{
  "reason": "string"
}
```

---

### 9.7 Get Services for Approval (Admin)

**GET** `/admin/services/pending`

🔒 **Requires Authentication (Admin only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "SRV-001",
        "title": "string",
        "titleAr": "string",
        "expert": {
          "id": "string",
          "name": "string"
        },
        "price": 100,
        "status": "pending",
        "submittedDate": "2024-02-05",
        "category": "Design",
        "description": "string",
        "imagesCount": 3
      }
    ],
    "stats": {
      "pending": 24,
      "avgApprovalTime": "4.2h",
      "approvedToday": 12,
      "rejectionRate": 8
    }
  }
}
```

---

### 9.8 Approve Service (Admin)

**POST** `/admin/services/{serviceId}/approve`

🔒 **Requires Authentication (Admin only)**

---

### 9.9 Reject Service (Admin)

**POST** `/admin/services/{serviceId}/reject`

🔒 **Requires Authentication (Admin only)**

**Request Body:**
```json
{
  "reason": "string",
  "feedback": "string"
}
```

---

### 9.10 Get Payment Overview (Admin)

**GET** `/admin/payments`

🔒 **Requires Authentication (Admin only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalEscrow": 45230,
      "pending": 12450,
      "disputes": 8,
      "released": 186420
    },
    "gateways": [
      {
        "name": "Stripe",
        "status": "active",
        "transactions": 12450,
        "fees": "2.9% + $0.30"
      }
    ]
  }
}
```

---

### 9.11 Get Escrow Transactions (Admin)

**GET** `/admin/payments/escrow`

🔒 **Requires Authentication (Admin only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "ESC-001",
        "orderId": "ORD-123",
        "amount": 100,
        "customer": "Sarah Johnson",
        "expert": "Ahmed Hassan",
        "status": "pending_delivery" | "awaiting_approval" | "released",
        "date": "2024-02-05"
      }
    ]
  }
}
```

---

### 9.12 Release Escrow Payment (Admin)

**POST** `/admin/payments/escrow/{transactionId}/release`

🔒 **Requires Authentication (Admin only)**

---

### 9.13 Get Disputes (Admin)

**GET** `/admin/payments/disputes`

🔒 **Requires Authentication (Admin only)**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "disputes": [
      {
        "id": "DIS-001",
        "orderId": "ORD-123",
        "amount": 350,
        "customer": "Emma Williams",
        "expert": "Omar Ali",
        "reason": "Quality dispute",
        "status": "under_review" | "resolved",
        "date": "2024-02-03"
      }
    ]
  }
}
```

---

### 9.14 Resolve Dispute (Admin)

**POST** `/admin/payments/disputes/{disputeId}/resolve`

🔒 **Requires Authentication (Admin only)**

**Request Body:**
```json
{
  "resolution": "refund_customer" | "release_to_expert" | "partial_refund",
  "refundAmount": 175,
  "notes": "string"
}
```

---

## 10. Review APIs

### 10.1 Get Service Reviews

**GET** `/services/{serviceId}/reviews`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `rating` | number | Filter by rating (1-5) |
| `sortBy` | string | `newest`, `helpful`, `rating-high`, `rating-low` |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "string",
        "user": {
          "name": "سارة أحمد",
          "avatar": "url",
          "country": "السعودية",
          "countryFlag": "🇸🇦"
        },
        "rating": 5,
        "comment": "string",
        "date": "2024-01-28",
        "helpfulCount": 12,
        "sellerReply": {
          "comment": "string",
          "date": "2024-01-28"
        }
      }
    ],
    "summary": {
      "averageRating": 4.9,
      "totalReviews": 285,
      "ratingBreakdown": {
        "5": 245,
        "4": 30,
        "3": 8,
        "2": 2,
        "1": 0
      }
    },
    "pagination": { /* ... */ }
  }
}
```

---

### 10.2 Create Review

**POST** `/orders/{orderId}/review`

🔒 **Requires Authentication (Customer only)**

**Request Body:**
```json
{
  "rating": 5,
  "comment": "string"
}
```

---

### 10.3 Reply to Review (Expert)

**POST** `/reviews/{reviewId}/reply`

🔒 **Requires Authentication (Expert only)**

**Request Body:**
```json
{
  "comment": "string"
}
```

---

### 10.4 Mark Review as Helpful

**POST** `/reviews/{reviewId}/helpful`

🔒 **Requires Authentication**

---

## 11. Category APIs

### 11.1 Get Categories

**GET** `/categories`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "design",
        "slug": "design",
        "name": "تصميم وجرافيك",
        "nameEn": "Design & Graphics",
        "icon": "🎨",
        "description": "string",
        "descriptionEn": "string",
        "servicesCount": 1250,
        "subcategories": [
          {
            "id": "logo-design",
            "slug": "logo-design",
            "name": "تصميم شعارات",
            "nameEn": "Logo Design",
            "servicesCount": 450
          }
        ]
      }
    ]
  }
}
```

---

### 11.2 Get Category Details

**GET** `/categories/{categorySlug}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "design",
    "slug": "design",
    "name": "تصميم وجرافيك",
    "nameEn": "Design & Graphics",
    "icon": "🎨",
    "description": "string",
    "descriptionEn": "string",
    "heroImage": "url",
    "servicesCount": 1250,
    "subcategories": [
      {
        "id": "logo-design",
        "slug": "logo-design",
        "name": "تصميم شعارات",
        "nameEn": "Logo Design",
        "servicesCount": 450
      }
    ],
    "popularServices": [
      { /* service object */ }
    ]
  }
}
```

---

## File Upload API

### Upload File

**POST** `/upload`

🔒 **Requires Authentication**

**Request (multipart/form-data):**
- `file`: File
- `type`: `service-image` | `portfolio` | `attachment` | `avatar` | `verification`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.aservicea.com/uploads/xxx.jpg",
    "fileId": "string",
    "fileName": "original-name.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

---

## WebSocket Events

For real-time features, connect to: `wss://api.aservicea.com/ws`

### Events:

| Event | Direction | Description |
|-------|-----------|-------------|
| `new_message` | Server → Client | New message received |
| `message_read` | Server → Client | Message marked as read |
| `order_status_changed` | Server → Client | Order status updated |
| `new_notification` | Server → Client | New notification |
| `user_online` | Server → Client | User came online |
| `user_offline` | Server → Client | User went offline |
| `typing_start` | Client → Server | User started typing |
| `typing_stop` | Client → Server | User stopped typing |

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "messageAr": "رسالة بالعربية",
    "details": { /* optional additional details */ }
  }
}
```

### Common Error Codes:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Not allowed to access resource |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **General API**: 100 requests per minute
- **Authentication**: 10 requests per minute
- **File Upload**: 20 requests per minute

---

## Pagination

All paginated endpoints support these parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10-50 | Items per page |

Response includes:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Localization

Include the `Accept-Language` header to receive localized content:

```
Accept-Language: ar
Accept-Language: en
```

Or use the `lang` query parameter:

```
GET /services?lang=ar
```

---

## Summary

This API documentation covers all endpoints needed to replace mock data in the aSERVICEa frontend. The main modules are:

1. **Authentication** - User registration, login, social auth
2. **Users** - Profile management, expert profiles
3. **Services** - CRUD operations, marketplace listing
4. **Orders** - Order lifecycle management
5. **Messages** - Real-time messaging
6. **Notifications** - Push and in-app notifications
7. **Payments** - Earnings, withdrawals, escrow
8. **Tickets** - Support system
9. **Admin** - Administrative operations
10. **Reviews** - Service ratings and reviews
11. **Categories** - Service categorization

Total: **70+ API endpoints**
