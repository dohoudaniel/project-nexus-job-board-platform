import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method } = req;
  
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
      return res.status(200).json(data.sectors);
    }
    
    if (method === 'POST') {
      const newSector = { 
        ...req.body, 
        id: Date.now().toString()
      };
      
      data.sectors.push(newSector);
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      return res.status(201).json(newSector);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
