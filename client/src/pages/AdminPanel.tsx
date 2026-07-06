import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Pencil, Trash2, Eye, EyeOff, LogOut, X, Check,
  AlertCircle, BookOpen, Lock, Home, Upload, ImageIcon, Loader2,
  Type, MousePointer, Plus, GripVertical, Save,
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id: string; title: string; slug: string; excerpt: string;
  author: string; category: string; tags: string[];
  coverImage: string; content: string; published: boolean; createdAt: string;
}

interface HeroSlide { main: string; sub: string; highlight: string; }

interface HeroContent {
  subtitle: string;
  primaryBtn: { text: string; link: string };
  secondaryBtn: { text: string; link: string };
}

interface SiteSettings {
  heroImages: string[];
  heroSlides: HeroSlide[];
  heroContent: HeroContent;
}

type FormData = Omit<BlogPost, "_id" | "slug" | "createdAt">;

const emptyForm: FormData = {
  title: "", content: "", excerpt: "", author: "CoreAxis Global",
  category: "General", tags: [], coverImage: "", published: false,
};

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await apiFetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      onSuccess();
    } catch (err: any) { setError(err.message || "Invalid password"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#002140] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#002140] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#002140]">Admin Panel</h1>
          <p className="text-gray-500 mt-1 text-sm">CoreAxis Global</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
              placeholder="Enter admin password" required />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-[#002140] text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all duration-200 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/"><span className="text-xs text-gray-400 hover:text-[#002140] cursor-pointer">← Back to website</span></Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Post Form Modal ──────────────────────────────────────────────────────────

function PostFormModal({ initial, onClose, onSave }: {
  initial: (BlogPost & { isNew?: boolean }) | (FormData & { isNew: true });
  onClose: () => void;
  onSave: (data: FormData, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<FormData>({
    title: (initial as any).title || "", content: (initial as any).content || "",
    excerpt: (initial as any).excerpt || "", author: (initial as any).author || "CoreAxis Global",
    category: (initial as any).category || "General", tags: (initial as any).tags || [],
    coverImage: (initial as any).coverImage || "", published: (initial as any).published ?? false,
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isNew = (initial as any).isNew;

  const set = (field: keyof FormData, value: any) => setForm((f) => ({ ...f, [field]: value }));
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await onSave(form, isNew ? undefined : (initial as BlogPost)._id);
      onClose();
    } catch (err: any) { setError(err.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#002140]">{isNew ? "Create New Post" : "Edit Post"}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
              placeholder="Post title" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author</label>
              <input value={form.author} onChange={(e) => set("author", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]" placeholder="Author name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <input value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]" placeholder="e.g. Tax, Accounting" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]" placeholder="https://example.com/image.jpg" />
            {form.coverImage && (
              <img src={form.coverImage} alt="preview" className="mt-2 rounded-lg h-32 w-full object-cover border"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140] resize-none"
              placeholder="Short summary shown on the blog listing" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content (HTML supported) <span className="text-red-500">*</span></label>
            <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={12}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140] resize-y font-mono"
              placeholder="<p>Write your post content here.</p>" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]" placeholder="Add tag and press Enter" />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {tag}
                  <button type="button" onClick={() => set("tags", form.tags.filter((t) => t !== tag))} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => set("published", !form.published)}
              className={`relative shrink-0 w-12 h-6 rounded-full overflow-hidden transition-colors duration-200 ${form.published ? "bg-green-500" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.published ? "translate-x-[26px]" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700 select-none">{form.published ? "Published" : "Draft"}</span>
          </div>
          {error && <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"><AlertCircle className="w-4 h-4" />{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#002140] text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? "Saving…" : <><Check className="w-4 h-4" />{isNew ? "Publish Post" : "Save Changes"}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Home Page Panel ──────────────────────────────────────────────────────────

function HomePagePanel() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"images" | "slides" | "content">("images");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
  });

  // ── Slides state ──────────────────────────────────────────────────────────
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [slidesDirty, setSlidesDirty] = useState(false);
  const [slidesSaving, setSlidesSaving] = useState(false);
  const [slidesSaved, setSlidesSaved] = useState(false);

  useEffect(() => {
    if (settings?.heroSlides) { setSlides(settings.heroSlides); setSlidesDirty(false); }
  }, [settings?.heroSlides]);

  const updateSlide = (i: number, field: keyof HeroSlide, val: string) => {
    setSlides((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
    setSlidesDirty(true);
  };
  const addSlide = () => { setSlides((prev) => [...prev, { main: "New", sub: "heading for", highlight: "you" }]); setSlidesDirty(true); };
  const removeSlide = (i: number) => { setSlides((prev) => prev.filter((_, idx) => idx !== i)); setSlidesDirty(true); };

  const saveSlides = async () => {
    setSlidesSaving(true);
    try {
      await apiFetch("/api/admin/settings/hero-slides", { method: "PUT", body: JSON.stringify({ slides }) });
      qc.invalidateQueries({ queryKey: ["/api/settings"] });
      setSlidesDirty(false); setSlidesSaved(true);
      setTimeout(() => setSlidesSaved(false), 3000);
    } catch { alert("Failed to save slides"); }
    finally { setSlidesSaving(false); }
  };

  // ── Content state ─────────────────────────────────────────────────────────
  const defaultContent: HeroContent = {
    subtitle: "Tax, Audit & Advisory Solutions Built for Today's Businesses",
    primaryBtn: { text: "Explore Services", link: "/services" },
    secondaryBtn: { text: "Connect Now", link: "/contact" },
  };
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [contentDirty, setContentDirty] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);

  useEffect(() => {
    if (settings?.heroContent) { setContent(settings.heroContent); setContentDirty(false); }
  }, [settings?.heroContent]);

  const setContentField = (path: string, val: string) => {
    setContent((prev) => {
      const updated = { ...prev };
      if (path === "subtitle") updated.subtitle = val;
      else if (path === "primaryBtn.text") updated.primaryBtn = { ...prev.primaryBtn, text: val };
      else if (path === "primaryBtn.link") updated.primaryBtn = { ...prev.primaryBtn, link: val };
      else if (path === "secondaryBtn.text") updated.secondaryBtn = { ...prev.secondaryBtn, text: val };
      else if (path === "secondaryBtn.link") updated.secondaryBtn = { ...prev.secondaryBtn, link: val };
      return updated;
    });
    setContentDirty(true);
  };

  const saveContent = async () => {
    setContentSaving(true);
    try {
      await apiFetch("/api/admin/settings/hero-content", { method: "PUT", body: JSON.stringify(content) });
      qc.invalidateQueries({ queryKey: ["/api/settings"] });
      setContentDirty(false); setContentSaved(true);
      setTimeout(() => setContentSaved(false), 3000);
    } catch { alert("Failed to save content"); }
    finally { setContentSaving(false); }
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const heroImages = settings?.heroImages || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(""); setUploadSuccess(false); setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/settings/upload-hero", { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setUploadSuccess(true);
      qc.invalidateQueries({ queryKey: ["/api/settings"] });
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) { setUploadError(err.message || "Upload failed"); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleDeleteImage = async (url: string) => {
    await fetch("/api/admin/settings/hero-image", { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    qc.invalidateQueries({ queryKey: ["/api/settings"] });
  };

  const tabs = [
    { id: "images", label: "Background Images", icon: ImageIcon },
    { id: "slides", label: "Slide Text", icon: Type },
    { id: "content", label: "Buttons & Subtitle", icon: MousePointer },
  ] as const;

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#002140]">Home Page Settings</h2>
        <p className="text-gray-500 mt-1 text-sm">Edit the hero section — images, headings, subtitle, and buttons.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? "bg-white text-[#002140] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* ── Images Tab ── */}
      {tab === "images" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-[#002140] mb-1">Hero Background Images</h3>
            <p className="text-gray-500 text-sm mb-5">These images rotate every 4 seconds in the hero section. The 3 default images are pre-loaded. Upload new ones to replace or add to them.</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 bg-[#002140] text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all disabled:opacity-60">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</> : <><Upload className="w-4 h-4" />Upload Image</>}
            </button>
            {uploadSuccess && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg"><Check className="w-4 h-4" />Image uploaded! Home page updated.</motion.div>}
            {uploadError && <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"><AlertCircle className="w-4 h-4" />{uploadError}</div>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#002140]">Current Images ({heroImages.length})</h3>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Hover to remove</span>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="aspect-video rounded-xl bg-gray-100 animate-pulse"/>)}</div>
            ) : heroImages.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No images yet. Upload one above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {heroImages.map((url, i) => (
                  <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={url} alt={`Hero ${i+1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <button onClick={() => handleDeleteImage(url)}
                        className="opacity-0 group-hover:opacity-100 transition bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition">Image {i+1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Slides Tab ── */}
      {tab === "slides" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700 text-sm">
            Each slide shows a rotating heading in the hero section. The <strong>Highlight</strong> word appears in gold.
          </div>

          {slides.map((slide, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <span className="text-sm font-bold text-[#002140]">Slide {i + 1}</span>
                </div>
                {slides.length > 1 && (
                  <button onClick={() => removeSlide(i)} className="text-gray-300 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Preview */}
              <div className="bg-[#002140] rounded-xl p-4 mb-4 text-left">
                <p className="text-white font-bold text-xl leading-snug">
                  {slide.main || "…"}<br />
                  {slide.sub || "…"}<br />
                  <span className="text-yellow-400">{slide.highlight || "…"}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Main Line</label>
                  <input value={slide.main} onChange={(e) => updateSlide(i, "main", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                    placeholder="Financial" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sub Line</label>
                  <input value={slide.sub} onChange={(e) => updateSlide(i, "sub", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                    placeholder="confidence for" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Highlight Word <span className="text-yellow-500">●</span></label>
                  <input value={slide.highlight} onChange={(e) => updateSlide(i, "highlight", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="today" />
                </div>
              </div>
            </div>
          ))}

          <button onClick={addSlide}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 hover:text-[#002140] hover:border-[#002140] rounded-2xl py-4 text-sm font-semibold transition">
            <Plus className="w-4 h-4" /> Add Slide
          </button>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={saveSlides} disabled={!slidesDirty || slidesSaving}
              className="flex items-center gap-2 bg-[#002140] text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all disabled:opacity-40">
              {slidesSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Slides</>}
            </button>
            {slidesSaved && <span className="text-green-600 text-sm font-semibold flex items-center gap-1"><Check className="w-4 h-4" />Saved! Home page updated.</span>}
          </div>
        </div>
      )}

      {/* ── Content Tab ── */}
      {tab === "content" && (
        <div className="space-y-6">
          {/* Subtitle */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-[#002140] mb-1">Subtitle Text</h3>
            <p className="text-gray-500 text-sm mb-4">The text that animates below the hero heading.</p>
            <textarea value={content.subtitle} onChange={(e) => setContentField("subtitle", e.target.value)}
              rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140] resize-none"
              placeholder="Tax, Audit & Advisory Solutions Built for Today's Businesses" />
          </div>

          {/* Primary Button */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-[#002140] mb-1">Primary Button <span className="text-xs font-normal text-gray-400">(gold button)</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                <input value={content.primaryBtn.text} onChange={(e) => setContentField("primaryBtn.text", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                  placeholder="Explore Services" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Link / URL</label>
                <input value={content.primaryBtn.link} onChange={(e) => setContentField("primaryBtn.link", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                  placeholder="/services" />
              </div>
            </div>
          </div>

          {/* Secondary Button */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-[#002140] mb-1">Secondary Button <span className="text-xs font-normal text-gray-400">(outline button)</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Button Text</label>
                <input value={content.secondaryBtn.text} onChange={(e) => setContentField("secondaryBtn.text", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                  placeholder="Connect Now" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Link / URL</label>
                <input value={content.secondaryBtn.link} onChange={(e) => setContentField("secondaryBtn.link", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                  placeholder="/contact" />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#002140] rounded-2xl p-6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3 font-semibold">Live Preview</p>
            <p className="text-white/80 text-base mb-4 italic">"{content.subtitle}"</p>
            <div className="flex gap-3 flex-wrap">
              <span className="bg-yellow-400 text-[#002140] px-6 py-2 rounded-full font-bold text-sm">{content.primaryBtn.text || "Button 1"}</span>
              <span className="border-2 border-white text-white px-6 py-2 rounded-full font-bold text-sm">{content.secondaryBtn.text || "Button 2"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={saveContent} disabled={!contentDirty || contentSaving}
              className="flex items-center gap-2 bg-[#002140] text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all disabled:opacity-40">
              {contentSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
            {contentSaved && <span className="text-green-600 text-sm font-semibold flex items-center gap-1"><Check className="w-4 h-4" />Saved! Home page updated.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Blog Panel ───────────────────────────────────────────────────────────────

function BlogPanel() {
  const qc = useQueryClient();
  const [modalPost, setModalPost] = useState<(BlogPost & { isNew?: boolean }) | (FormData & { isNew: true }) | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
    queryFn: () => apiFetch("/api/admin/posts"),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiFetch("/api/admin/posts", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/posts"] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      apiFetch(`/api/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/posts"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/admin/posts/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/posts"] }),
  });

  const handleSave = async (data: FormData, id?: string) => {
    if (id) await updateMutation.mutateAsync({ id, data });
    else await createMutation.mutateAsync(data);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="p-6 md:p-10">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Published", value: posts.filter((p) => p.published).length },
          { label: "Drafts", value: posts.filter((p) => !p.published).length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-[#002140]">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#002140]">All Posts</h2>
        <button onClick={() => setModalPost({ ...emptyForm, isNew: true })}
          className="flex items-center gap-2 bg-[#002140] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all text-sm">
          <PlusCircle className="w-4 h-4" />New Post
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-white rounded-xl animate-pulse"/>)}</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No posts yet.</p>
          <button onClick={() => setModalPost({ ...emptyForm, isNew: true })} className="mt-4 text-sm text-[#002140] font-semibold hover:text-yellow-500">Create your first post →</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-semibold">Title</th>
                <th className="text-left px-4 py-4 font-semibold hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-4 font-semibold hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-4 font-semibold">Status</th>
                <th className="text-right px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#002140] line-clamp-1">{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-mono">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="bg-[#002140]/10 text-[#002140] text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 hidden sm:table-cell">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-4">
                    {post.published
                      ? <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><Eye className="w-3.5 h-3.5"/>Published</span>
                      : <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold"><EyeOff className="w-3.5 h-3.5"/>Draft</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModalPost(post)} className="p-2 text-gray-400 hover:text-[#002140] rounded-lg hover:bg-gray-100 transition"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => setDeleteConfirm(post._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500"/></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Post?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={() => { deleteMutation.mutate(deleteConfirm); setDeleteConfirm(null); }} disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 text-sm disabled:opacity-60">
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {modalPost && <PostFormModal initial={modalPost} onClose={() => setModalPost(null)} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ active, onChange, onLogout }: { active: string; onChange: (s: string) => void; onLogout: () => void }) {
  const navItems = [
    { id: "home", label: "Home Page", icon: Home },
    { id: "blog", label: "Blog", icon: BookOpen },
  ];
  return (
    <aside className="w-60 shrink-0 min-h-screen bg-[#002140] flex flex-col border-r border-white/10">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-white font-bold text-lg">CX Admin</p>
        <p className="text-white/40 text-xs mt-0.5">CoreAxis Global</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active === id ? "bg-yellow-400 text-[#002140]" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
            <Icon className="w-4 h-4 shrink-0" />{label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/"><span className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm font-medium transition cursor-pointer">← View Website</span></Link>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition">
          <LogOut className="w-4 h-4"/>Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState("blog");

  useEffect(() => {
    fetch("/api/admin/auth-check", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAuthenticated(d.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return <div className="min-h-screen bg-[#002140] flex items-center justify-center"><div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"/></div>;
  }
  if (!authenticated) return <LoginForm onSuccess={() => setAuthenticated(true)} />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={activeSection} onChange={setActiveSection} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
            {activeSection === "home" ? <HomePagePanel /> : <BlogPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
