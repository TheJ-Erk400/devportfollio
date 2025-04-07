# CheckMate.io API Documentation

## Authentication

### Login
```typescript
POST /api/auth/login
```

Authenticates a user using various providers (Email, Google, GitHub).

**Request Body:**
```json
{
  "provider": "email" | "google" | "github",
  "credentials": {
    "email": string,
    "password": string
  }
}
```

**Response:**
```json
{
  "token": string,
  "user": {
    "id": string,
    "name": string,
    "email": string
  }
}
```

## Profile Management

### Create Profile
```typescript
POST /api/profiles
```

Creates a new AI-powered developer profile.

**Request Body:**
```json
{
  "githubUsername": string,
  "linkedinUrl": string,
  "resume": string,
  "preferences": {
    "theme": "light" | "dark",
    "layout": "standard" | "minimal"
  }
}
```

**Response:**
```json
{
  "id": string,
  "url": string,
  "qrCode": string,
  "generatedAt": string
}
```

### Get Profile
```typescript
GET /api/profiles/:id
```

Retrieves a specific profile by ID.

**Response:**
```json
{
  "id": string,
  "user": {
    "name": string,
    "title": string,
    "bio": string
  },
  "skills": string[],
  "projects": {
    "id": string,
    "name": string,
    "description": string,
    "technologies": string[]
  }[],
  "experience": {
    "company": string,
    "position": string,
    "duration": string,
    "description": string
  }[]
}
```

### Update Profile
```typescript
PUT /api/profiles/:id
```

Updates an existing profile.

**Request Body:**
```json
{
  "title": string,
  "bio": string,
  "skills": string[],
  "projects": {
    "id": string,
    "name": string,
    "description": string,
    "technologies": string[]
  }[]
}
```

## QR Code Generation

### Generate QR Code
```typescript
POST /api/qrcode
```

Generates a QR code for a profile.

**Request Body:**
```json
{
  "profileId": string,
  "size": number,
  "level": "L" | "M" | "Q" | "H"
}
```

**Response:**
```json
{
  "qrCode": string,
  "downloadUrl": string
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": {
    "code": string,
    "message": string,
    "details": object
  }
}
```

Common error codes:
- `AUTH_001`: Authentication failed
- `PROF_001`: Profile not found
- `PROF_002`: Invalid profile data
- `QR_001`: QR code generation failed 