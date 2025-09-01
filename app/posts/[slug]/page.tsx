// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getPosts } from '@/lib/cosmic';
import { formatDate, markdownToHtml, getReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const excerpt = post.metadata?.excerpt;
  const featuredImage = post.metadata?.featured_image;

  return {
    title: post.title,
    description: excerpt || `Read ${post.title} on Modern Blog`,
    openGraph: {
      title: post.title,
      description: excerpt || `Read ${post.title} on Modern Blog`,
      type: 'article',
      publishedTime: post.metadata?.publication_date,
      authors: post.metadata?.author ? [post.metadata.author.title] : undefined,
      images: featuredImage ? [{ url: featuredImage.imgix_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt || `Read ${post.title} on Modern Blog`,
      images: featuredImage ? [featuredImage.imgix_url] : undefined,
    },
  };
}

// Generate static params for build optimization
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const author = post.metadata?.author;
  const categories = post.metadata?.categories;
  const featuredImage = post.metadata?.featured_image;
  const publicationDate = post.metadata?.publication_date;
  const content = post.metadata?.content;

  // Convert markdown to HTML
  const htmlContent = content ? markdownToHtml(content) : '';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <nav className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: `${category.metadata?.color}20`,
                  color: category.metadata?.color || '#6b7280',
                }}
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 border-b border-gray-200 pb-6">
          {/* Author */}
          {author && (
            <div className="flex items-center space-x-3">
              {author.metadata?.profile_picture ? (
                <img
                  src={`${author.metadata.profile_picture.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                  alt={author.title}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {author.title.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <Link
                  href={`/authors/${author.slug}`}
                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {author.title}
                </Link>
                <div className="text-sm text-gray-500">Author</div>
              </div>
            </div>
          )}

          {/* Publication Date */}
          {publicationDate && (
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(publicationDate)}
            </div>
          )}

          {/* Reading Time */}
          {content && (
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getReadingTime(content)}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {featuredImage && (
        <div className="mb-8">
          <img
            src={`${featuredImage.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Article Content */}
      {htmlContent && (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}

      {/* Author Bio */}
      {author && author.metadata?.bio && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
            <div className="flex items-start space-x-4">
              {author.metadata?.profile_picture ? (
                <img
                  src={`${author.metadata.profile_picture.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                  alt={author.title}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-medium text-gray-600">
                    {author.title.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{author.title}</h4>
                <p className="text-gray-600 mb-3">{author.metadata.bio}</p>
                <div className="flex space-x-4">
                  {author.metadata?.twitter && (
                    <a
                      href={`https://twitter.com/${author.metadata.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Twitter
                    </a>
                  )}
                  {author.metadata?.linkedin && (
                    <a
                      href={author.metadata.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      LinkedIn
                    </a>
                  )}
                  {author.metadata?.website && (
                    <a
                      href={author.metadata.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}