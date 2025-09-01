import Link from 'next/link';
import { Post } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const featuredImage = post.metadata?.featured_image;
  const author = post.metadata?.author;
  const categories = post.metadata?.categories;
  const excerpt = post.metadata?.excerpt;
  const publicationDate = post.metadata?.publication_date;

  return (
    <article className={`group ${featured ? 'md:col-span-2' : ''}`}>
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          {/* Featured Image */}
          {featuredImage && (
            <div className={`relative overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-[16/10]'}`}>
              <img
                src={`${featuredImage.imgix_url}?w=${featured ? 800 : 600}&h=${featured ? 400 : 375}&fit=crop&auto=format,compress`}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {post.metadata?.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${category.metadata?.color}20`,
                      color: category.metadata?.color || '#6b7280',
                    }}
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}>
              {post.title}
            </h2>

            {/* Excerpt */}
            {excerpt && (
              <p className={`text-gray-600 mb-4 line-clamp-3 ${featured ? 'text-lg' : ''}`}>
                {excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {/* Author */}
                {author && (
                  <div className="flex items-center space-x-2">
                    {author.metadata?.profile_picture ? (
                      <img
                        src={`${author.metadata.profile_picture.imgix_url}?w=32&h=32&fit=crop&auto=format,compress`}
                        alt={author.title}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {author.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="font-medium">{author.title}</span>
                  </div>
                )}

                {/* Publication Date */}
                {publicationDate && (
                  <span>
                    {formatDate(publicationDate)}
                  </span>
                )}
              </div>

              {/* Reading Time */}
              {post.metadata?.content && (
                <span className="text-gray-400">
                  {getReadingTime(post.metadata.content)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}