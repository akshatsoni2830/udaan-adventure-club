# Design Document: Backend Migration and Security

## Overview

This design outlines the migration of the Ahmedabad Adventure Club Next.js website from Excel-based data storage to a database-backed system with secure API endpoints. The solution uses SQLite for rapid deployment with a clear migration path to PostgreSQL, implements comprehensive security measures, and provides an admin panel for content management. The architecture prioritizes simplicity for quick Hostinger deployment while maintaining production-ready quality.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    Client[Next.js Frontend]
    API[API Layer - Next.js Routes]
    DB[(SQLite Database)]
    Admin[Admin Panel]
    Middleware[Security Middleware]
    
    Client -->|HTTP Requests| Middleware
    Middleware -->|Rate Limited| API
    API -->|ORM Queries| DB
    Admin -->|Authenticated| API
    
    subgraph "Security Layer"
        Middleware
        RateLimit[Rate Limiter]
        CSRF[CSRF Protection]
        Validation[Input Validation]
    end
    
    subgraph "Data Layer"
        DB
        Migration[Migration Scripts]
    end
```

### Technology Stack

- **Database**: SQLite with Prisma ORM (enables PostgreSQL migration)
- **API Framework**: Next.js 15 API Routes
- **Security**: 
  - Rate limiting: `express-rate-limit` or custom middleware
  - Input validation: `zod` for schema validation
  - CSRF: `csrf` package or Next.js built-in
- **Authentication**: Simple session-based auth with `bcrypt` for password hashing
- **Logging**: `winston` or `pino` for structured logging
- **Image Optimization**: Next.js Image component with lazy loading

### Deployment Architecture

```mermaid
graph LR
    Hostinger[Hostinger Server]
    App[Next.js App]
    SQLite[(SQLite DB)]
    Images[/images/]
    Logs[/logs/]
    
    Hostinger --> App
    App --> SQLite
    App --> Images
    App --> Logs
```

## Components and Interfaces

### 1. Database Schema

**Prisma Schema** (schema.prisma):

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Package {
  id                  Int      @id @default(autoincrement())
  title               String
  duration            String
  departureCities     String   // JSON array stored as string
  fixedDepartures     String   // JSON array stored as string
  costDetails         String   // JSON array of {description, price}
  inclusions          String   // JSON array stored as string
  notes               String   // JSON array stored as string
  itemsToCarry        String   // JSON array stored as string
  paymentTerms        String   // JSON array stored as string
  cancellationTerms   String   // JSON array stored as string
  images              String   // JSON array stored as string
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model Destination {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  images      String   // JSON array stored as string
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Enquiry {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  phone     String?
  message   String
  status    String   @default("new") // new, read, resolved
  createdAt DateTime @default(now())
  
  @@index([email, createdAt])
}

model AdminUser {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

### 2. API Endpoints

#### Package Endpoints

**GET /api/packages**
- Returns: Array of all packages
- Response: `{ packages: Package[] }`
- Status: 200 (success), 500 (error)

**GET /api/packages/[id]**
- Returns: Single package by ID
- Response: `{ package: Package }`
- Status: 200 (success), 404 (not found), 500 (error)

**POST /api/packages** (Admin only)
- Body: Package data
- Returns: Created package
- Response: `{ package: Package }`
- Status: 201 (created), 400 (validation error), 401 (unauthorized), 500 (error)

**PUT /api/packages/[id]** (Admin only)
- Body: Updated package data
- Returns: Updated package
- Response: `{ package: Package }`
- Status: 200 (success), 400 (validation error), 401 (unauthorized), 404 (not found), 500 (error)

**DELETE /api/packages/[id]** (Admin only)
- Returns: Success message
- Response: `{ message: string }`
- Status: 200 (success), 401 (unauthorized), 404 (not found), 500 (error)

#### Destination Endpoints

**GET /api/destinations**
- Returns: Array of all destinations
- Response: `{ destinations: Destination[] }`
- Status: 200 (success), 500 (error)

**GET /api/destinations/[id]**
- Returns: Single destination by ID
- Response: `{ destination: Destination }`
- Status: 200 (success), 404 (not found), 500 (error)

**POST /api/destinations** (Admin only)
- Body: Destination data
- Returns: Created destination
- Response: `{ destination: Destination }`
- Status: 201 (created), 400 (validation error), 401 (unauthorized), 500 (error)

**PUT /api/destinations/[id]** (Admin only)
- Body: Updated destination data
- Returns: Updated destination
- Response: `{ destination: Destination }`
- Status: 200 (success), 400 (validation error), 401 (unauthorized), 404 (not found), 500 (error)

**DELETE /api/destinations/[id]** (Admin only)
- Returns: Success message
- Response: `{ message: string }`
- Status: 200 (success), 401 (unauthorized), 404 (not found), 500 (error)

#### Enquiry Endpoints

**POST /api/enquiry**
- Body: `{ name: string, email: string, phone?: string, message: string }`
- Returns: Success message
- Response: `{ success: boolean, message: string }`
- Status: 201 (created), 400 (validation error), 429 (rate limited), 500 (error)

**GET /api/admin/enquiries** (Admin only)
- Returns: Array of all enquiries
- Response: `{ enquiries: Enquiry[] }`
- Status: 200 (success), 401 (unauthorized), 500 (error)

**PATCH /api/admin/enquiries/[id]** (Admin only)
- Body: `{ status: "new" | "read" | "resolved" }`
- Returns: Updated enquiry
- Response: `{ enquiry: Enquiry }`
- Status: 200 (success), 400 (validation error), 401 (unauthorized), 404 (not found), 500 (error)

#### Admin & Utility Endpoints

**POST /api/admin/login**
- Body: `{ username: string, password: string }`
- Returns: Session token
- Response: `{ success: boolean, message: string }`
- Status: 200 (success), 401 (invalid credentials), 500 (error)

**POST /api/admin/logout**
- Returns: Success message
- Response: `{ success: boolean }`
- Status: 200 (success)

**GET /api/health**
- Returns: System health status
- Response: `{ status: "ok", database: "connected", timestamp: string }`
- Status: 200 (success), 500 (error)

### 3. Validation Schemas

Using Zod for runtime validation:

```typescript
// Package validation
const PackageSchema = z.object({
  title: z.string().min(1).max(200),
  duration: z.string().min(1),
  departureCities: z.array(z.string()),
  fixedDepartures: z.array(z.string()),
  costDetails: z.array(z.object({
    description: z.string(),
    price: z.string()
  })),
  inclusions: z.array(z.string()),
  notes: z.array(z.string()),
  itemsToCarry: z.array(z.string()),
  paymentTerms: z.array(z.string()),
  cancellationTerms: z.array(z.string()),
  images: z.array(z.string().url())
});

