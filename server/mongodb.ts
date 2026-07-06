import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "";

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;
  if (!MONGODB_URL) {
    console.warn("[MongoDB] MONGODB_URL not set, blog features will be unavailable");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URL);
    isConnected = true;
    console.log("[MongoDB] Connected successfully");
  } catch (err) {
    console.error("[MongoDB] Connection failed:", err);
  }
}

// ─── Blog Post Schema ─────────────────────────────────────────────────────────

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    author: { type: String, default: "CoreAxis Global" },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    coverImage: { type: String, default: "" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);

// ─── Site Settings Schema ─────────────────────────────────────────────────────

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
});

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);

// Helper: turn a title into a URL-safe slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
