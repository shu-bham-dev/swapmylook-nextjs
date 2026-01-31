"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  User,
  Tag,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { fetchBlogPostById, fetchBlogPostBySlug, fetchFeaturedBlogPosts, type BlogPost } from '@/services/contentful';
import { RichTextRenderer } from '@/components/RichTextRenderer';

export default function BlogDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        setIsLoading(true);
        let post: BlogPost | null = null;
        
        if (slug) {
          // Try to fetch by slug first
          post = await fetchBlogPostBySlug(slug);
          
          // If not found by slug, try to fetch by ID (if slug is actually an ID)
          if (!post) {
            post = await fetchBlogPostById(slug);
          }
        }
        
        if (post) {
          setBlogPost(post);
          
          // Load related posts (featured posts for now)
          const related = await fetchFeaturedBlogPosts(3);
          setRelatedPosts(related.filter(p => p.id !== post!.id).slice(0, 2));
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPost();
  }, [slug]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content: any) => {
    if (!content || !content.content) return 5;
    
    // Simple word count estimation
    const text = JSON.stringify(content).replace(/[^a-zA-Z\s]/g, ' ');
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
  };

  // Share functions
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = blogPost?.title || 'Check out this blog post!';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareByEmail = () => {
    const url = window.location.href;
    const subject = blogPost?.title || 'Blog Post';
    const body = `Check out this blog post: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => router.push('/blog')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => router.push('/blog')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
          
          <Card className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or may have been moved.
            </p>
            <Button onClick={() => router.push('/blog')}>
              Browse All Posts
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blogPost.content);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => router.push('/blog')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blogPost.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>AI Fashion</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {blogPost.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">SwapMyLook Team</div>
                <div className="text-sm text-muted-foreground">AI Fashion Experts</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={isBookmarked ? 'text-pink-600' : ''}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className="w-4 h-4 mr-1" />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <Card className="mb-8 overflow-hidden">
          <div className="aspect-video bg-linear-to-r from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden">
            {blogPost.thumbnail?.fields?.file?.url ? (
              <img
                src={`https:${blogPost.thumbnail.fields.file.url}`}
                alt={blogPost.thumbnail.fields.title || blogPost.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-16 h-16 text-pink-400" />
            )}
          </div>
        </Card>

        {/* Article Content */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {blogPost.content ? (
              <RichTextRenderer content={blogPost.content} />
            ) : (
              <div className="space-y-4">
                <p className="text-lg">
                  This blog post contains valuable insights about AI fashion and virtual try-on technology.
                </p>
                <p>
                  At SwapMyLook, we're revolutionizing how people explore fashion through artificial intelligence.
                  Our platform combines cutting-edge computer vision with intuitive design to create magical
                  experiences for fashion enthusiasts worldwide.
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4">The Future of Fashion Technology</h2>
                <p>
                  The integration of AI in fashion is transforming how we discover, try on, and purchase clothing.
                  With virtual try-on technology, users can visualize outfits on themselves without ever stepping
                  into a fitting room.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personalized style recommendations based on body type and preferences</li>
                  <li>Real-time outfit visualization with accurate fit and drape</li>
                  <li>Sustainable fashion through reduced returns and waste</li>
                  <li>Accessible style exploration for everyone</li>
                </ul>
                <p>
                  As we continue to innovate, we're excited to bring even more advanced features to our users,
                  making fashion exploration more accessible, sustainable, and enjoyable than ever before.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Share Section */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-2">Share this article</h3>
              <p className="text-sm text-muted-foreground">
                Help spread the word about AI fashion innovation
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={shareOnFacebook}
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={shareOnTwitter}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={shareOnLinkedIn}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={shareByEmail}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="aspect-video bg-linear-to-r from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {post.thumbnail?.fields?.file?.url ? (
                      <img
                        src={`https:${post.thumbnail.fields.file.url}`}
                        alt={post.thumbnail.fields.title || post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-pink-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-600 transition-colors">
                      {post.title}
                    </h3>
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <Card className="p-8 text-center bg-linear-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Ready to Transform Your Style?</h2>
              <p className="text-lg text-pink-100 max-w-2xl mx-auto">
                Experience the magic of AI fashion with SwapMyLook. Try on outfits virtually and discover your perfect style.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => router.push('/')}
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Try It Free
              </Button>
              <Button
                onClick={() => router.push('/blog')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Browse More Articles
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}