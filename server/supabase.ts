import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import type { Database, BlogPost } from '../shared/supabase-types'

// Load environment variables
dotenv.config({ path: '../.env' })

const supabaseUrl = process.env.SUPABASE_URL || 'https://oearzpyxowmzjtjmieva.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYXJ6cHl4b3dtemp0am1pZXZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg1NDU3NCwiZXhwIjoyMDcxNDMwNTc0fQ.ElITAql5ch5xVPJgZBKXNqeNOYw2AVYoQKGHZilHq0s'

// Create Supabase client with service role key for backend operations
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Create Supabase client with anon key for user-context operations
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lYXJ6cHl4b3dtemp0am1pZXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTQ1NzQsImV4cCI6MjA3MTQzMDU3NH0._4lfAL9k8She7GK23AOvb8md7jXkgF1_7eFt21-bKjM'
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Admin API functions for blog posts (using service role)
export const blogPostsAdminApi = {
  // Get all blog posts (admin)
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create new blog post (admin)
  async create(blogPost: Omit<BlogPost, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([blogPost])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update blog post (admin)
  async update(id: number, updates: Partial<Omit<BlogPost, 'id' | 'created_at'>>) {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete blog post (admin)
  async delete(id: number) {
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Bulk operations (admin only)
  async bulkCreate(blogPosts: Omit<BlogPost, 'id' | 'created_at'>[]) {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert(blogPosts)
      .select()
    
    if (error) throw error
    return data
  },

  // Get analytics/stats (admin only)
  async getStats() {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('category, featured')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      featured: data.filter(post => post.featured).length,
      byCategory: data.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
    
    return stats
  }
}

// Public API functions for blog posts (using anon key)
export const blogPostsPublicApi = {
  // Get published blog posts
  async getPublished() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get featured blog posts
  async getFeatured() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get blog post by ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get blog posts by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}