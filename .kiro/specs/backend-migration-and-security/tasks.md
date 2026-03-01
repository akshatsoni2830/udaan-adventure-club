# Implementation Plan: Backend Migration and Security

## Overview

This implementation plan breaks down the backend migration into incremental, testable steps. The approach prioritizes core functionality (database, API, security) first, followed by admin panel and optimization features. Each task builds on previous work, ensuring the system remains functional throughout development.

## Tasks

- [x] 1. Set up database infrastructure and ORM
  - Install Prisma and SQLite dependencies
  - Create Prisma schema with Package, Destination, Enquiry, and AdminUser models
  - Generate Prisma client and initialize database
  - Create database directory outside public folder (./data/)
  - _Requirements: 1.1, 1.2, 1.7_

- [ ]* 1.1 Write unit test for database initialization
  - Test that all tables are created with correct schema
  - _Requirements: 1.2_

- [x] 2. Create Excel to database migration script
  - [x] 2.1 Implement migration script for packages
    - Read packages_summary.xlsx and packages_details.xlsx
    - Parse Excel data and transform to Prisma format
    - Insert all package records into database
    - _Requirements: 1.3, 1.5_
  
  - [x] 2.2 Implement migration script for destinations
    - Create destination records from static data
    - Insert all destination records into database
    - _Requirements: 1.3, 1.6_
  
  - [x] 2.3 Add migration CLI command
    - Create npm script to run migration
    - Add error handling and progress logging
    - _Requirements: 8.2_

- [ ]* 2.4 Write property test for migration data completeness
  - **Property 2: Migration data completeness**
  - **Validates: Requirements 1.3**

- [ ]* 2.5 Write property test for data persistence round-trip
  - **Property 1: Data persistence round-trip**
  - **Validates: Requirements 1.5, 1.6, 4.4**

- [x] 3. Implement validation schemas with Zod
  - Create PackageSchema with all fields and validation rules
  - Create DestinationSchema with required fields
  - Create EnquirySchema with email validation
  - Create helper functions for validation and error formatting
  - _Requirements: 3.3, 4.1, 10.1, 10.2, 10.3, 10.4, 10.5, 10.7_

- [ ]* 3.1 Write property test for required field validation
  - **Property 8: Required field validation**
  - **Validates: Requirements 4.1, 10.1, 10.2**

- [ ]* 3.2 Write property test for data format validation
  - **Property 12: Data format validation**
  - **Validates: Requirements 10.3, 10.4, 10.5**

- [ ]* 3.3 Write property test for email format validation
  - **Property 10: Email format validation**
  - **Validates: Requirements 4.5**

- [ ]* 3.4 Write property test for validation error specificity
  - **Property 20: Validation error specificity**
  - **Validates: Requirements 10.7**

- [x] 4. Create database utility functions
  - Implement CRUD operations for packages (create, read, update, delete)
  - Implement CRUD operations for destinations
  - Implement CRUD operations for enquiries
  - Add error handling and logging for database operations
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.2_

- [ ]* 4.1 Write property test for unique ID enforcement
  - **Property 19: Unique ID enforcement**
  - **Validates: Requirements 10.6**

- [x] 5. Implement security middleware
  - [x] 5.1 Create rate limiter middleware
    - Implement IP-based rate limiting (100 req/min for general, 20 req/min for enquiry)
    - Return 429 status when limit exceeded
    - _Requirements: 3.2_
  
  - [x] 5.2 Create authentication middleware
    - Implement session-based authentication
    - Check for valid admin session on protected routes
    - Return 401 for unauthorized access
    - _Requirements: 3.7, 6.1_
  
  - [x] 5.3 Create input sanitization middleware
    - Sanitize all user inputs to prevent XSS and injection attacks
    - Validate against malicious patterns
    - _Requirements: 3.3_

- [ ]* 5.4 Write unit test for rate limiting
  - Test that 101st request within 1 minute returns 429
  - _Requirements: 3.2_

- [ ]* 5.5 Write property test for input sanitization
  - **Property 6: Input sanitization**
  - **Validates: Requirements 3.3**

- [ ]* 5.6 Write unit test for authentication middleware
  - Test that unauthenticated requests to /admin return 401
  - _Requirements: 3.7, 6.1_

- [x] 6. Checkpoint - Ensure database and security foundations work
  - Run all tests to verify database operations
  - Test migration script with sample data
  - Verify rate limiting and authentication middleware
  - Ask the user if questions arise

