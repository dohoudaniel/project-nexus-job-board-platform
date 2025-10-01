# Vercel Deployment Guide for Stride Job Board

This guide covers deploying your React job board application to Vercel with local JSON data.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Vercel CLI installed: `npm i -g vercel`
- GitHub account (recommended)
- Vercel account

### 1. Prepare Your Application

#### Update Environment Variables

Create a production environment configuration:

```bash
# .env.production
VITE_API_BASE_URL=https://your-app-name.vercel.app/api
```

#### Create API Routes for Vercel

Since Vercel doesn't support json-server directly, we need to create API routes.

Create `stride/api/` directory with the following files:

**`api/jobs.js`**

```javascript
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { method, query } = req;
  const dbPath = path.join(process.cwd(), "data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "GET") {
    const { id, category, featured } = query;

    if (id) {
      const job = data.jobs.find((j) => j.id === id);
      return res.status(200).json(job || null);
    }

    let jobs = data.jobs;
    if (category) jobs = jobs.filter((j) => j.category === category);
    if (featured) jobs = jobs.filter((j) => j.featured === true);

    return res.status(200).json(jobs);
  }

  if (method === "POST") {
    const newJob = { ...req.body, id: Date.now().toString() };
    data.jobs.push(newJob);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return res.status(201).json(newJob);
  }

  res.status(405).json({ message: "Method not allowed" });
}
```

**`api/sectors.js`**

```javascript
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), "data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "GET") {
    return res.status(200).json(data.sectors);
  }

  res.status(405).json({ message: "Method not allowed" });
}
```

**`api/users.js`**

```javascript
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { method } = req;
  const dbPath = path.join(process.cwd(), "data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "GET") {
    return res.status(200).json(data.users);
  }

  if (method === "POST") {
    const newUser = { ...req.body, id: Date.now().toString() };
    data.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return res.status(201).json(newUser);
  }

  res.status(405).json({ message: "Method not allowed" });
}
```

**`api/applications.js`**

```javascript
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { method } = req;
  const dbPath = path.join(process.cwd(), "data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "GET") {
    return res.status(200).json(data.applications);
  }

  if (method === "POST") {
    const newApplication = { ...req.body, id: Date.now().toString() };
    data.applications.push(newApplication);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return res.status(201).json(newApplication);
  }

  res.status(405).json({ message: "Method not allowed" });
}
```

### 2. Create Vercel Configuration

**`vercel.json`**

```json
{
  "functions": {
    "api/*.js": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/jobs/:id",
      "destination": "/api/jobs?id=:id"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### 3. Update Package.json Scripts

Add build and deployment scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npx tsc -b && vite build",
    "preview": "vite preview",
    "server": "json-server --watch data/db.json --port 8000",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

## 📦 Deployment Methods

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Configure build settings:
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Environment Variables**
   In Vercel dashboard, add:

   - `VITE_API_BASE_URL` = `https://your-app-name.vercel.app/api`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main

### Method 2: Vercel CLI

1. **Login to Vercel**

   ```bash
   vercel login
   ```

2. **Deploy**

   ```bash
   # First deployment
   vercel

   # Production deployment
   vercel --prod
   ```

## 🔧 Configuration Details

### Build Settings

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### Environment Variables

Set these in Vercel dashboard or via CLI:

```bash
vercel env add VITE_API_BASE_URL production
# Enter: https://your-app-name.vercel.app/api
```

## 🚨 Important Notes

### Data Persistence

- **Development**: Data changes persist in local db.json
- **Production**: Data changes are temporary (serverless functions are stateless)
- **Solution**: Consider using a database (MongoDB, PostgreSQL) for production

### API Limitations

- Vercel serverless functions have execution time limits
- File system writes are temporary
- Consider using Vercel KV or external database for persistent data

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🔍 Troubleshooting

### Common Issues

**Build Fails**

- Check TypeScript errors: `npm run build`
- Verify all dependencies are in package.json
- Check Node.js version compatibility

**API Routes Not Working**

- Ensure api/ folder is in project root
- Check file extensions (.js not .ts for API routes)
- Verify CORS headers are set

**Environment Variables**

- Use `VITE_` prefix for client-side variables
- Restart development server after changes
- Check Vercel dashboard for correct values

**404 Errors**

- Check vercel.json rewrites configuration
- Verify API route file names match endpoints
- Test API routes locally first

### Testing Deployment

1. **Local Testing**

   ```bash
   npm run build
   npm run preview
   ```

2. **API Testing**
   ```bash
   # Test your deployed API
   curl https://your-app-name.vercel.app/api/jobs
   curl https://your-app-name.vercel.app/api/sectors
   ```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎉 Post-Deployment

After successful deployment:

1. Test all application features
2. Verify API endpoints work
3. Check responsive design on different devices
4. Set up monitoring and analytics
5. Configure custom domain (if needed)

Your job board application will be live at: `https://your-app-name.vercel.app`

## 🔄 Development vs Production

### Local Development

- Uses json-server on port 8000
- Data persists in local db.json file
- Full CRUD operations work
- Hot reloading for data changes

### Production (Vercel)

- Uses Vercel serverless functions
- Data changes are temporary (resets on function restart)
- API endpoints: `/api/jobs`, `/api/sectors`, `/api/users`, `/api/applications`
- For persistent data, consider integrating a database

## 🗄️ Database Integration (Recommended for Production)

For persistent data storage, consider these options:

### Option 1: Vercel KV (Redis)

```javascript
// Install: npm install @vercel/kv
import { kv } from "@vercel/kv";

// In your API routes
const jobs = (await kv.get("jobs")) || [];
await kv.set("jobs", updatedJobs);
```

### Option 2: MongoDB Atlas

```javascript
// Install: npm install mongodb
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("jobboard");
const jobs = await db.collection("jobs").find({}).toArray();
```

### Option 3: PostgreSQL (Vercel Postgres)

```javascript
// Install: npm install @vercel/postgres
import { sql } from "@vercel/postgres";

const jobs = await sql`SELECT * FROM jobs`;
```

## 📋 Pre-Deployment Checklist

- [ ] All API routes created in `/api` folder
- [ ] `vercel.json` configuration file added
- [ ] Environment variables configured
- [ ] Build command works locally (`npm run build`)
- [ ] TypeScript compilation passes
- [ ] All dependencies listed in package.json
- [ ] Git repository is clean and pushed
- [ ] Custom domain configured (if needed)

## 🚀 Quick Deploy Commands

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Or use npm scripts
npm run deploy:preview
npm run deploy
```

## 📊 Monitoring and Analytics

After deployment, consider adding:

- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring
- User analytics (Google Analytics)

## 🔐 Security Considerations

- API routes include CORS headers
- User passwords should be hashed (bcrypt)
- Consider rate limiting for API endpoints
- Validate all input data
- Use environment variables for sensitive data

## 💡 Tips for Success

1. **Test Locally First**: Always test your build locally before deploying
2. **Environment Variables**: Use different values for development and production
3. **Error Handling**: Implement proper error handling in API routes
4. **Performance**: Optimize images and assets for faster loading
5. **SEO**: Add meta tags and proper page titles
6. **Mobile**: Ensure responsive design works on all devices

Your Stride Job Board is now ready for deployment! 🎉
