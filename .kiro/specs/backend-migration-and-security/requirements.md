# Requirements Document

## Introduction

This document specifies requirements for migrating the Ahmedabad Adventure Club Next.js website from Excel-based data storage to a proper backend system with database, API, and security improvements. The system currently loads Excel files on every page load, stores sensitive data in the public folder, and lacks proper security measures. This migration will improve performance, security, and maintainability while enabling rapid deployment to Hostinger within 1 hour.

## Glossary

- **System**: The Next.js adventure club website backend and API layer
- **Database**: SQLite database for storing packages, destinations, and enquiries
- **API_Layer**: Next.js API routes that handle data operations
- **Admin_Panel**: Web interface for managing packages and destinations
- **Excel_Data**: Current packages_details.xlsx and packages_summary.xlsx files
- **Package**: Tour package with details like title, duration, cost, inclusions
- **Destination**: Travel destination with basic information
- **Enquiry**: Customer contact form submission
- **Rate_Limiter**: Middleware that restricts API request frequency
- **Image_Optimizer**: System for lazy loading and optimizing image delivery
- **Hostinger**: Target deployment platform (shared hosting or VPS)

## Requirements

### Requirement 1: Database Migration

**User Story:** As a developer, I want to migrate Excel data to a SQLite database, so that data loading is fast and the system can scale to PostgreSQL later.

#### Acceptance Criteria

1. THE System SHALL use SQLite as the primary database for storing packages, destinations, and enquiries
2. WHEN the database is initialized, THE System SHALL create tables for packages, destinations, and enquiries with appropriate schema
3. WHEN migration runs, THE System SHALL parse Excel_Data and insert all records into the database
4. THE System SHALL support migration to PostgreSQL without code changes (using an ORM or database abstraction layer)
5. WHEN a package record is stored, THE System SHALL preserve all fields from Excel_Data including ID, Title, Duration, Departure Cities, Fixed Departures, Cost Details, Inclusions, Notes, Items to Carry, Payment Terms, Cancellation Terms, and Images
6. WHEN a destination record is stored, THE System SHALL include ID, Title, Description, and Images
7. THE System SHALL store the database file outside the public folder for security

### Requirement 2: API Layer Implementation

**User Story:** As a frontend developer, I want RESTful API endpoints for packages and destinations, so that I can fetch data efficiently without parsing Excel files.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/packages, THE API_Layer SHALL return all packages in JSON format
2. WHEN a GET request is made to /api/packages/[id], THE API_Layer SHALL return a single package by ID
3. WHEN a GET request is made to /api/destinations, THE API_Layer SHALL return all destinations in JSON format
4. WHEN a GET request is made to /api/destinations/[id], THE API_Layer SHALL return a single destination by ID
5. WHEN an API endpoint receives an invalid ID, THE API_Layer SHALL return a 404 status with an error message
6. WHEN an API endpoint encounters a database error, THE API_Layer SHALL return a 500 status with a generic error message
7. THE API_Layer SHALL return data within 200ms for 95% of requests

### Requirement 3: Security Implementation

**User Story:** As a system administrator, I want security measures in place, so that the application is protected from common attacks and abuse.

#### Acceptance Criteria

1. THE System SHALL remove Excel files from the public folder after migration
2. WHEN an API endpoint receives more than 100 requests per minute from a single IP, THE Rate_Limiter SHALL reject subsequent requests with a 429 status
3. WHEN the enquiry API receives input, THE System SHALL validate and sanitize all fields to prevent injection attacks
4. THE System SHALL implement CSRF protection for all POST endpoints
5. WHEN an error occurs, THE System SHALL log the error without exposing sensitive information to the client
6. THE System SHALL use environment variables for sensitive configuration (database path, admin credentials)
7. WHEN the admin panel is accessed, THE System SHALL require authentication

### Requirement 4: Enquiry Management

**User Story:** As a business owner, I want enquiries stored in the database, so that I can track and manage customer requests.

#### Acceptance Criteria

1. WHEN a POST request is made to /api/enquiry, THE System SHALL validate required fields (name, email, message)
2. WHEN an enquiry is valid, THE System SHALL store it in the database with a timestamp
3. WHEN an enquiry is stored, THE System SHALL return a success response with status 201
4. THE System SHALL store enquiry fields: name, email, phone, message, timestamp, and status
5. WHEN an enquiry contains invalid email format, THE System SHALL reject it with a 400 status
6. THE System SHALL prevent storing duplicate enquiries within 5 minutes from the same email

