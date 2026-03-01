# Deployment Guide for Hostinger

This guide will help you deploy the Ahmedabad Adventure Club website to Hostinger within 1 hour.

## Prerequisites

- Hostinger account with Node.js support (VPS or Node.js hosting)
- SSH access to your server
- Domain configured and pointing to your server
- Git installed on your server

## Step 1: Prepare Your Server

1. **Connect to your server via SSH:**
   ```bash
   ssh your_username@your_server_ip
   ```

2. **Install Node.js (if not already installed):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

## Step 2: Clone and Setup

1. **Clone your repository:**
   ```bash
   cd /home/your_username
   git clone your_repository_url
   cd ahmedabad-adventure-club-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   nano .env
   ```

4. **Configure environment variables:**
   ```env
   DATABASE_URL="file:./data/adventure-club.db"
   NODE_ENV="production"
   NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
   ```

## Step 3: Initialize Database

1. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

2. **Create database:**
   ```bash
   npx prisma db push
   ```

3. **Run migration script:**
   ```bash
   npm run migrate
   ```

4. **Verify data migration:**
   ```bash
   # Check if database file exists
   ls -la data/
   ```

## Step 4: Build Application

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Test locally (optional):**
   ```bash
   npm start
   # Visit http://your_server_ip:3000
   ```

## Step 5: Setup Process Manager (PM2)

1. **Install PM2 globally:**
   ```bash
   sudo npm install -g pm2
   ```

2. **Start application with PM2:**
   ```bash
   pm2 start npm --name "adventure-club" -- start
   ```

3. **Save PM2 configuration:**
   ```bash
   pm2 save
   ```

4. **Setup PM2 to start on boot:**
   ```bash
   pm2 startup
   # Follow the instructions provided by the command
   ```

5. **Check application status:**
   ```bash
   pm2 status
   pm2 logs adventure-club
   ```

## Step 6: Configure Nginx (Reverse Proxy)

1. **Install Nginx (if not installed):**
   ```bash
   sudo apt-get install nginx
   ```

2. **Create Nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/adventure-club
   ```

3. **Add configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

4. **Enable site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/adventure-club /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Step 7: Setup SSL (HTTPS)

1. **Install Certbot:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Test auto-renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

## Step 9: Create Admin User

1. **Create your admin account:**
   ```bash
   npm run create-admin
   ```

2. **Enter credentials when prompted:**
   - Choose a strong username
   - Use a secure password (12+ characters)

3. **Access admin panel:**
   - URL: `https://yourdomain.com/secure-admin-x9k2p/login`
   - Keep this URL private!

## Step 10: Verify Deployment

1. **Check health endpoint:**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Check packages endpoint:**
   ```bash
   curl https://yourdomain.com/api/packages
   ```

3. **Visit your website:**
   - Open https://yourdomain.com in your browser
   - Test package browsing
   - Test detail pages
   - Submit a test enquiry

## Step 9: Post-Deployment

1. **Remove Excel files from public folder (security):**
   ```bash
   rm public/packages_details.xlsx
   rm public/packages_summary.xlsx
   ```

2. **Setup log rotation:**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

3. **Setup monitoring:**
   ```bash
   pm2 monitor
   ```

## Troubleshooting

### Application won't start
- Check PM2 logs: `pm2 logs adventure-club`
- Verify environment variables: `cat .env`
- Check database file exists: `ls -la data/`

### Database errors
- Regenerate Prisma client: `npx prisma generate`
- Re-run migration: `npm run migrate`

### Port already in use
- Check what's using port 3000: `sudo lsof -i :3000`
- Kill the process or change port in PM2 config

### Nginx errors
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Test configuration: `sudo nginx -t`

## Updating Your Application

1. **Pull latest changes:**
   ```bash
   cd /home/your_username/ahmedabad-adventure-club-main
   git pull
   ```

2. **Install new dependencies:**
   ```bash
   npm install
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

4. **Restart application:**
   ```bash
   pm2 restart adventure-club
   ```

## Backup Strategy

1. **Backup database:**
   ```bash
   cp data/adventure-club.db data/adventure-club.db.backup-$(date +%Y%m%d)
   ```

2. **Automate backups (cron job):**
   ```bash
   crontab -e
   # Add: 0 2 * * * cp /home/your_username/ahmedabad-adventure-club-main/data/adventure-club.db /home/your_username/backups/adventure-club.db.$(date +\%Y\%m\%d)
   ```

## Performance Tips

1. **Enable Gzip compression in Nginx**
2. **Setup CDN for images (Cloudflare)**
3. **Monitor with PM2 Plus**
4. **Regular database backups**

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs adventure-club`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify database connection: `curl http://localhost:3000/api/health`

## Security Checklist

- [x] Excel files removed from public folder
- [x] Environment variables configured
- [x] HTTPS enabled
- [x] Rate limiting active
- [x] Input validation enabled
- [ ] Regular backups scheduled
- [ ] Monitoring setup

Congratulations! Your website is now live! 🎉
