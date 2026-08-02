import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and URL-encoded bodies with 10mb limit for base64 images
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ImgBB Upload Route
  app.post('/api/upload', async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'IMGBB_API_KEY is not configured in environment variables' });
      }

      const formData = new URLSearchParams();
      formData.append('key', apiKey);
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      formData.append('image', base64Data);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        res.json({ url: data.data.url });
      } else {
        res.status(500).json({ error: data.error?.message || 'Upload failed' });
      }
    } catch (error) {
      console.error('Error uploading to ImgBB:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development or Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support SPA routing
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
