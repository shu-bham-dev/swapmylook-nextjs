import type { Metadata } from 'next';
import { blogPageSEO } from '@/lib/seo.config';
import BlogPageClient from './BlogPageClient';


export const metadata: Metadata = blogPageSEO;

export default function BlogPage() {
  return <BlogPageClient />;
}