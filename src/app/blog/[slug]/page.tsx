import type { Metadata } from 'next';
import { blogDetailPageSEO } from '@/lib/seo.config';
import BlogDetailPageClient from './BlogDetailPageClient';

// For dynamic metadata, we need to fetch the blog post data
// This is a server component that can fetch data
async function getBlogPost(slug: string) {
  try {
    const { fetchBlogPostBySlug, fetchBlogPostById } = await import('@/services/contentful');
    
    // Try to fetch by slug first
    let post = await fetchBlogPostBySlug(slug);
    
    // If not found by slug, try to fetch by ID (if slug is actually an ID)
    if (!post) {
      post = await fetchBlogPostById(slug);
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { slug } = await params;
  const blogPost = await getBlogPost(slug);
  
  if (!blogPost) {
    return blogDetailPageSEO();
  }
  
  // Extract excerpt from content
  const getExcerpt = (content: any, maxLength: number = 155) => {
    if (!content || !content.content) return '';
    
    const firstParagraph = content.content.find((node: any) => node.nodeType === 'paragraph');
    if (!firstParagraph) return '';
    
    const text = firstParagraph.content
      .filter((node: any) => node.nodeType === 'text')
      .map((node: any) => node.value)
      .join(' ');
    
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  const excerpt = getExcerpt(blogPost.content);
  const imageUrl = blogPost.thumbnail?.fields?.file?.url
    ? `https:${blogPost.thumbnail.fields.file.url}`
    : undefined;
  
  return blogDetailPageSEO(blogPost.title, excerpt, imageUrl);
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params to get the slug
  const { slug } = await params;
  return <BlogDetailPageClient />;
}