- [-] 7. Implement Package API endpoints
  - [x] 7.1 Create GET /api/packages endpoint
    - Fetch all packages from database
    - Return JSON response with all packages
    - Apply rate limiting middleware
    - _Requirements: 2.1_
  
  - [x] 7.2 Create GET /api/packages/[id] endpoint
    - Fetch single package by ID
    - Return 404 if not found
    - Return package data in JSON
    - _Requirements: 2.2, 2.5_
  
  - [ ] 7.3 Create POST /api/packages endpoint (admin only)
    - Validate request body with PackageSchema
    - Require authentication
    - Create package in database
    - Return 201 with created package
    - _Requirements: 6.4, 6.6_
  
  - [ ] 7.4 Create PUT /api/packages/[id] endpoint (admin only)
    - Validate request body with PackageSchema
    - Require authentication
    - Update package in database
    - Return updated package
    - _Requirements: 6.4, 6.6_
  
  - [ ] 7.5 Create DELETE /api/packages/[id] endpoint (admin only)
    - Require authentication
    - Delete package from database
    - Return success message
    - _Requirements: 6.2_

- [ ]* 7.6 Write property test for complete data retrieval
  - **Property 3: Complete data retrieval**
  - **Validates: Requirements 2.1, 2.3, 6.2, 6.3**

- [ ]* 7.7 Write property test for ID-based retrieval accuracy
  - **Property 4: ID-based retrieval accuracy**
  - **Validates: Requirements 2.2, 2.4**

- [ ]* 7.8 Write property test for invalid ID error handling
  - **Property 5: Invalid ID error handling**
  - **Validates: Requirements 2.5**

- [ ]* 7.9 Write property test for admin data updates
  - **Property 13: Admin data updates**
  - **Validates: Requirements 6.6**

- [-] 8. Implement Destination API endpoints
  - [x] 8.1 Create GET /api/destinations endpoint
    - Fetch all destinations from database
    - Return JSON response with all destinations
    - Apply rate limiting middleware
    - _Requirements: 2.3_
  
  - [x] 8.2 Create GET /api/destinations/[id] endpoint
    - Fetch single destination by ID
    - Return 404 if not found
    - Return destination data in JSON
    - _Requirements: 2.4, 2.5_
  
  - [ ] 8.3 Create POST /api/destinations endpoint (admin only)
    - Validate request body with DestinationSchema
    - Require authentication
    - Create destination in database
    - Return 201 with created destination
    - _Requirements: 6.5, 6.6_
  
  - [ ] 8.4 Create PUT /api/destinations/[id] endpoint (admin only)
    - Validate request body with DestinationSchema
    - Require authentication
    - Update destination in database
    - Return updated destination
    - _Requirements: 6.5, 6.6_
  
  - [ ] 8.5 Create DELETE /api/destinations/[id] endpoint (admin only)
    - Require authentication
    - Delete destination from database
    - Return success message
    - _Requirements: 6.3_

- [-] 9. Implement Enquiry API endpoints
  - [x] 9.1 Update POST /api/enquiry endpoint
    - Validate request body with EnquirySchema
    - Check for duplicate enquiries within 5 minutes
    - Apply rate limiting (20 req/min)
    - Store enquiry in database with timestamp
    - Return 201 on success
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_
  
  - [x] 9.2 Create GET /api/admin/enquiries endpoint (admin only)
    - Require authentication
    - Fetch all enquiries from database
    - Sort by timestamp descending (newest first)
    - Return JSON response
    - _Requirements: 6.7_
  
  - [ ] 9.3 Create PATCH /api/admin/enquiries/[id] endpoint (admin only)
    - Require authentication
    - Validate status field (new, read, resolved)
    - Update enquiry status in database
    - Return updated enquiry
    - _Requirements: 6.8_

- [ ]* 9.4 Write property test for enquiry submission success
  - **Property 9: Enquiry submission success**
  - **Validates: Requirements 4.2, 4.3**

- [ ]* 9.5 Write property test for duplicate enquiry prevention
  - **Property 11: Duplicate enquiry prevention**
  - **Validates: Requirements 4.6**

- [ ]* 9.6 Write property test for enquiry sorting
  - **Property 14: Enquiry sorting**
  - **Validates: Requirements 6.7**

- [ ]* 9.7 Write property test for enquiry status updates
  - **Property 15: Enquiry status updates**
  - **Validates: Requirements 6.8**

