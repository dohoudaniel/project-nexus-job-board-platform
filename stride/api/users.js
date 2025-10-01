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
      const { email } = query;
      
      // Get user by email (for authentication)
      if (email) {
        const user = data.users.find(u => u.email === email);
        return res.status(200).json(user || null);
      }
      
      // Return all users (remove passwords for security)
      const safeUsers = data.users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      
      return res.status(200).json(safeUsers);
    }
    
    if (method === 'POST') {
      const { email } = req.body;
      
      // Check if user already exists
      const existingUser = data.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      
      const newUser = { 
        ...req.body, 
        id: Date.now().toString()
      };
      
      data.users.push(newUser);
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      // Return user without password
      const { password, ...safeUser } = newUser;
      return res.status(201).json(safeUser);
    }
    
    if (method === 'PUT') {
      const { id } = query;
      const userIndex = data.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      data.users[userIndex] = { ...data.users[userIndex], ...req.body };
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      
      // Return user without password
      const { password, ...safeUser } = data.users[userIndex];
      return res.status(200).json(safeUser);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