// Destination validation
const DestinationSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  images: z.array(z.string().url())
});

// Enquiry validation
const EnquirySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(1000)
});
```

### 4. Security Middleware

**Rate Limiter Middleware**:

```typescript
// lib/middleware/rateLimiter.ts
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = { count: 1, resetTime: now + windowMs };
      return null; // Allow request
    }
    
    if (store[ip].count >= maxRequests) {
      return new Response('Too many requests', { status: 429 });
    }
    
    store[ip].count++;
    return null; // Allow request
  };
}
```

**Authentication Middleware**:

```typescript
// lib/middleware/auth.ts
import { cookies } from 'next/headers';

export async function requireAuth(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Verify session (simple implementation)
  const isValid = await verifySession(session.value);
  if (!isValid) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  return null; // Allow request
}
```

### 5. Migration Script

**scripts/migrate-excel-to-db.ts**:

```typescript
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migratePackages() {
  const workbook = XLSX.readFile('public/packages_summary.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  for (const row of data) {
    await prisma.package.create({
      data: {
        id: row.ID,
        title: row.Title,
        duration: row.Duration,
        departureCities: row["Departure Cities"],
        fixedDepartures: row["Fixed Departures"],
        costDetails: row["Cost Details"],
        inclusions: row.Inclusions,
        notes: row.Notes,
        itemsToCarry: row["Items to Carry"],
        paymentTerms: row["Payment Terms"],
        cancellationTerms: row["Cancellation Terms"],
        images: row.Images
      }
    });
  }
}

async function migrateDestinations() {
  const destinations = [
    { id: 1, title: "Ladakh", description: "High-altitude desert region", images: "/eg7.jpg" },
    { id: 2, title: "Spiti Valley", description: "Remote mountain valley", images: "/eg8.jpg" },
    { id: 3, title: "Meghalaya", description: "Lush green hills", images: "/eg9.jpg" },
    { id: 4, title: "Rajasthan", description: "Royal heritage", images: "/desert.jpg" },
    { id: 5, title: "Kerala", description: "Backwaters paradise", images: "/kerela.jpg" }
  ];
  
  for (const dest of destinations) {
    await prisma.destination.create({ data: dest });
  }
}