- [x] 10. Implement admin authentication endpoints
  - [x] 10.1 Create POST /api/admin/login endpoint
    - Validate username and password
    - Hash password comparison with bcrypt
    - Create session on success
    - Return success response with session cookie
    - _Requirements: 6.1_
  
  - [x] 10.2 Create POST /api/admin/logout endpoint
    - Clear session cookie
    - Return success response
    - _Requirements: 6.1_
  
  - [x] 10.3 Create initial admin user seed script
    - Generate bcrypt hash for default admin password
    - Insert admin user into database
    - Document in deployment guide
    - _Requirements: 3.6, 8.6_

- [ ] 11. Implement error handling and logging
  - [ ] 11.1 Create logging utility with winston or pino
    - Configure log levels (info, warn, error)
    - Set up file logging for production
    - Set up console logging for development
    - _Requirements: 9.3, 9.4_
  
  - [ ] 11.2 Add error logging to all API endpoints
    - Log errors with timestamp, endpoint, method, and error details
    - Log database errors with operation type
    - Sanitize sensitive data from logs
    - _Requirements: 9.1, 9.2, 3.5_
  
  - [ ] 11.3 Add admin action logging
    - Log all create, update, delete operations
    - Include user, timestamp, and affected resource
    - _Requirements: 9.6_
  
  - [ ] 11.4 Implement error response sanitization
    - Remove stack traces from production responses
    - Return generic error messages for 500 errors
    - Return specific validation errors for 400 errors
    - _Requirements: 3.5, 9.5_

- [ ]* 11.5 Write property test for error message sanitization
  - **Property 7: Error message sanitization**
  - **Validates: Requirements 3.5, 9.5**

- [ ]* 11.6 Write property test for comprehensive error logging
  - **Property 17: Comprehensive error logging**
  - **Validates: Requirements 9.1, 9.2**

- [ ]* 11.7 Write property test for admin action audit logging
  - **Property 18: Admin action audit logging**
  - **Validates: Requirements 9.6**

- [x] 12. Create health check endpoint
  - Implement GET /api/health endpoint
  - Check database connection status
  - Return system status and timestamp
  - Exclude from rate limiting
  - _Requirements: 8.4_

- [ ]* 12.1 Write unit test for health check endpoint
  - Test that endpoint returns 200 with valid status
  - _Requirements: 8.4_

- [ ] 13. Checkpoint - Ensure all API endpoints work correctly
  - Test all package endpoints (GET, POST, PUT, DELETE)
  - Test all destination endpoints
  - Test enquiry submission and admin enquiry management
  - Test authentication and authorization
  - Verify error handling and logging
  - Ask the user if questions arise

- [-] 14. Update frontend to use API endpoints
  - [x] 14.1 Update home page (page.tsx)
    - Replace Excel parsing with fetch to /api/packages
    - Replace Excel parsing with fetch to /api/destinations
    - Add loading state
    - Add error handling with user-friendly messages
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [x] 14.2 Update detail page ([type]/[id]/page.tsx)
    - Replace Excel parsing with fetch to /api/packages/[id] or /api/destinations/[id]
    - Add loading state
    - Add error handling with user-friendly messages
    - Handle 404 responses
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 14.3 Remove xlsx dependency from package.json
    - Uninstall xlsx library
    - Remove all xlsx imports from client code
    - _Requirements: 7.5_

- [ ]* 14.4 Write property test for API error handling
  - **Property 16: API error handling**
  - **Validates: Requirements 7.4**

- [ ] 15. Implement image optimization
  - [ ] 15.1 Reorganize images into CDN-ready structure
    - Create /public/images/packages/ directory
    - Create /public/images/destinations/ directory
    - Move images to appropriate directories
    - Update image paths in database
    - _Requirements: 5.2_
  
  - [ ] 15.2 Update components to use Next.js Image component
    - Replace img tags with Image component in AutoSlider
    - Add lazy loading for images below the fold
    - Add priority loading for hero images
    - _Requirements: 5.1, 5.3, 5.5_

- [ ]* 15.3 Write unit tests for image optimization
  - Test that images have lazy loading attributes
  - Test that first image has priority attribute
  - _Requirements: 5.1, 5.5_

