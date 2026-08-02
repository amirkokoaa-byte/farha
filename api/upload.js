export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
}
