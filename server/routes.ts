import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { db } from "./db";
import { services, experts, testimonials, awards, industries } from "@shared/schema";
import { connectMongoDB } from "./mongodb";
import { setupBlogSession, registerBlogRoutes } from "./blog-routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Connect MongoDB and register blog routes
  await connectMongoDB();
  setupBlogSession(app);
  registerBlogRoutes(app);

  app.get(api.services.list.path, async (_req, res) => {
    const data = await storage.getServices();
    res.json(data);
  });

  app.get(api.experts.list.path, async (_req, res) => {
    const data = await storage.getExperts();
    res.json(data);
  });

  app.get(api.testimonials.list.path, async (_req, res) => {
    const data = await storage.getTestimonials();
    res.json(data);
  });

  app.get(api.awards.list.path, async (_req, res) => {
    const data = await storage.getAwards();
    res.json(data);
  });

  app.get(api.industries.list.path, async (_req, res) => {
    const data = await storage.getIndustries();
    res.json(data);
  });

  // Seed data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingServices = await storage.getServices();
  if (existingServices.length === 0) {
    await db.insert(services).values([
      {
        title: "Accounting & Bookkeeping",
        icon: "FileText",
        link: "#",
        description: "General Ledger & Trial Balance Preparation, Accounts Payable & Receivable Management, Financial Statement Preparation, Bank & Credit Card Reconciliations, Cloud-Based Accounting Support (Xero, QuickBooks, Sage, etc.)"
      },
      {
        title: "Tax Preparation & Compliance",
        icon: "Calculator",
        link: "#",
        description: "Corporate & Individual Tax Returns, VAT/GST & Sales Tax Filings, Tax Planning & Advisory, IRS & HMRC Compliance Support"
      },
      {
        title: "Payroll Processing",
        icon: "Users",
        link: "#",
        description: "Payroll Setup & Processing, Payslip Generation & Compliance Reporting, Superannuation & Pension Contributions, End-of-Year Payroll Reconciliation"
      },
      {
        title: "Financial Analysis & Reporting",
        icon: "BarChart3",
        link: "#",
        description: "Budgeting & Forecasting, Cash Flow & Profitability Analysis, Management Reporting & KPI Tracking"
      }
    ]);
  }

  const existingExperts = await storage.getExperts();
  if (existingExperts.length === 0) {
    await db.insert(experts).values([
      {
        name: "Richard Bartolanzo",
        role: "Partner",
        phone: "678.302.1471",
        email: "richard.bartolanzo@btcpa.net",
        category: "Technology",
        imageUrl:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      },
      {
        name: "Brian Hamm",
        role: "Partner",
        phone: "678.218.1304",
        email: "brian.hamm@btcpa.net",
        category: "Technology",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      },
    ]);
  }

  const existingTestimonials = await storage.getTestimonials();
  if (existingTestimonials.length === 0) {
    await db.insert(testimonials).values([
      {
        quote:
          "As always, we very much appreciate your hard work and the hard work of the entire BT team.",
        author: "SVP & Chief Compliance Officer",
        company: "Global Distribution Company",
      },
      {
        quote:
          "Bennett Thrasher provided exceptional second mile audit services for Trilith Studios. Their team was thorough, knowledgeable...",
        author: "Ginny Hernandez",
        company: "Trilith Studios",
      },
      {
        quote:
          "In the past, I have used two of the top four national accounting firms for advice. I have found Jeff Call's firm Bennett Thrasher, the most responsive...",
        author: "Guy Millner",
        company: "Chairman Assurance, America, Corporation",
      },
    ]);
  }

  const existingAwards = await storage.getAwards();
  if (existingAwards.length === 0) {
    await db.insert(awards).values([
      { title: "Vault Top Ranked", year: "2026", imageUrl: "" },
      {
        title: "Inside Public Accounting Best of the Best",
        year: "2025",
        imageUrl: "",
      },
      { title: "Top 100 Firms", year: "2025", imageUrl: "" },
    ]);
  }

  const existingIndustries = await storage.getIndustries();
  if (existingIndustries.length === 0) {
    await db.insert(industries).values([
      {
        title: "Accounting & CPA Firms",
        description: "Specialized support for accounting practices to enhance operational efficiency.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
      },
      {
        title: "E-commerce & Retail",
        description: "Tailored financial solutions for the fast-paced world of digital and physical retail.",
        imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80"
      },
      {
        title: "Hospitality & Restaurants",
        description: "Expert accounting for the service industry, focusing on growth and cost management.",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
      },
      {
        title: "Real Estate & Construction",
        description: "Strategic tax and accounting services for developers, contractors, and owners.",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592dea58ef21?w=800&q=80"
      },
      {
        title: "Healthcare & Medical Practices",
        description: "Compliance and financial management for private practices and healthcare groups.",
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80"
      },
      {
        title: "Financial Services & Wealth Management",
        description: "Sophisticated accounting for investment firms and wealth management practices.",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
      }
    ]);
  }
}
