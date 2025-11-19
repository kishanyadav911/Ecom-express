import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from '../components/Router';
import { Calendar, User, ChevronLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  published_at: string;
  profiles?: { full_name: string | null };
}

interface BlogDetailPageProps { slug: string; }

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles(full_name)')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-8" /></div></div>);
  if (!post) return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1><button onClick={() => navigate('/blog')} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 justify-center"><ChevronLeft className="w-4 h-4" />Back to blog</button></div>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/blog')} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-8"><ChevronLeft className="w-4 h-4" />Back to blog</button>

      {post.featured_image && (<img src={post.featured_image} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-8" />)}

      <article>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {post.profiles?.full_name && (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {post.profiles.full_name}
            </div>
          )}
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {post.content.split('\n').map((paragraph, index) => (<p key={index} className="mb-4">{paragraph}</p>))}
        </div>
      </article>
    </div>
  );
}