async function main() {
  await migratePackages();
  await migrateDestinations();
  console.log('Migration complete!');
}

main();
```

### 6. Admin Panel Components

**Admin Layout** (/admin/layout.tsx):
- Navigation sidebar with links to Packages, Destinations, Enquiries
- Logout button
- Protected route wrapper

**Package Management** (/admin/packages):
- List view with edit/delete actions
- Create new package form
- Edit package form with all fields
- Image upload interface

**Destination Management** (/admin/destinations):
- List view with edit/delete actions
- Create new destination form
- Edit destination form

**Enquiry Management** (/admin/enquiries):
- Table view with columns: Name, Email, Phone, Message, Status, Date
- Filter by status (new, read, resolved)
- Mark as read/resolved actions
- Sort by date (newest first)

## Data Models

### Package Model

```typescript
interface Package {
  id: number;
  title: string;
  duration: string;
  departureCities: string[];
  fixedDepartures: string[];
  costDetails: CostDetail[];
  inclusions: string[];
  notes: string[];
  itemsToCarry: string[];
  paymentTerms: string[];
  cancellationTerms: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CostDetail {
  description: string;
  price: string;
}
```

### Destination Model

```typescript
interface Destination {
  id: number;
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Enquiry Model

```typescript
interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following consolidations to eliminate redundancy:

**Consolidations:**
1. Properties 1.5, 1.6, and 4.4 (round-trip for packages, destinations, enquiries) can be combined into a single "Data persistence round-trip" property
2. Properties 2.1, 2.3, 6.2, and 6.3 (fetching all records) can be combined into a single "Complete data retrieval" property
3. Properties 2.2 and 2.4 (fetching by ID) can be combined into a single "ID-based retrieval" property
4. Properties 4.1, 10.1, and 10.2 (required field validation) can be combined into a single "Required field validation" property
5. Properties 10.3, 10.4, and 10.5 (format validation) can be combined into a single "Data format validation" property
6. Properties 3.5 and 9.5 (error message sanitization) are redundant - keep one comprehensive property
7. Properties 9.1 and 9.2 (error logging) can be combined into a single "Comprehensive error logging" property

**Unique Properties to Keep:**
- Migration data completeness (1.3)
- Rate limiting behavior (3.2)
- Input sanitization (3.3)
- Duplicate enquiry prevention (4.6)
- Enquiry status codes (4.3, 4.5)
- Admin action logging (9.6)
- Unique ID enforcement (10.6)
- Validation error messages (10.7)
- API error handling (2.5, 7.4)

### Correctness Properties

Property 1: Data persistence round-trip
*For any* valid package, destination, or enquiry, storing it in the database and then retrieving it should return an equivalent object with all fields preserved
**Validates: Requirements 1.5, 1.6, 4.4**

Property 2: Migration data completeness
*For any* Excel file containing valid package data, running the migration script should result in all records being present in the database with no data loss
**Validates: Requirements 1.3**

Property 3: Complete data retrieval
*For any* set of packages or destinations in the database, calling the respective GET /api/packages or GET /api/destinations endpoint should return all records
**Validates: Requirements 2.1, 2.3, 6.2, 6.3**

Property 4: ID-based retrieval accuracy
*For any* valid package ID or destination ID in the database, calling GET /api/packages/[id] or GET /api/destinations/[id] should return exactly that record with all fields intact
**Validates: Requirements 2.2, 2.4**

Property 5: Invalid ID error handling
*For any* non-existent or malformed ID, API endpoints should return a 404 status with an appropriate error message
**Validates: Requirements 2.5**

Property 6: Input sanitization
*For any* input containing malicious patterns (SQL injection attempts, XSS payloads, script tags), the system should reject or sanitize the input before processing
**Validates: Requirements 3.3**

Property 7: Error message sanitization
*For any* error that occurs in the system, the client response should not contain sensitive information such as stack traces, database connection strings, or internal file paths
**Validates: Requirements 3.5, 9.5**

Property 8: Required field validation
*For any* package, destination, or enquiry data missing required fields (Title, Duration, Cost Details for packages; Title, Description for destinations; name, email, message for enquiries), validation should fail and return a 400 status
**Validates: Requirements 4.1, 10.1, 10.2**

Property 9: Enquiry submission success
*For any* valid enquiry data, submitting to POST /api/enquiry should return a 201 status and the enquiry should be retrievable from the database with all fields including timestamp
**Validates: Requirements 4.2, 4.3**

Property 10: Email format validation
*For any* enquiry with an invalid email format (missing @, invalid domain, malformed), the API should reject it with a 400 status
**Validates: Requirements 4.5**

Property 11: Duplicate enquiry prevention
*For any* email address, submitting two enquiries within 5 minutes should result in the second submission being rejected
**Validates: Requirements 4.6**

Property 12: Data format validation
*For any* package with invalid cost details format, invalid image paths, or invalid date formats, validation should fail and return specific error messages
**Validates: Requirements 10.3, 10.4, 10.5**

Property 13: Admin data updates
*For any* authenticated admin user making valid updates to packages or destinations, the changes should be persisted in the database and reflected in subsequent API calls
**Validates: Requirements 6.6**

Property 14: Enquiry sorting
*For any* set of enquiries in the database, the admin panel should display them sorted by timestamp in descending order (newest first)
**Validates: Requirements 6.7**

Property 15: Enquiry status updates
*For any* enquiry, updating its status to "read" or "resolved" through the admin panel should persist the change in the database
**Validates: Requirements 6.8**

Property 16: API error handling
*For any* API request that fails (network error, timeout, 500 response), the frontend should display a user-friendly error message without crashing
**Validates: Requirements 7.4**

Property 17: Comprehensive error logging
*For any* error that occurs in API endpoints or database operations, the system should log the error with timestamp, endpoint/operation, error details, and context
**Validates: Requirements 9.1, 9.2**

Property 18: Admin action audit logging
*For any* admin action (create, update, delete on packages/destinations), the system should create a log entry with the action type, user, timestamp, and affected resource
**Validates: Requirements 9.6**

Property 19: Unique ID enforcement
*For any* attempt to create a package or destination with an ID that already exists, the system should reject the operation with an appropriate error
**Validates: Requirements 10.6**

Property 20: Validation error specificity
*For any* validation failure, the error response should include specific field names and reasons for validation failure
**Validates: Requirements 10.7**

## Error Handling

### Error Categories

1. **Validation Errors (400)**
   - Missing required fields
   - Invalid data formats
   - Failed schema validation
   - Response: `{ error: string, fields?: string[] }`

2. **Authentication Errors (401)**
   - Missing or invalid session
   - Expired authentication
   - Response: `{ error: "Unauthorized" }`

3. **Not Found Errors (404)**
   - Invalid resource ID
   - Resource deleted
   - Response: `{ error: "Resource not found" }`

4. **Rate Limit Errors (429)**
   - Too many requests from IP
   - Response: `{ error: "Too many requests", retryAfter: number }`

5. **Server Errors (500)**
   - Database connection failures
   - Unhandled exceptions
   - Response: `{ error: "Internal server error" }`

### Error Logging Strategy

```typescript
interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  endpoint?: string;
  method?: string;
  statusCode?: number;
  message: string;
  stack?: string; // Only in development
  userId?: string; // For admin actions
  context?: Record<string, any>;
}
```

**Logging Rules:**
- All errors logged with full context in development
- Production logs exclude stack traces from client responses
- Database errors log query type (not full query with data)
- Admin actions logged with user ID and timestamp
- Logs rotated daily, kept for 30 days

### Error Recovery

- **Database Connection Loss**: Retry with exponential backoff (3 attempts)
- **Transaction Failures**: Automatic rollback, return error to client
- **File System Errors**: Log error, return generic message to client
- **Validation Errors**: Return specific field errors to help user correct input

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of valid and invalid data
- Edge cases (empty strings, null values, boundary conditions)
- Integration points (API routes, database connections)
- Error conditions (database failures, network errors)
- Configuration checks (file locations, environment variables)

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Data integrity across operations (round-trip properties)
- Validation rules across all possible invalid inputs
- Security properties (sanitization, authentication)
- Comprehensive input coverage through randomization

### Property-Based Testing Configuration

**Library**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: backend-migration-and-security, Property {number}: {property_text}**
- Generators for: packages, destinations, enquiries, malicious inputs, invalid data

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';

// Feature: backend-migration-and-security, Property 1: Data persistence round-trip
test('Package round-trip preserves all fields', () => {
  fc.assert(
    fc.property(packageGenerator(), async (pkg) => {
      const created = await createPackage(pkg);
      const retrieved = await getPackage(created.id);
      expect(retrieved).toEqual(created);
    }),
    { numRuns: 100 }
  );
});
```

### Test Coverage Requirements

- **API Endpoints**: 100% coverage of all routes
- **Validation Logic**: All validation rules tested with valid and invalid inputs
- **Security Middleware**: Rate limiting, authentication, input sanitization
- **Database Operations**: CRUD operations for all models
- **Error Handling**: All error paths tested
- **Migration Script**: Verified with sample Excel data

### Integration Testing

- Test complete user flows: browse packages → view details → submit enquiry
- Test admin flows: login → create package → edit package → delete package
- Test error scenarios: database unavailable, invalid data, authentication failures
- Test rate limiting with concurrent requests
- Test migration script with various Excel file formats

### Manual Testing Checklist

- [ ] Deploy to Hostinger and verify all endpoints work
- [ ] Test admin panel in production environment
- [ ] Verify images load correctly with lazy loading
- [ ] Test enquiry form submission and email validation
- [ ] Verify rate limiting works in production
- [ ] Check logs are being written correctly
- [ ] Test database backup and restore procedures
- [ ] Verify environment variables are properly configured

## Deployment Guide

### Prerequisites

- Node.js 18+ installed on Hostinger
- SSH access to server
- Domain configured and pointing to server

### Deployment Steps

1. **Prepare Environment**
   ```bash
   # Clone repository
   git clone <repo-url>
   cd ahmedabad-adventure-club-main
   
   # Install dependencies
   npm install
   
   # Copy environment file
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   ```env
   DATABASE_URL="file:./data/adventure-club.db"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD_HASH="<bcrypt-hash>"
   NODE_ENV="production"
   NEXT_PUBLIC_API_URL="https://yourdomain.com"
   ```

3. **Initialize Database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create database and tables
   npx prisma db push
   
   # Run migration script
   npm run migrate
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Start Production Server**
   ```bash
   # Using PM2 for process management
   npm install -g pm2
   pm2 start npm --name "adventure-club" -- start
   pm2 save
   pm2 startup
   ```

6. **Verify Deployment**
   ```bash
   # Check health endpoint
   curl https://yourdomain.com/api/health
   
