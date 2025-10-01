import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method, query } = req;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    if (method === 'GET') {
      const { id, category, featured, limit } = query;
      
      // Get single job by ID
      if (id) {
        const job = data.jobs.find(j => j.id === id);
        return res.status(200).json(job || null);
      }
      
      // Filter jobs based on query parameters
      let jobs = [...data.jobs];
      
      if (category) {
        jobs = jobs.filter(j => j.category.toLowerCase() === category.toLowerCase());
      }
      
      if (featured === 'true') {
        jobs = jobs.filter(j => j.featured === true);
      }
      
      if (limit) {
        jobs = jobs.slice(0, parseInt(limit));
      }
      
      return res.status(200).json(jobs);
    }
    
    if (method === 'POST') {
      const newJob = { 
        ...req.body, 
        id: Date.now().toString(),
        new: true,
        featured: false,
        postedAt: 'Just now'
      };
      
      data.jobs.push(newJob);
      
      // Note: In production, this write won't persist due to serverless nature
      // Consider using a database for persistent storage
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(201).json(newJob);
    }
    
    if (method === 'PUT') {
      const { id } = query;
      const jobIndex = data.jobs.findIndex(j => j.id === id);
      
      if (jobIndex === -1) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      data.jobs[jobIndex] = { ...data.jobs[jobIndex], ...req.body };
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(200).json(data.jobs[jobIndex]);
    }
    
    if (method === 'DELETE') {
      const { id } = query;
      const jobIndex = data.jobs.findIndex(j => j.id === id);
      
      if (jobIndex === -1) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      const deletedJob = data.jobs.splice(jobIndex, 1)[0];
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(200).json(deletedJob);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
