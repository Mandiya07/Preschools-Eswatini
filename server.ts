import express from "express";
import path from "path";
import fs from "fs";
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
      console.warn("GEMINI_API_KEY not set. Serving simulated AI response for type:", type);
      
      let text = "";
      switch (type) {
        case 'hero_headline':
          text = "Nurturing Bright Minds & Happy Hearts in Eswatini";
          break;
        case 'hero_subheadline':
          text = "Providing Eswatini's premium foundation phase education with state-of-the-art play parks, verified safety measures, and child-centered Montessori curriculum.";
          break;
        case 'website':
        case 'profile':
          text = "Welcome to our premium early education center. We believe that every child is unique and deserves an environment that nurtures their individual potential. Our preschool offers standard-aligned developmental programs, highly qualified child-care practitioners, and a state-of-the-art playground. We focus on fostering critical thinking, motor skill refinement, and socio-emotional wellness. Contact our registrar office to schedule a walk-through.";
          break;
        case 'blog':
          text = "### 🌟 Cultivating Lifelong Curiosity in Young Learners\n\nPreschool is more than just daycare—it is a critical launchpad for brain development. Research shows that 90% of brain growth occurs before age five. Here is how we foster lifelong curiosity at our academy:\n\n1. **Structured Play-Based Learning**: Play is the work of early childhood. Through sensory bins and block building, children grasp physics, spatial reasoning, and social collaboration.\n2. **Early Literacy and Verbal Expression**: Our daily circle times and guided story hours build vocabulary, comprehension, and phonetic awareness early on.\n3. **Nature and Outdoor Inquiry**: Exploring our outdoor play fields cultivates motor coordination, healthy sensory stimulation, and an appreciation for the environment.";
          break;
        case 'faq':
          text = "**Q: What are the preschool hours of operation?**\nA: We operate Monday through Friday from 7:30 AM to 1:30 PM. Half-day options are available.\n\n**Q: What is the student-to-teacher ratio?**\nA: We maintain a 10:1 child-to-caregiver ratio for personalized attention and high safety.\n\n**Q: Do you offer transport or school lunch?**\nA: We offer a nutritious, kid-friendly school menu and have partnerships with certified local student shuttle drivers.";
          break;
        case 'admissions':
          text = "Dear prospective family,\n\nThank you for choosing us as your early learning partner! We have received your preliminary enrollment inquiry. Our registrar team will reach out to you within 48 hours to finalize documents, schedule a walkthrough, and answer any curriculum questions you may have. We look forward to meeting you soon!\n\nWarm regards,\nSchool Admissions Team";
          break;
        case 'seo':
          text = "1. **Target Keywords**: best preschool Eswatini, early childhood learning, high quality day care, affordable nursery school\n2. **Suggested Meta Description**: 'Discover our top-tier preschool offering structured early development, trained educators, and secure daily communications. Register online now!'";
          break;
        case 'caption':
          text = "🎨 Creativity is intelligence having fun! Today, our learners experimented with finger-paints, shapes, and color mixes in our sensory learning center. Super proud of our future little masterminds! #MontessoriKids #CreativeLearning #EswatiniEarlyYears";
          break;
        case 'recommendation':
          let dynamicRecs = [];
          try {
            const match = prompt.match(/\{[\s\S]*"totalSchools"[\s\S]*\}/);
            if (match) {
              const snap = JSON.parse(match[0]);
              if (snap.leadsSample && snap.leadsSample.length > 0) {
                const lead = snap.leadsSample[0];
                dynamicRecs.push({
                  title: `Follow up on CRM Lead: ${lead.preschoolName}`,
                  agent: "Growth Manager",
                  category: "Sales Pipeline",
                  description: `${lead.preschoolName} is currently in the '${lead.leadStage}' stage. Initiating automated outreach can help progress this lead towards conversion.`,
                  confidenceScore: 96,
                  actionTitle: `Draft Outreach to ${lead.preschoolName}`,
                  actionData: {
                    leadId: lead.id,
                    leadName: lead.preschoolName,
                    notes: "Generated dynamically from live CRM data."
                  }
                });
              }
              if (snap.schoolsSample && snap.schoolsSample.length > 0) {
                const school = snap.schoolsSample[Math.floor(Math.random() * snap.schoolsSample.length)];
                dynamicRecs.push({
                  title: `Optimize Profile for ${school.name}`,
                  agent: "Digital Editor",
                  category: "Website Copy",
                  description: `The profile for ${school.name} could be enhanced with better SEO keywords and updated admission info for the ${school.town} region.`,
                  confidenceScore: 92,
                  actionTitle: `Apply Profile Overrides`,
                  actionData: {
                    schoolId: school.id,
                    notes: "Generated dynamically from live active school database."
                  }
                });
              }
            }
          } catch (e) {
            console.error("Error parsing snapshot for dynamic recs", e);
          }
          
          if (dynamicRecs.length === 0) {
            dynamicRecs = [
              {
                title: "Establish Standard Admission Package",
                agent: "Digital Editor",
                category: "Website Copy",
                description: "Optimizing the Fees & Admissions section to display standard pricing clearly.",
                confidenceScore: 93,
                actionTitle: "Apply Fee Copy Overrides",
                actionData: { notes: "Fallback recommendation." }
              }
            ];
          }
          text = JSON.stringify(dynamicRecs);
          break;
        case 'learning_personalization':
          text = "### 🌟 Custom 1-Day Personalized Activity Blueprint\n\n**Age Bracket:** 3-5 Years\n**Target Focus Area:** Cognitive Logical Sorting & Verbal Expression\n\n---\n\n#### 🧩 Morning Activity: 'Match & Sort the Household Treasures'\n*   **Goal**: Cultivate categorization, motor skill control, and color/size recognition.\n*   **How-To**: Collect a safe variety of household items (e.g., plastic cups, spoons, colorful blocks, socks). Guide the child to sort them first by size (Big vs. Small), then by color.\n*   **Parent Prompt**: *'Wow! Can you find all the blue treasures and group them in this circle?'*\n\n#### 📖 Afternoon Activity: 'Imaginative Story Weaving'\n*   **Goal**: Stimulate narrative reasoning, vocabulary acquisition, and focus.\n*   **How-To**: Open any picture book. Instead of reading the printed words, ask the child to make up a brand new story based strictly on what the characters are doing in the illustrations.\n*   **Parent Prompt**: *'Look at this little rabbit! Where do you think he is running so fast?'*";
          break;
        default:
          text = "This is a preloaded, high-quality simulated answer. To enable dynamic generative content, please configure the GEMINI_API_KEY environment variable in your AI Studio settings.";
      }
      return res.json({ text });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      let systemInstruction = "You are a helpful assistant for school administrators.";
      let model = "gemini-3.5-flash";

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
        case 'learning_personalization':
          systemInstruction = "You are an expert early childhood development (ECD) educator in Eswatini. Create a highly encouraging, gamified, and tailored 1-day personalized educational activity plan based on the child's age, interests, and target skill focus. Structure it with rich markdown, bullet points, and friendly emojis. Keep it extremely actionable for parents and write it in a warm, inspirational tone.";
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
      console.warn("GEMINI_API_KEY not set. Running local keyword-based matching for schools.");
      try {
        const dataPath = path.join(process.cwd(), "src/data/preloadedSchools.json");
        const schools: any[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        
        const reqLower = (requirements || "").toLowerCase();
        let matched = schools.filter(s => {
          return s.name.toLowerCase().includes(reqLower) || 
                 s.town.toLowerCase().includes(reqLower) || 
                 s.region.toLowerCase().includes(reqLower) ||
                 s.description.toLowerCase().includes(reqLower) ||
                 s.curriculum.toLowerCase().includes(reqLower);
        });
        
        if (matched.length === 0) {
          matched = schools.slice(0, 2);
        }
        return res.json(matched);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const dataPath = path.join(process.cwd(), "src/data/preloadedSchools.json");
      const schools: any[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

      const model = "gemini-3.5-flash";

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
      console.warn("GEMINI_API_KEY not set. Running Local Contextual AI Chat Agent.");
      const lastMsg = (messages && messages.length > 0) ? messages[messages.length - 1].text : "";
      const lastMsgLower = lastMsg.toLowerCase();
      
      const schoolName = schoolContext?.name || "our preschool";
      const fee = schoolContext?.feePerTerm || "competitive rates";
      const town = schoolContext?.town || "Eswatini";
      const curriculum = schoolContext?.curriculum || "Early Childhood development frameworks";
      
      let reply = `Hello! Thank you for inquiring about ${schoolName}. `;
      if (lastMsgLower.includes("fee") || lastMsgLower.includes("price") || lastMsgLower.includes("cost") || lastMsgLower.includes("pay")) {
        reply += `Our school fee is currently ${fee} per term. This covers all developmental materials, classroom resources, and playground upkeep.`;
      } else if (lastMsgLower.includes("curriculum") || lastMsgLower.includes("learn") || lastMsgLower.includes("teach")) {
        reply += `We follow the ${curriculum} curriculum. Our program focuses on holistic development, combining creative play with essential numeracy, literacy, and sensory motor skills.`;
      } else if (lastMsgLower.includes("location") || lastMsgLower.includes("where") || lastMsgLower.includes("address") || lastMsgLower.includes("town")) {
        reply += `We are situated in the beautiful town of ${town}. Please feel free to schedule a walkthrough to visit our campus in person!`;
      } else {
        reply += `We would love to help you enroll your child! We focus heavily on a high child-to-caregiver ratio and child safety. Please let us know if you would like to schedule a personal walkthrough or get an application form.`;
      }
      
      return res.json({ text: reply });
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
        model: "gemini-3.5-flash",
        config: { systemInstruction },
      });

      const lastMessage = messages[messages.length - 1];
      const response = await chat.sendMessage({ message: lastMessage.text });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/schools", (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "src/data/preloadedSchools.json");
      const fileData = fs.readFileSync(dataPath, "utf-8");
      res.json(JSON.parse(fileData));
    } catch (e) {
      console.error("Failed to load preloaded schools:", e);
      res.json([]);
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { planId, billingCycle, schoolName, email } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const PLANS_DATA: Record<string, any> = {
        starter: { name: "Starter Plan", amount: billingCycle === 'annual' ? 2490 : 299 },
        standard: { name: "Standard Plan", amount: billingCycle === 'annual' ? 4990 : 499 },
        professional: { name: "Professional Plan", amount: billingCycle === 'annual' ? 8990 : 899 },
        enterprise: { name: "Enterprise Plan", amount: billingCycle === 'annual' ? 14990 : 1499 },
      };

      const plan = PLANS_DATA[planId] || PLANS_DATA.standard;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "szl", // Emalangeni
              product_data: {
                name: `Preschools Eswatini - ${plan.name}`,
                description: `Subscription for ${schoolName}`,
              },
              unit_amount: plan.amount * 100, // Stripe expects cents/cents equivalent
            },
            quantity: 1,
          },
        ],
        customer_email: email,
        mode: "payment",
        success_url: `${req.headers.origin}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing?canceled=true`,
        metadata: {
          schoolName,
          planId,
          billingCycle
        }
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
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
