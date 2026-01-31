"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { fetchAllBlogPosts, fetchFeaturedBlogPosts, type BlogPost } from '@/services/contentful';

export default function BlogPageClient() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setIsLoading(true);
        const [allPosts, featured] = await Promise.all([
          fetchAllBlogPosts(),
          fetchFeaturedBlogPosts(3)
        ]);
        setBlogPosts(allPosts);
        setFeaturedPosts(featured);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogPosts();
  }, []);

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.content && JSON.stringify(post.content).toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  // Extract excerpt from content
  const getExcerpt = (content: any, maxLength: number = 150) => {
    if (!content || !content.content) return '';
    
    // Simple extraction - just get text from first paragraph
    const firstParagraph = content.content.find((node: any) => node.nodeType === 'paragraph');
    if (!firstParagraph) return '';
    
    const text = firstParagraph.content
      .filter((node: any) => node.nodeType === 'text')
      .map((node: any) => node.value)
      .join(' ');
    
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm mt-2">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">SwapMyLook Blog</h1>
              <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
                Discover the latest in AI fashion, style tips, technology insights, and community stories.
                Stay updated with our journey to revolutionize virtual try-ons.
              </p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && !isLoading && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Featured Articles
              </h2>
              <Button
                variant="ghost"
                className="text-pink-600 hover:text-pink-700"
                onClick={() => router.push('/blog')}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-linear-to-r from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {post.thumbnail?.fields?.file?.url ? (
                      <img
                        src={`https:${post.thumbnail.fields.file.url}`}
                        alt={post.thumbnail.fields.title || post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-12 h-12 text-pink-400" />
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
                    <p className="text-sm text-muted-foreground mb-4">
                      {getExcerpt(post.content, 100)}
                    </p>
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts List */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-6 mb-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </Card>
                ))
              ) : filteredPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try a different search term' : 'No blog posts available yet'}
                  </p>
                </Card>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="p-6 mb-6 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="aspect-video bg-linear-to-r from-pink-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
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
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>5 min read</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-pink-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {getExcerpt(post.content)}
                        </p>
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/blog/${post.slug || post.id}`}
                            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                          >
                            Read Full Article
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-muted-foreground">AI Fashion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {['AI Fashion', 'Technology', 'Sustainability', 'Personal Style', 'E-commerce'].map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-pink-600"
                    onClick={() => {/* Filter by category */}}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest articles on AI fashion and virtual try-on technology delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                  Subscribe
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}