   # Check packages endpoint
   curl https://yourdomain.com/api/packages
   ```

7. **Post-Deployment**
   - Remove Excel files from public folder
   - Test admin panel login
   - Submit test enquiry
   - Monitor logs for errors
   - Set up log rotation

### Rollback Plan

If deployment fails:
1. Keep old Excel-based version running
2. Restore database from backup
3. Revert to previous Git commit
4. Restart application

### Monitoring

- Check `/api/health` endpoint every 5 minutes
- Monitor log files in `/logs` directory
- Set up alerts for 500 errors
- Track enquiry submission rate
- Monitor database size growth

## Security Considerations

### Data Protection

- Database file stored outside public directory
- Environment variables for sensitive configuration
- Password hashing with bcrypt (10 rounds)
- Session tokens with secure, httpOnly cookies

### Input Validation

- All user inputs validated with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS prevention via input sanitization
- Email validation with regex and format checking

### Rate Limiting

- 100 requests per minute per IP for public endpoints
- 20 requests per minute for enquiry submission
- 50 requests per minute for admin endpoints
- Rate limit bypass for health check endpoint

### Authentication

- Admin panel requires username/password
- Sessions expire after 24 hours
- Failed login attempts logged
- No password reset (manual admin intervention required for MVP)

### HTTPS

- Enforce HTTPS in production
- Redirect HTTP to HTTPS
- Secure cookie flags enabled

## Performance Optimization

### Database

- Indexes on frequently queried fields (email + createdAt for enquiries)
- Connection pooling for concurrent requests
- Query optimization with Prisma

### API

- Response caching for GET /api/packages and /api/destinations (5 minutes)
- Gzip compression for API responses
- Pagination for large result sets (future enhancement)

### Images

- Next.js Image component for automatic optimization
- Lazy loading for below-the-fold images
- Priority loading for hero images
- WebP format with fallbacks

### Frontend

- Static generation for public pages where possible
- API data fetching with SWR or React Query for caching
- Loading states to improve perceived performance
- Error boundaries to prevent full page crashes

## Migration Path to PostgreSQL

When ready to migrate from SQLite to PostgreSQL:

1. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Export SQLite Data**
   ```bash
   npx prisma db pull
   ```

3. **Update DATABASE_URL**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

4. **Migrate to PostgreSQL**
   ```bash
   npx prisma db push
   npm run migrate
   ```

5. **Verify Data**
   - Check record counts match
   - Test all API endpoints
   - Verify admin panel functionality

No code changes required due to Prisma abstraction layer.
