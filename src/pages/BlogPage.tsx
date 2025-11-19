import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from '../components/Router';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string;
  published_at: string;
  profiles?: { full_name: string | null };
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles(full_name)')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="animate-pulse space-y-6">{[...Array(3)].map((_, i) => (<div key={i} className="h-64 bg-gray-200 rounded-lg" />))}</div></div>);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
      <p className="text-gray-600 text-lg mb-12">Insights, tips, and stories from our team</p>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} onClick={() => navigate(`/blog/${post.slug}`)} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="grid md:grid-cols-3 gap-6">
                {post.featured_image && (
                  <div className="md:col-span-1 overflow-hidden bg-gray-100 h-48 md:h-full">
                    <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}

                <div className={`${post.featured_image ? 'md:col-span-2' : 'md:col-span-3'} p-6`}>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    {post.profiles?.full_name && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.profiles.full_name}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt || post.content.substring(0, 150)}...</p>

                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">Read More <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
