# Ahmedabad Adventure Club Website

A modern Next.js website for an adventure travel club with database-backed content management, secure API endpoints, and optimized performance.

## Features

✅ **Database-Backed System**
- SQLite database for fast, reliable data storage
- Migrated from Excel files to proper database
- Easy migration path to PostgreSQL

✅ **Secure API Endpoints**
- RESTful API for packages, destinations, and enquiries
- Rate limiting (100 req/min general, 20 req/min for enquiries)
- Input validation and sanitization
- CSRF protection ready

✅ **Performance Optimized**
- Server-side rendering with Next.js 15
- Optimized image loading
- Fast API responses (<200ms)
- Production-ready build

✅ **Contact Management**
- WhatsApp integration for enquiries
- Database storage for all enquiries
- Duplicate prevention (5-minute window)

## Tech Stack

- **Framework**: Next.js 15.3.1
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod
- **Authentication**: bcryptjs (for admin panel)
- **Styling**: Tailwind CSS
- **UI Components**: Swiper for carousels

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ahmedabad-adventure-club-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL="file:./data/adventure-club.db"
   NODE_ENV="development"
   NEXT_PUBLIC_WHATSAPP_NUMBER="your_whatsapp_number"
   ```

4. **Initialize database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run migrate
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migration from Excel
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/packages` - Get all packages
- `GET /api/packages/[id]` - Get package by ID
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/[id]` - Get destination by ID
- `POST /api/enquiry` - Submit enquiry

### Response Format

```json
{
  "packages": [
    {
      "id": 1,
      "title": "Package Name",
      "duration": "7 Days",
      "departureCities": ["City1", "City2"],
      "costDetails": [
        {"description": "Basic", "price": "₹10,000"}
      ],
      "images": ["/image1.jpg"],
      ...
    }
  ]
}
```

## Database Schema

### Package
- id, title, duration
- departureCities, fixedDepartures
- costDetails, inclusions
- notes, itemsToCarry
- paymentTerms, cancellationTerms
- images

### Destination
- id, title, description
- images

### Enquiry
- id, name, email, phone
- message, status
- createdAt

## Admin Panel

The website includes a secure admin panel for managing content:

**Admin URL:** `/secure-admin-x9k2p/login` (keep this private!)

### Creating Admin User

```bash
npm run create-admin
```

Follow the prompts to create your admin account.

### Admin Features
- View all packages, destinations, and enquiries
- Monitor customer enquiries in real-time
- Secure authentication with encrypted passwords
- Session-based access control

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed admin panel documentation.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Hostinger.

### Quick Deployment Steps

1. Build the application: `npm run build`
2. Setup PM2: `pm2 start npm --name "adventure-club" -- start`
3. Configure Nginx as reverse proxy
4. Setup SSL with Certbot
5. Remove Excel files from public folder

## Security Features

- ✅ Rate limiting on all endpoints
- ✅ Input validation with Zod
- ✅ Input sanitization (XSS prevention)
- ✅ CSRF protection ready
- ✅ Secure headers (X-Frame-Options, X-Content-Type-Options)
- ✅ Database outside public folder
- ✅ Environment variables for sensitive data

## Project Structure

```
ahmedabad-adventure-club-main/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── components/       # React components
│   │   ├── [type]/[id]/      # Dynamic detail pages
│   │   └── page.tsx          # Home page
│   └── lib/
│       ├── db.ts             # Database utilities
│       ├── prisma.ts         # Prisma client
│       ├── validations.ts    # Zod schemas
│       └── middleware/       # Security middleware
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   └── migrate.ts            # Migration script
├── data/                     # Database files (gitignored)
├── public/                   # Static assets
└── DEPLOYMENT.md             # Deployment guide
```

## Migration from Excel

The website was migrated from Excel-based data storage to a database:

**Before:**
- Excel files loaded on every page visit
- Slow performance
- Security risk (files in public folder)
- Client-side parsing

**After:**
- Database-backed with SQLite
- Fast API responses
- Secure (database outside public)
- Server-side processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - All rights reserved

## Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review API documentation above
- Contact the development team

---

**Built with ❤️ for adventure travelers**
