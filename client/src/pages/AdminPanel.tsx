import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Pencil, Trash2, Eye, EyeOff, LogOut, X, Check,
  AlertCircle, BookOpen, Lock, Home, Upload, ImageIcon, Loader2,
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
  content: string;
  published: boolean;
  createdAt: string;
}

type FormData = Omit<BlogPost, "_id" | "slug" | "createdAt">;

const emptyForm: FormData = {
  title: "",
  content: "",
  excerpt: "",
  author: "CoreAxis Global",
  category: "General",
  tags: [],
  coverImage: "",
  published: false,
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
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002140] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md"
      >
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140] transition"
              placeholder="Enter admin password"
              required
              data-testid="input-admin-password"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            data-testid="button-sign-in"
            className="w-full bg-[#002140] text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/">
            <span className="text-xs text-gray-400 hover:text-[#002140] cursor-pointer transition-colors">
              ← Back to website
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Post Form Modal ──────────────────────────────────────────────────────────

function PostFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial: (BlogPost & { isNew?: boolean }) | (FormData & { isNew: true });
  onClose: () => void;
  onSave: (data: FormData, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<FormData>({
    title: (initial as any).title || "",
    content: (initial as any).content || "",
    excerpt: (initial as any).excerpt || "",
    author: (initial as any).author || "CoreAxis Global",
    category: (initial as any).category || "General",
    tags: (initial as any).tags || [],
    coverImage: (initial as any).coverImage || "",
    published: (initial as any).published ?? false,
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isNew = (initial as any).isNew;

  const set = (field: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form, isNew ? undefined : (initial as BlogPost)._id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#002140]">
            {isNew ? "Create New Post" : "Edit Post"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
              placeholder="Post title"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author</label>
              <input
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                placeholder="e.g. Tax, Accounting"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
            <input
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
              placeholder="https://example.com/image.jpg"
            />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="preview"
                className="mt-2 rounded-lg h-32 w-full object-cover border border-gray-100"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140] resize-none"
              placeholder="Short summary shown on the blog listing"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Content (HTML supported) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={12}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140] resize-y font-mono"
              placeholder="<p>Write your post content here. HTML tags are supported.</p>"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#002140]"
                placeholder="Add tag and press Enter"
              />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {tag}
                  <button type="button" onClick={() => set("tags", form.tags.filter((t) => t !== tag))} className="ml-1 hover:text-red-500 transition">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("published", !form.published)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.published ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.published ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700">{form.published ? "Published" : "Draft"}</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />{error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#002140] text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { data: settings, isLoading } = useQuery<{ heroImages: string[] }>({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
  });

  const heroImages = settings?.heroImages || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadSuccess(false);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/settings/upload-hero", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setUploadSuccess(true);
      qc.invalidateQueries({ queryKey: ["/api/settings"] });
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (url: string) => {
    try {
      await fetch("/api/admin/settings/hero-image", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      qc.invalidateQueries({ queryKey: ["/api/settings"] });
    } catch {
      alert("Failed to delete image");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#002140]">Home Page Settings</h2>
        <p className="text-gray-500 mt-1 text-sm">Manage the hero background images that rotate on the home page.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-base font-bold text-[#002140] mb-1 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-yellow-400" />
          Hero Background Images
        </h3>
        <p className="text-gray-500 text-sm mb-5">
          Upload images to replace the default hero backgrounds. They will appear in rotation on the home page immediately.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          data-testid="input-hero-image"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid="button-upload-hero"
          className="flex items-center gap-2 bg-[#002140] text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all duration-200 disabled:opacity-60"
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</>
          ) : (
            <><Upload className="w-4 h-4" />Upload Image</>
          )}
        </button>

        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg"
          >
            <Check className="w-4 h-4" /> Image uploaded successfully! Home page updated.
          </motion.div>
        )}
        {uploadError && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />{uploadError}
          </div>
        )}
      </div>

      {/* Current Images */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#002140]">
            Current Hero Images ({heroImages.length})
          </h3>
          {heroImages.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              Hover to remove
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : heroImages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">No custom images uploaded yet</p>
            <p className="text-gray-300 text-xs mt-1">The home page is using default images. Upload images above to replace them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {heroImages.map((url, i) => (
              <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={url} alt={`Hero ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(url)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
                    title="Remove image"
                    data-testid={`button-delete-hero-${i}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Image {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-blue-700 text-sm">
          <strong>How it works:</strong> Uploaded images are stored and immediately used on the home page hero section. If you upload multiple images, they rotate automatically every 4 seconds. If no custom images are uploaded, the default images are shown.
        </p>
      </div>
    </div>
  );
}

// ─── Blog Panel ───────────────────────────────────────────────────────────────

function BlogPanel() {
  const qc = useQueryClient();
  const [modalPost, setModalPost] = useState<
    (BlogPost & { isNew?: boolean }) | (FormData & { isNew: true }) | null
  >(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
    queryFn: () => apiFetch("/api/admin/posts"),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      apiFetch("/api/admin/posts", { method: "POST", body: JSON.stringify(data) }),
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

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteConfirm(null);
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#002140]">All Posts</h2>
        <button
          onClick={() => setModalPost({ ...emptyForm, isNew: true })}
          data-testid="button-new-post"
          className="flex items-center gap-2 bg-[#002140] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#002140] transition-all duration-200 text-sm"
        >
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No posts yet.</p>
          <button onClick={() => setModalPost({ ...emptyForm, isNew: true })} className="mt-4 text-sm text-[#002140] font-semibold hover:text-yellow-500 transition">
            Create your first post →
          </button>
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
                <tr key={post._id} className="hover:bg-gray-50/50 transition-colors" data-testid={`row-post-${post._id}`}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#002140] line-clamp-1">{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-mono">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="bg-[#002140]/10 text-[#002140] text-xs font-semibold px-2.5 py-1 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 hidden sm:table-cell">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-4">
                    {post.published ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><Eye className="w-3.5 h-3.5" />Published</span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold"><EyeOff className="w-3.5 h-3.5" />Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModalPost(post)} className="p-2 text-gray-400 hover:text-[#002140] rounded-lg hover:bg-gray-100 transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(post._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Post?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">Cancel</button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition text-sm disabled:opacity-60"
                >
                  {deleteMutation.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Form Modal */}
      <AnimatePresence>
        {modalPost && (
          <PostFormModal
            initial={modalPost}
            onClose={() => setModalPost(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  active,
  onChange,
  onLogout,
}: {
  active: string;
  onChange: (s: string) => void;
  onLogout: () => void;
}) {
  const navItems = [
    { id: "home", label: "Home Page", icon: Home },
    { id: "blog", label: "Blog", icon: BookOpen },
  ];

  return (
    <aside className="w-60 shrink-0 min-h-screen bg-[#002140] flex flex-col border-r border-white/10">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-white font-bold text-lg tracking-tight">CX Admin</p>
        <p className="text-white/40 text-xs mt-0.5">CoreAxis Global</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            data-testid={`nav-${id}`}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              active === id
                ? "bg-yellow-400 text-[#002140]"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/">
          <span className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm font-medium transition cursor-pointer">
            ← View Website
          </span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

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
    return (
      <div className="min-h-screen bg-[#002140] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={activeSection} onChange={setActiveSection} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "home" ? <HomePagePanel /> : <BlogPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
