import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  const PORT = 3000;

  // Enhance security with Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // Essential for Vite HMR and inline styles
  }));

  // Optimize performance with compression
  app.use(compression());

  // Implement rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, // Adjust this based on your API needs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  app.use("/api/", limiter); // Apply to API routes

  app.use(express.json());

  // SEO: Sitemap Generation Endpoint
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://preschools.sz/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://preschools.sz/directory</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://preschools.sz/features</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://preschools.sz/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`);
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, type, imageData, mimeType } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      let systemInstruction = "You are a helpful assistant for school administrators.";
      let model = "gemini-3-flash-preview";

      switch (type) {
        case 'website':
          systemInstruction = "You are an expert marketing copywriter for preschools. Generate catchy, professional headlines and landing page copy.";
          break;
        case 'hero_headline':
          systemInstruction = "You are an expert marketing copywriter for preschools. Generate a short, catchy, professional headline (max 8 words) for a preschool landing page hero section. Only output the text of the headline without quotes.";
          break;
        case 'hero_subheadline':
          systemInstruction = "You are an expert marketing copywriter for preschools. Generate a professional subheadline (1-2 sentences) for a preschool landing page hero section. Only output the text without quotes.";
          break;
        case 'profile':
          systemInstruction = "Create a comprehensive and appealing preschool profile based on provided details. Highlight safety, curriculum, and facilities.";
          break;
        case 'blog':
          systemInstruction = "Write engaging blog posts or newsletter content for parents about early childhood education and school updates.";
          break;
        case 'faq':
          systemInstruction = "Generate common FAQs and answers for a preschool website based on school policies and curriculum information.";
          break;
        case 'admissions':
          systemInstruction = "Help process admissions inquiries or generate professional responses to parent applications.";
          break;
        case 'seo':
          systemInstruction = "Provide SEO suggestions (keywords, meta descriptions) for a preschool website to improve search visibility in Eswatini.";
          break;
        case 'caption':
          systemInstruction = "Generate warm, engaging social media captions for school photos showing children learning and playing.";
          break;
        case 'recommendation':
          systemInstruction = "Recommend improvements to school descriptions or content to make them more parent-friendly and professional.";
          break;
      }

      const contents: any[] = [];
      if (imageData) {
        contents.push({
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: imageData,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model,
        contents: { parts: contents },
        config: { systemInstruction }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/match-schools", async (req, res) => {
    const { requirements } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      // In a real production environment this would fetch from Firestore using firebase-admin
      const schools: any[] = [];

      const model = "gemini-3-flash-preview";

      const prompt = `Given these schools: ${JSON.stringify(schools.map(({id, name, description, region, town, feePerTerm, curriculum}) => ({id, name, description, region, town, feePerTerm, curriculum})))}, 
      find the best school match for these requirements: ${requirements}.
      Return the ID(s) of the best matching school(s) as a JSON array of strings.`;

      const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
      });

      const matchedIds = JSON.parse(response.text!);
      const matchedSchools = schools.filter(s => matchedIds.includes(s.id));

      res.json(matchedSchools);
    } catch (error: any) {
      console.error("Gemini Matching Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    const { messages, schoolContext } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const systemInstruction = `You are an AI assistant for a preschool website. 
      Use the following school context to answer parent queries: ${JSON.stringify(schoolContext)}. 
      Be helpful, warm, and professional. If you don't know the answer, advise them to contact the school office.`;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction },
      });

      // Send the last message
      const lastMessage = messages[messages.length - 1];
      const response = await chat.sendMessage({ message: lastMessage.text });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/schools", (req, res) => {
    // Deprecated. Return sample schools for the directory
    res.json([]);
  });

  // Additional mock backend routes can be defined here...
  app.post("/api/notify-admin", async (req, res) => {
    const { schoolId, schoolName, inquiryData, adminEmail } = req.body;
    
    // In a real application, we would fetch the admin email from Firestore based on schoolId
    // to prevent client-client side spoofing.
    // For now we accept it as a parameter for this exercise.
    
    console.log(`[EMAIL NOTIFICATION] to ${adminEmail || 'admin@school.com'}`);
    console.log(`Subject: New Inquiry for ${schoolName}`);
    console.log(`Content: You have a new inquiry from ${inquiryData.parentName} for ${inquiryData.childName}.`);
    console.log(`Message: ${inquiryData.message}`);

    // If an API key was provided (e.g. RESEND_API_KEY), we would use it here.
    if (process.env.RESEND_API_KEY) {
      try {
        // dynamic import to avoid dependency issues if not installed yet
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'Preschools Eswatini <notifications@preschoolseswatini.com>',
          to: adminEmail || 'admin@school.com',
          subject: `New Inquiry: ${schoolName}`,
          html: `
            <h1>New Inquiry Received</h1>
            <p><strong>Parent:</strong> ${inquiryData.parentName}</p>
            <p><strong>Child:</strong> ${inquiryData.childName} (${inquiryData.childAge})</p>
            <p><strong>Email:</strong> ${inquiryData.email}</p>
            <p><strong>Phone:</strong> ${inquiryData.phone}</p>
            <p><strong>Message:</strong></p>
            <p>${inquiryData.message}</p>
            <hr />
            <p><a href="https://ais-dev-vdjjmixcqaz5ntpe5qyagx-67187419711.europe-west2.run.app/admin/admissions">View in Dashboard</a></p>
          `
        });
      } catch (err) {
        console.error("Failed to send real email:", err);
      }
    }

    res.json({ success: true, message: "Notification handled" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static asset serving in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
