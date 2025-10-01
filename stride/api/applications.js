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
      const { jobId, email } = query;
      
      let applications = [...data.applications];
      
      // Filter by job ID
      if (jobId) {
        applications = applications.filter(app => app.jobId === jobId);
      }
      
      // Filter by user email
      if (email) {
        applications = applications.filter(app => app.email === email);
      }
      
      return res.status(200).json(applications);
    }
    
    if (method === 'POST') {
      const { jobId, firstName, lastName, email, coverLetter, resume } = req.body;
      
      // Validate required fields
      if (!jobId || !firstName || !lastName || !email) {
        return res.status(400).json({ 
          message: 'Missing required fields: jobId, firstName, lastName, email' 
        });
      }
      
      // Check if user already applied for this job
      const existingApplication = data.applications.find(
        app => app.jobId === jobId && app.email === email
      );
      
      if (existingApplication) {
        return res.status(409).json({ 
          message: 'You have already applied for this job' 
        });
      }
      
      const newApplication = {
        id: Date.now().toString(),
        jobId,
        firstName,
        lastName,
        email,
        coverLetter: coverLetter || '',
        resume: resume || null,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      data.applications.push(newApplication);
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(201).json(newApplication);
    }
    
    if (method === 'PUT') {
      const { id } = query;
      const applicationIndex = data.applications.findIndex(app => app.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      data.applications[applicationIndex] = { 
        ...data.applications[applicationIndex], 
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(200).json(data.applications[applicationIndex]);
    }
    
    if (method === 'DELETE') {
      const { id } = query;
      const applicationIndex = data.applications.findIndex(app => app.id === id);
      
      if (applicationIndex === -1) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      const deletedApplication = data.applications.splice(applicationIndex, 1)[0];
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(200).json(deletedApplication);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
