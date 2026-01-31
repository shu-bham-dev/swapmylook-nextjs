// Contentful CMS service for blog posts
import { createClient } from 'contentful';

// Contentful client configuration
const client = createClient({
  space: '5vhudjfreghp',
  accessToken: '-GYpJCnJPhB5aUQs0fMFj1j-ESU08Uz0RxstVCtdAfA',
  host: 'cdn.contentful.com',
});

// Types for blog posts based on the provided content type
export interface BlogPost {
  id: string;
  title: string;
  content: any; // RichText document
  media?: any;
  thumbnail?: any;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

// Fetch all blog posts
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: ['-fields.createdAt'], // Most recent first
      include: 2, // Include linked assets and entries
    });
    return response.items.map((item: any) => ({
      id: item.sys.id,
      title: String(item.fields.title || ''),
      content: item.fields.content,
      media: item.fields.media,
      thumbnail: item.fields.thumbnail,
      createdAt: String(item.fields.createdAt || item.sys.createdAt),
      updatedAt: item.sys.updatedAt,
      slug: String(item.fields.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// Fetch a single blog post by ID
export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const entry: any = await client.getEntry(id, { include: 2 });
    
    return {
      id: entry.sys.id,
      title: String(entry.fields.title || ''),
      content: entry.fields.content,
      media: entry.fields.media,
      thumbnail: entry.fields.thumbnail,
      createdAt: String(entry.fields.createdAt || entry.sys.createdAt),
      updatedAt: entry.sys.updatedAt,
      slug: String(entry.fields.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
}

// Fetch a single blog post by slug (title-based)
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.title[match]': slug.replace(/-/g, ' '),
      include: 2,
      limit: 1,
    });

    if (response.items.length === 0) {
      return null;
    }

    const entry = response.items[0];
    return {
      id: entry.sys.id,
      title: String(entry.fields.title || ''),
      content: entry.fields.content,
      media: entry.fields.media,
      thumbnail: entry.fields.thumbnail,
      createdAt: String(entry.fields.createdAt || entry.sys.createdAt),
      updatedAt: entry.sys.updatedAt,
      slug: slug,
    };
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// Fetch featured blog posts (most recent)
export async function fetchFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: ['-fields.createdAt'],
      limit,
      include: 2,
    });

    return response.items.map((item: any) => ({
      id: item.sys.id,
      title: String(item.fields.title || ''),
      content: item.fields.content,
      media: item.fields.media,
      thumbnail: item.fields.thumbnail,
      createdAt: String(item.fields.createdAt || item.sys.createdAt),
      updatedAt: item.sys.updatedAt,
      slug: String(item.fields.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    throw error;
  }
}

// Get asset URL by ID
export function getAssetUrl(assetId: string): string {
  return `https://images.ctfassets.net/5vhudjfreghp/${assetId}`;
}

// Contentful service instance
export const contentfulService = {
  fetchAllBlogPosts,
  fetchBlogPostById,
  fetchBlogPostBySlug,
  fetchFeaturedBlogPosts,
  getAssetUrl,
};