### Requirement 5: Image Optimization

**User Story:** As a user, I want images to load quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN a page loads, THE Image_Optimizer SHALL implement lazy loading for images below the fold
2. THE System SHALL organize images in a CDN-ready folder structure (/images/packages/, /images/destinations/)
3. WHEN an image is requested, THE System SHALL serve Next.js optimized images using the Image component
4. THE System SHALL compress images to reduce file size without visible quality loss
5. WHEN a package or destination has multiple images, THE System SHALL load the first image with priority and lazy load remaining images

### Requirement 6: Admin Panel

**User Story:** As a business owner, I want a simple admin panel, so that I can manage packages and destinations without technical knowledge.

#### Acceptance Criteria

1. WHEN the admin panel is accessed at /admin, THE System SHALL require username and password authentication
2. WHEN authenticated, THE Admin_Panel SHALL display a list of all packages with edit and delete options
3. WHEN authenticated, THE Admin_Panel SHALL display a list of all destinations with edit and delete options
4. WHEN the admin creates or edits a package, THE Admin_Panel SHALL provide a form with all package fields
5. WHEN the admin creates or edits a destination, THE Admin_Panel SHALL provide a form with all destination fields
6. WHEN the admin saves changes, THE System SHALL validate input and update the database
7. WHEN the admin views enquiries, THE Admin_Panel SHALL display all enquiries sorted by timestamp (newest first)
8. THE Admin_Panel SHALL allow marking enquiries as "read" or "resolved"

### Requirement 7: Frontend Migration

**User Story:** As a frontend developer, I want to update components to use API endpoints, so that the application no longer depends on Excel files.

#### Acceptance Criteria

1. WHEN the home page loads, THE System SHALL fetch packages from /api/packages instead of parsing Excel files
2. WHEN the detail page loads, THE System SHALL fetch package or destination data from the appropriate API endpoint
3. WHEN API data is loading, THE System SHALL display a loading indicator
4. WHEN an API request fails, THE System SHALL display a user-friendly error message
5. THE System SHALL remove all xlsx library dependencies from client-side code
6. THE System SHALL maintain the current UI/UX without visual changes

### Requirement 8: Deployment Readiness

**User Story:** As a developer, I want the application ready for Hostinger deployment, so that I can deploy within 1 hour.

#### Acceptance Criteria

1. THE System SHALL include a deployment guide with step-by-step instructions for Hostinger
2. THE System SHALL provide a migration script that can be run once to populate the database
3. THE System SHALL use environment variables for all environment-specific configuration
4. THE System SHALL include a health check endpoint at /api/health that returns system status
5. WHEN deployed to production, THE System SHALL use production-ready error handling and logging
6. THE System SHALL include a .env.example file with all required environment variables documented
7. THE System SHALL work on both Hostinger shared hosting (with Node.js support) and VPS environments

### Requirement 9: Error Handling and Logging

**User Story:** As a developer, I want comprehensive error handling and logging, so that I can diagnose and fix issues quickly.

#### Acceptance Criteria

1. WHEN an error occurs in any API endpoint, THE System SHALL log the error with timestamp, endpoint, and error details
2. WHEN a database operation fails, THE System SHALL log the query and error message
3. THE System SHALL implement structured logging with different levels (info, warn, error)
4. WHEN in production mode, THE System SHALL log errors to a file in the logs directory
5. WHEN an unhandled error occurs, THE System SHALL return a generic error message to the client without exposing stack traces
6. THE System SHALL log all admin panel actions (create, update, delete) with user and timestamp

### Requirement 10: Data Validation and Integrity

**User Story:** As a system administrator, I want data validation at all entry points, so that the database maintains data integrity.

#### Acceptance Criteria

1. WHEN creating or updating a package, THE System SHALL validate that required fields (Title, Duration, Cost Details) are present
2. WHEN creating or updating a destination, THE System SHALL validate that required fields (Title, Description) are present
3. WHEN storing cost details, THE System SHALL validate that prices are in valid format
4. WHEN storing images, THE System SHALL validate that image paths exist and are accessible
5. WHEN storing dates, THE System SHALL validate date format and reject invalid dates
6. THE System SHALL enforce unique IDs for packages and destinations
7. WHEN validation fails, THE System SHALL return specific error messages indicating which fields are invalid
