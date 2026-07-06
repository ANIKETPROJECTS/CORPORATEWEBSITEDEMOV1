import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import { BlogPost, SiteSettings, slugify } from "./mongodb";

declare module "express-session" {
  interface SessionData {
    adminAuthenticated?: boolean;
  }
}

// ─── Multer Setup ─────────────────────────────────────────────────────────────

const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `hero-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// ─── Session Middleware ───────────────────────────────────────────────────────

const MemStore = MemoryStore(session);

export function setupBlogSession(app: Express) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "blog-secret-fallback",
      resave: false,
      saveUninitialized: false,
      store: new MemStore({ checkPeriod: 86400000 }),
      cookie: { maxAge: 86400000, httpOnly: true },
    })
  );
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.adminAuthenticated) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SLIDES = [
  { main: "Financial", sub: "confidence for", highlight: "today" },
  { main: "Strategic", sub: "guidance for", highlight: "growth" },
  { main: "Expert", sub: "solutions for", highlight: "success" },
];

const DEFAULT_CONTENT = {
  subtitle: "Tax, Audit & Advisory Solutions Built for Today's Businesses",
  primaryBtn: { text: "Explore Services", link: "/services" },
  secondaryBtn: { text: "Connect Now", link: "/contact" },
};

const DEFAULT_HERO_ASSETS = [
  { src: "image_1768148843306.png", dest: "hero-default-1.png" },
  { src: "image_1768148862409.png", dest: "hero-default-2.png" },
  { src: "image_1768148880563.png", dest: "hero-default-3.png" },
];

// ─── Seed All Defaults ────────────────────────────────────────────────────────

async function seedDefaults() {
  // Seed hero images: copy static assets into uploads + store in MongoDB
  const existing = await SiteSettings.findOne({ key: "heroImages" });
  if (!existing || !existing.value || (existing.value as string[]).length === 0) {
    const assetsDir = path.resolve(process.cwd(), "attached_assets");
    const urls: string[] = [];

    for (const { src, dest } of DEFAULT_HERO_ASSETS) {
      const srcPath = path.join(assetsDir, src);
      const destPath = path.join(uploadsDir, dest);
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
      if (fs.existsSync(destPath)) urls.push(`/uploads/${dest}`);
    }

    if (urls.length > 0) {
      await SiteSettings.findOneAndUpdate(
        { key: "heroImages" },
        { $set: { value: urls } },
        { upsert: true }
      );
      console.log("[MongoDB] Seeded default hero images");
    }
  }

  // Seed hero slides text
  const slidesExist = await SiteSettings.findOne({ key: "heroSlides" });
  if (!slidesExist) {
    await SiteSettings.create({ key: "heroSlides", value: DEFAULT_SLIDES });
    console.log("[MongoDB] Seeded default hero slides");
  }

  // Seed hero content (subtitle + buttons)
  const contentExist = await SiteSettings.findOne({ key: "heroContent" });
  if (!contentExist) {
    await SiteSettings.create({ key: "heroContent", value: DEFAULT_CONTENT });
    console.log("[MongoDB] Seeded default hero content");
  }
}

// ─── Seed Dummy Posts ─────────────────────────────────────────────────────────

async function seedDummyPosts() {
  const count = await BlogPost.countDocuments();
  if (count > 0) return;

  const posts = [
    {
      title: "5 Tax Planning Strategies Every Small Business Should Know",
      slug: "tax-planning-strategies-small-business",
      content: `<h2>Why Tax Planning Matters</h2><p>Effective tax planning is one of the most powerful tools a small business owner can use to maximize profitability. Rather than treating taxes as an afterthought, proactive planning throughout the year can save thousands of dollars.</p><h2>1. Choose the Right Business Structure</h2><p>Whether you operate as a sole proprietor, LLC, S-Corp, or C-Corp significantly impacts your tax liability. An S-Corp election, for example, can reduce self-employment taxes for profitable businesses.</p><h2>2. Maximize Deductible Expenses</h2><p>Home office deductions, vehicle mileage, professional development, software subscriptions, and equipment purchases are all deductible. Keep meticulous records throughout the year.</p><h2>3. Contribute to Retirement Accounts</h2><p>SEP-IRAs, SIMPLE IRAs, and Solo 401(k)s allow business owners to defer significant income while building retirement savings. Contributions reduce your taxable income dollar-for-dollar.</p><h2>4. Take Advantage of Section 179</h2><p>The Section 179 deduction allows businesses to deduct the full cost of qualifying equipment and software in the year of purchase rather than depreciating it over several years.</p><h2>5. Work with a CPA Year-Round</h2><p>Tax planning isn't just a year-end activity. Regular check-ins with your CPA help you make strategic decisions throughout the year that minimize your tax burden.</p>`,
      excerpt: "Proactive tax planning can save your small business thousands each year. Discover five proven strategies that every business owner should implement.",
      author: "CoreAxis Global",
      category: "Tax",
      tags: ["Tax Planning", "Small Business", "Deductions"],
      coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
      published: true,
    },
    {
      title: "Understanding Cash Flow: The Lifeblood of Your Business",
      slug: "understanding-cash-flow-business",
      content: `<h2>Cash Flow vs. Profit: What's the Difference?</h2><p>Many business owners confuse profit with cash flow. A business can be profitable on paper while still running out of cash. Understanding this distinction is critical to long-term survival.</p><h2>Common Cash Flow Problems</h2><p>Late-paying customers, seasonal revenue fluctuations, rapid growth, and poor inventory management are among the most common causes of cash flow issues.</p><h2>Strategies to Improve Cash Flow</h2><p>Invoice promptly and offer early payment discounts. Negotiate extended payment terms with suppliers. Maintain a cash reserve equal to 3–6 months of operating expenses.</p>`,
      excerpt: "Cash flow is the lifeblood of any business. Learn how to read your cash flow statement, identify problems early, and implement strategies to keep your business financially healthy.",
      author: "CoreAxis Global",
      category: "Accounting",
      tags: ["Cash Flow", "Financial Management"],
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      published: true,
    },
    {
      title: "The Complete Guide to Payroll Compliance in 2026",
      slug: "payroll-compliance-guide-2026",
      content: `<h2>Why Payroll Compliance Is Non-Negotiable</h2><p>Payroll errors and non-compliance can result in substantial penalties from the IRS, state agencies, and Department of Labor.</p><h2>Key Payroll Taxes</h2><p>Employers are responsible for withholding federal and state income taxes, Social Security (6.2%), and Medicare (1.45%) from employee wages.</p><h2>Automate Where Possible</h2><p>Modern payroll software automates tax calculations, generates pay stubs, and files quarterly returns.</p>`,
      excerpt: "Payroll compliance is complex and ever-changing. This comprehensive guide walks you through the key requirements every employer must meet in 2026.",
      author: "CoreAxis Global",
      category: "Payroll",
      tags: ["Payroll", "Compliance", "Employment Tax"],
      coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      published: true,
    },
    {
      title: "How AI Is Transforming the Accounting Industry",
      slug: "ai-transforming-accounting-industry",
      content: `<h2>The Rise of AI in Financial Services</h2><p>Artificial intelligence is no longer a futuristic concept for accounting — it's actively reshaping how firms operate, deliver services, and create value for clients.</p><h2>Automated Data Entry and Reconciliation</h2><p>AI-powered tools can extract data from receipts, invoices, and bank statements automatically, reducing manual entry errors.</p><h2>Predictive Financial Analytics</h2><p>AI can analyze historical financial data to generate forecasts, identify trends, and model scenarios.</p>`,
      excerpt: "Artificial intelligence is revolutionizing accounting. Discover how AI tools are automating routine tasks and enabling accountants to deliver greater strategic value.",
      author: "CoreAxis Global",
      category: "Technology",
      tags: ["AI", "Technology", "Innovation"],
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      published: true,
    },
    {
      title: "Real Estate Investors: Key Tax Deductions You May Be Missing",
      slug: "real-estate-investor-tax-deductions",
      content: `<h2>Real Estate and Tax Advantages</h2><p>Real estate investing comes with a remarkable array of tax benefits that, when properly utilized, can dramatically improve your after-tax returns.</p><h2>Depreciation: Your Most Powerful Tool</h2><p>Residential rental properties can be depreciated over 27.5 years, while commercial properties depreciate over 39 years.</p><h2>1031 Exchanges</h2><p>A 1031 exchange allows you to defer capital gains taxes when selling an investment property by reinvesting the proceeds into a like-kind property.</p>`,
      excerpt: "Real estate investors have access to powerful tax advantages that many fail to fully utilize. Learn about depreciation, cost segregation, 1031 exchanges, and more.",
      author: "CoreAxis Global",
      category: "Real Estate",
      tags: ["Real Estate", "Tax Deductions", "Investment"],
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      published: true,
    },
    {
      title: "Building a Financial Forecast: A Step-by-Step Guide for Startups",
      slug: "financial-forecast-guide-startups",
      content: `<h2>Why Startups Need Financial Forecasts</h2><p>A financial forecast isn't just a tool for investors — it's your roadmap to sustainable growth.</p><h2>Start with Revenue Projections</h2><p>Build your revenue model from the bottom up. Identify your pricing, estimate the number of customers you can realistically acquire each month, and project growth conservatively.</p><h2>Scenario Planning</h2><p>Build three scenarios: conservative, base, and optimistic. This range helps you plan for uncertainty and demonstrates to investors that you've thought rigorously about risks.</p>`,
      excerpt: "A solid financial forecast is essential for startup success. This step-by-step guide walks you through building revenue projections, expense models, and the three core financial statements.",
      author: "CoreAxis Global",
      category: "Advisory",
      tags: ["Startups", "Financial Planning", "Forecasting"],
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      published: true,
    },
  ];

  await BlogPost.insertMany(posts);
  console.log("[MongoDB] Seeded 6 dummy blog posts");
}

