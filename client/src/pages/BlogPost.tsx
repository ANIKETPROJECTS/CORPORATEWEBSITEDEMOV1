import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Calendar, Tag, ArrowLeft, User, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface BlogPostData {
  _id: string; title: string; slug: string; content: string;
  excerpt: string; author: string; category: string;
  tags: string[]; coverImage: string; createdAt: string;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";

  // Scroll to top whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  const { data: post, isLoading, isError } = useQuery<BlogPostData>({
    queryKey: ["/api/blog/posts", slug],
    queryFn: () => fetch(`/api/blog/posts/${slug}`).then((r) => r.json()),
    enabled: !!slug,
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {isLoading ? (
        <div className="container-custom py-24 max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        </div>
      ) : isError || !post || (post as any).message === "Post not found" ? (
        <div className="container-custom py-32 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600">Post not found</h2>
          <Link href="/blog">
            <span className="mt-6 inline-flex items-center gap-2 text-[#002140] font-semibold hover:text-secondary cursor-pointer">
              <ArrowLeft className="w-4 h-4" />Back to Blog
            </span>
          </Link>
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="relative bg-[#002140] overflow-hidden">
            {post.coverImage && (
              <div className="absolute inset-0">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#002140]/80 to-[#002140]" />
              </div>
            )}
            <div className="relative z-10 container-custom max-w-4xl mx-auto py-20 md:py-28">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                {/* Back link — own row */}
                <div className="mb-5">
                  <Link href="/blog">
                    <span className="inline-flex items-center gap-2 text-white/60 hover:text-secondary text-sm cursor-pointer transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Blog
                    </span>
                  </Link>
                </div>

                {/* Category badge — own row */}
                <div className="mb-4">
                  <span className="inline-block bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />{post.author}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />{formatDate(post.createdAt)}
                  </span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Article Body */}
          <section className="py-12 md:py-20 bg-white">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="container-custom max-w-4xl mx-auto"
            >
              <div
                className="prose prose-lg max-w-none prose-headings:text-[#002140] prose-a:text-secondary prose-strong:text-[#002140]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-500 mr-2 flex items-center gap-1">
                    <Tag className="w-4 h-4" /> Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              )}

              <div className="mt-12">
                <Link href="/blog">
                  <span className="inline-flex items-center gap-2 bg-[#002140] text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary hover:text-primary transition-all duration-300 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />Back to all posts
                  </span>
                </Link>
              </div>
            </motion.div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
