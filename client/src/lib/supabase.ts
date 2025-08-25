import { createClient } from '@supabase/supabase-js'
import type { Database, BlogPost } from '../../../shared/supabase-types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for blog posts
export const blogPostsApi = {
  // Get all blog posts
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },

  // Get featured blog posts
  async getFeatured() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },

  // Get blog post by ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  // Get blog posts by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },

  // Create new blog post
  async create(blogPost: Omit<BlogPost, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([blogPost])
      .select()
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  // Update blog post
  async update(id: number, updates: Partial<Omit<BlogPost, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  // Delete blog post
  async delete(id: number) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}