// ─── Route Registration ───────────────────────────────────────────────────────

export function registerBlogRoutes(app: Express) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

  // Seed on startup
  seedDummyPosts().catch(console.error);
  seedDefaults().catch(console.error);

  // ── Public Settings ───────────────────────────────────────────────────────
  app.get("/api/settings", async (_req, res) => {
    try {
      const [heroImgSetting, slidesSetting, contentSetting] = await Promise.all([
        SiteSettings.findOne({ key: "heroImages" }),
        SiteSettings.findOne({ key: "heroSlides" }),
        SiteSettings.findOne({ key: "heroContent" }),
      ]);
      return res.json({
        heroImages: heroImgSetting?.value || [],
        heroSlides: slidesSetting?.value || DEFAULT_SLIDES,
        heroContent: contentSetting?.value || DEFAULT_CONTENT,
      });
    } catch {
      return res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // ── Auth ──────────────────────────────────────────────────────────────────
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      req.session.adminAuthenticated = true;
      return res.json({ success: true });
    }
    return res.status(401).json({ message: "Invalid password" });
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {});
    return res.json({ success: true });
  });

  app.get("/api/admin/auth-check", (req: Request, res: Response) => {
    return res.json({ authenticated: !!req.session?.adminAuthenticated });
  });

  // ── Hero Image Upload ─────────────────────────────────────────────────────
  app.post(
    "/api/admin/settings/upload-hero",
    requireAdmin,
    upload.single("image"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const imageUrl = `/uploads/${req.file.filename}`;
        let setting = await SiteSettings.findOne({ key: "heroImages" });
        if (setting) {
          setting.value = [...(setting.value as string[]), imageUrl];
          await setting.save();
        } else {
          await SiteSettings.create({ key: "heroImages", value: [imageUrl] });
        }
        return res.json({ success: true, url: imageUrl });
      } catch {
        return res.status(500).json({ message: "Upload failed" });
      }
    }
  );

  // ── Hero Image Delete ─────────────────────────────────────────────────────
  app.delete("/api/admin/settings/hero-image", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      const setting = await SiteSettings.findOne({ key: "heroImages" });
      if (setting) {
        setting.value = (setting.value as string[]).filter((u: string) => u !== url);
        await setting.save();
        const filename = path.basename(url);
        // Don't delete the seeded defaults from disk
        if (!filename.startsWith("hero-default-")) {
          const filePath = path.join(uploadsDir, filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // ── Hero Slides Update ────────────────────────────────────────────────────
  app.put("/api/admin/settings/hero-slides", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { slides } = req.body;
      if (!Array.isArray(slides) || slides.length === 0)
        return res.status(400).json({ message: "slides must be a non-empty array" });
      await SiteSettings.findOneAndUpdate(
        { key: "heroSlides" },
        { $set: { value: slides } },
        { upsert: true }
      );
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Failed to update slides" });
    }
  });

  // ── Hero Content Update ───────────────────────────────────────────────────
  app.put("/api/admin/settings/hero-content", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { subtitle, primaryBtn, secondaryBtn } = req.body;
      await SiteSettings.findOneAndUpdate(
        { key: "heroContent" },
        { $set: { value: { subtitle, primaryBtn, secondaryBtn } } },
        { upsert: true }
      );
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Failed to update content" });
    }
  });

  // ── Public Blog ───────────────────────────────────────────────────────────
  app.get("/api/blog/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await BlogPost.find({ published: true })
        .sort({ createdAt: -1 })
        .select("-content")
        .lean();
      return res.json(posts);
    } catch {
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await BlogPost.findOne({ slug: req.params.slug, published: true }).lean();
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json(post);
    } catch {
      return res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get("/api/blog/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await BlogPost.distinct("category", { published: true });
      return res.json(categories);
    } catch {
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // ── Admin CRUD ────────────────────────────────────────────────────────────
  app.get("/api/admin/posts", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
      return res.json(posts);
    } catch {
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/admin/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const post = await BlogPost.findById(req.params.id).lean();
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json(post);
    } catch {
      return res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/admin/posts", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { title, content, excerpt, author, category, tags, coverImage, published } = req.body;
      if (!title || !content)
        return res.status(400).json({ message: "Title and content are required" });
      let slug = slugify(title);
      const existing = await BlogPost.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now()}`;
      const post = await BlogPost.create({
        title, slug, content,
        excerpt: excerpt || content.replace(/<[^>]+>/g, "").slice(0, 160),
        author: author || "CoreAxis Global",
        category: category || "General",
        tags: tags || [],
        coverImage: coverImage || "",
        published: published ?? false,
      });
      return res.status(201).json(post);
    } catch {
      return res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/admin/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { title, content, excerpt, author, category, tags, coverImage, published, slug } = req.body;
      const update: Record<string, any> = { title, content, excerpt, author, category, tags, coverImage, published };
      if (slug) {
        update.slug = slug;
      } else if (title) {
        const newSlug = slugify(title);
        const existing = await BlogPost.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
        update.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
      }
      const post = await BlogPost.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json(post);
    } catch {
      return res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/admin/posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const post = await BlogPost.findByIdAndDelete(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ message: "Failed to delete post" });
    }
  });
}
