// API utilities for fetching data from Next.js API routes
export async function fetchBlogPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/blog-posts`, {
    next: { revalidate: 60 } // ISR - revalidate every minute
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts')
  }
  
  return response.json()
}

export async function fetchBlogPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/blog-posts/slug/${slug}`, {
    next: { revalidate: 60 } // ISR for individual posts
  })
  
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch blog post')
  }
  
  return response.json()
}

export async function fetchBlogSlugs() {
  const posts = await fetchBlogPosts()
  return posts.filter((post: any) => post.status === 'publicado').map((post: any) => ({
    slug: post.slug
  }))
}