- [ ] 16. Build admin panel UI
  - [ ] 16.1 Create admin layout and navigation
    - Create /admin/layout.tsx with navigation sidebar
    - Add links to packages, destinations, enquiries
    - Add logout button
    - Implement protected route wrapper
    - _Requirements: 6.1_
  
  - [ ] 16.2 Create admin login page
    - Create /admin/login/page.tsx
    - Build login form with username and password fields
    - Handle login submission to /api/admin/login
    - Redirect to admin dashboard on success
    - _Requirements: 6.1_
  
  - [ ] 16.3 Create package management page
    - Create /admin/packages/page.tsx
    - Display list of all packages with edit and delete buttons
    - Add "Create New Package" button
    - _Requirements: 6.2_
  
  - [ ] 16.4 Create package form page
    - Create /admin/packages/[id]/page.tsx for editing
    - Create /admin/packages/new/page.tsx for creating
    - Build form with all package fields
    - Handle form submission to POST or PUT /api/packages
    - _Requirements: 6.4_
  
  - [ ] 16.5 Create destination management page
    - Create /admin/destinations/page.tsx
    - Display list of all destinations with edit and delete buttons
    - Add "Create New Destination" button
    - _Requirements: 6.3_
  
  - [ ] 16.6 Create destination form page
    - Create /admin/destinations/[id]/page.tsx for editing
    - Create /admin/destinations/new/page.tsx for creating
    - Build form with all destination fields
    - Handle form submission to POST or PUT /api/destinations
    - _Requirements: 6.5_
  
  - [ ] 16.7 Create enquiry management page
    - Create /admin/enquiries/page.tsx
    - Display table of all enquiries with columns: Name, Email, Phone, Message, Status, Date
    - Add status filter (new, read, resolved)
    - Add mark as read/resolved buttons
    - Sort by timestamp descending
    - _Requirements: 6.7, 6.8_

- [x] 17. Create deployment configuration files
  - [x] 17.1 Create .env.example file
    - Document all required environment variables
    - Include example values and descriptions
    - _Requirements: 8.6_
  
  - [x] 17.2 Create deployment guide (DEPLOYMENT.md)
    - Write step-by-step instructions for Hostinger deployment
    - Include prerequisites and configuration steps
    - Document migration script usage
    - Add troubleshooting section
    - _Requirements: 8.1_
  
  - [x] 17.3 Update package.json scripts
    - Add "migrate" script for running migration
    - Add "seed:admin" script for creating admin user
    - Add production build and start scripts
    - _Requirements: 8.2_
  
  - [x] 17.4 Create .gitignore updates
    - Ignore database files (*.db)
    - Ignore log files (/logs/)
    - Ignore .env file
    - _Requirements: 3.6_

- [ ] 18. Security hardening
  - [ ] 18.1 Remove Excel files from public folder
    - Delete packages_details.xlsx
    - Delete packages_summary.xlsx
    - Update .gitignore to prevent re-adding
    - _Requirements: 3.1_
  
  - [ ] 18.2 Add CSRF protection
    - Implement CSRF token generation and validation
    - Add CSRF middleware to POST endpoints
    - _Requirements: 3.4_
  
  - [ ] 18.3 Configure secure session cookies
    - Set httpOnly flag
    - Set secure flag for production
    - Set sameSite attribute
    - _Requirements: 3.6_

- [ ]* 18.4 Write unit test for CSRF protection
  - Test that POST requests without CSRF token are rejected
  - _Requirements: 3.4_

- [ ]* 18.5 Write unit test for Excel file removal
  - Test that Excel files don't exist in public folder
  - _Requirements: 3.1_

- [ ] 19. Final testing and verification
  - [ ] 19.1 Run all unit tests and property tests
    - Ensure 100% of tests pass
    - Fix any failing tests
    - _Requirements: All_
  
  - [ ] 19.2 Test complete user flows
    - Browse packages → view details → submit enquiry
    - Admin login → create package → edit package → delete package
    - Test error scenarios and edge cases
    - _Requirements: All_
  
  - [ ] 19.3 Run migration script with production data
    - Backup Excel files
    - Run migration
    - Verify all data migrated correctly
    - _Requirements: 1.3, 8.2_
  
  - [ ] 19.4 Test deployment locally
    - Build production bundle
    - Start production server
    - Test all functionality in production mode
    - _Requirements: 8.5_

- [ ] 20. Final checkpoint - Production readiness verification
  - Verify all tests pass
  - Verify migration script works correctly
  - Verify all API endpoints return correct responses
  - Verify admin panel is functional and secure
  - Verify error handling and logging work correctly
  - Verify environment variables are properly configured
  - Review deployment guide for completeness
  - Ask the user if ready to deploy to Hostinger

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP deployment
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at critical milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and integration points
- The implementation prioritizes P0 features (database, API, security) before P1 (optimization) and P2 (advanced features)
- Admin panel is functional but basic - can be enhanced post-deployment
- Migration script should be run once during deployment, then removed or secured
