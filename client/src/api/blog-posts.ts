import { apiRequest } from '@/lib/queryClient';

export interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  read_time: number;
  image_alt: string;
  featured: boolean;
}

export interface CreateBlogPostData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  read_time: number;
  image_alt: string;
  featured?: boolean;
}

export const blogPostsApi = {
  // Public endpoints (no auth required)
  getAll: (): Promise<BlogPost[]> => 
    apiRequest('/api/blog-posts'),
    
  getById: (id: number): Promise<BlogPost> => 
    apiRequest(`/api/blog-posts/${id}`),
    
  getByCategory: (category: string): Promise<BlogPost[]> => 
    apiRequest(`/api/blog-posts?category=${encodeURIComponent(category)}`),
    
  getFeatured: (): Promise<BlogPost[]> => 
    apiRequest('/api/blog-posts?featured=true'),
    
  // Admin endpoints (auth required)
  create: (data: CreateBlogPostData): Promise<BlogPost> => 
    apiRequest('/api/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: number, data: Partial<CreateBlogPostData>): Promise<BlogPost> => 
    apiRequest(`/api/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: number): Promise<void> => 
    apiRequest(`/api/blog-posts/${id}`, {
      method: 'DELETE',
    }),
};