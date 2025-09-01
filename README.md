# Modern Blog Platform

![App Preview](https://imgix.cosmicjs.com/44c2bf40-875c-11f0-8dcc-651091f6a7c0-photo-1677442136019-21780ecad995-1756749080520.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A sophisticated Next.js blog platform that seamlessly integrates with your existing Cosmic content structure. Features dynamic post management, author profiles, category filtering, and a modern responsive design.

## ✨ Features

- **Dynamic Blog Posts** - Rich markdown content with featured images and excerpts
- **Author Profiles** - Complete author pages with bios, social links, and profile pictures
- **Category Filtering** - Filter posts by Technology, Travel, and Lifestyle
- **Responsive Design** - Mobile-first approach for all screen sizes
- **SEO Optimized** - Proper meta tags and structured data
- **Fast Performance** - Optimized images and efficient data fetching
- **Modern UI** - Clean design with Tailwind CSS styling

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a content model for a blog with posts, authors, and categories"

### Code Generation Prompt

> "Build a Next.js website that uses my existing objects in this bucket"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Content**: Cosmic Headless CMS
- **Language**: TypeScript
- **Package Manager**: Bun

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with your blog content

### Installation

1. Clone this repository
2. Install dependencies:
```bash
bun install
```

3. Set up your environment variables:
```bash
# Copy the example file
cp .env.example .env.local

# Add your Cosmic credentials
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Start the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Cosmic SDK Examples

### Fetching Blog Posts
```typescript
import { cosmic } from '@/lib/cosmic'

// Get all posts with author and category data
export async function getPosts() {
  try {
    const response = await cosmic.objects
      .find({ type: 'posts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Post[]
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}

// Get a single post by slug
export async function getPost(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'posts', slug })
      .props(['id', 'title', 'slug', 'metadata', 'content'])
      .depth(1)
    
    return response.object as Post
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}
```

### Working with Authors and Categories
```typescript
// Get all authors
export async function getAuthors() {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects as Author[]
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}

// Get posts by category
export async function getPostsByCategory(categoryId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'posts',
        'metadata.categories': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Post[]
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}
```

## 🔌 Cosmic CMS Integration

This application integrates with your existing Cosmic content model:

- **Posts** - Blog articles with markdown content, featured images, authors, and categories
- **Authors** - Writer profiles with bios, photos, and social media links  
- **Categories** - Topic organization with descriptions and brand colors

The content structure supports:
- Rich markdown content for blog posts
- Connected author and category relationships
- Featured images with automatic optimization
- Publication dates and featured post flags
- Social media integration for authors

## 🚀 Deployment Options

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy with automatic builds on push

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command to `bun run build`
3. Set publish directory to `.next`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
Make sure to set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`
