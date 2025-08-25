// Supabase Database Types
// Generated from blog_posts table schema

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPost
        Insert: BlogPostInsert
        Update: BlogPostUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Blog Post Types
export interface BlogPost {
  id: number
  created_at: string
  title: string
  excerpt: string
  content: string | null
  category: string
  author: string
  date: string
  read_time: string | null
  image_alt: string | null
  featured: boolean | null
}

export interface BlogPostInsert {
  id?: number
  created_at?: string
  title: string
  excerpt: string
  content?: string | null
  category: string
  author: string
  date: string
  read_time?: string | null
  image_alt?: string | null
  featured?: boolean | null
}

export interface BlogPostUpdate {
  id?: number
  created_at?: string
  title?: string
  excerpt?: string
  content?: string | null
  category?: string
  author?: string
  date?: string
  read_time?: string | null
  image_alt?: string | null
  featured?: boolean | null
}

// API Response Types
export interface BlogPostResponse {
  data: BlogPost | null
  error: string | null
}

export interface BlogPostsResponse {
  data: BlogPost[] | null
  error: string | null
}

// Filter and Query Types
export interface BlogPostFilters {
  category?: string
  featured?: boolean
  author?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface BlogPostQueryOptions {
  limit?: number
  offset?: number
  orderBy?: keyof BlogPost
  ascending?: boolean
}

// Statistics Types
export interface BlogPostStats {
  total: number
  featured: number
  byCategory: Record<string, number>
  byAuthor: Record<string, number>
  recentPosts: number
}

// Form Types for Frontend
export interface BlogPostFormData {
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  read_time?: string
  image_alt?: string
  featured?: boolean
}

// Validation Types
export interface BlogPostValidation {
  isValid: boolean
  errors: {
    title?: string
    excerpt?: string
    content?: string
    category?: string
    author?: string
    date?: string
    read_time?: string
    image_alt?: string
  }
}

// Common Blog Categories (can be extended)
export const BLOG_CATEGORIES = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Development',
  'Tutorial',
  'News',
  'Opinion',
  'Review',
  'Case Study'
] as const

export type BlogCategory = typeof BLOG_CATEGORIES[number]

// Utility Types
export type BlogPostWithoutId = Omit<BlogPost, 'id'>
export type BlogPostWithoutTimestamps = Omit<BlogPost, 'id' | 'created_at'>
export type BlogPostPreview = Pick<BlogPost, 'id' | 'title' | 'excerpt' | 'category' | 'author' | 'date' | 'featured' | 'image_alt'>

// API Endpoint Types
export interface BlogPostEndpoints {
  getAll: '/api/blog-posts'
  getById: '/api/blog-posts/:id'
  getByCategory: '/api/blog-posts/category/:category'
  getFeatured: '/api/blog-posts/featured'
  create: '/api/blog-posts'
  update: '/api/blog-posts/:id'
  delete: '/api/blog-posts/:id'
  getStats: '/api/blog-posts/stats'
}

// Supabase Client Types
export type SupabaseClient = any // Will be properly typed when @supabase/supabase-js is imported

// Error Types
export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}