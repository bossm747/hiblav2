import { createClient } from '@supabase/supabase-js'
import type { Database, BlogPost } from '../../../shared/supabase-types'
import { apiRequest } from './queryClient'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for blog posts - Updated to use backend API
export const blogPostsApi = {
  // Get all blog posts
  async getAll(): Promise<BlogPost[]> {
    return apiRequest('/api/blog-posts')
  },

  // Get featured blog posts
  async getFeatured(): Promise<BlogPost[]> {
    return apiRequest('/api/blog-posts?featured=true')
  },

  // Get blog post by ID
  async getById(id: number): Promise<BlogPost> {
    return apiRequest(`/api/blog-posts/${id}`)
  },

  // Get blog posts by category
  async getByCategory(category: string): Promise<BlogPost[]> {
    return apiRequest(`/api/blog-posts?category=${encodeURIComponent(category)}`)
  },

  // Create new blog post (admin only)
  async create(blogPost: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    return apiRequest('/api/blog-posts', {
      method: 'POST',
      body: JSON.stringify(blogPost),
    })
  },

  // Update blog post (admin only)
  async update(id: number, updates: Partial<Omit<BlogPost, 'id' | 'created_at'>>): Promise<BlogPost> {
    return apiRequest(`/api/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  // Delete blog post (admin only)
  async delete(id: number): Promise<void> {
    return apiRequest(`/api/blog-posts/${id}`, {
      method: 'DELETE',
    })
  }
}