import { getPosts, getFeaturedPosts } from '@/lib/cosmic';
import PostCard from '@/components/PostCard';

export default async function HomePage() {
  const [posts, featuredPosts] = await Promise.all([
    getPosts(),
    getFeaturedPosts()
  ]);

  // Get the first featured post for hero section
  const heroPost = featuredPosts && featuredPosts.length > 0 ? featuredPosts[0] : null;

  // Filter out the hero post from the main posts list
  const mainPosts = posts.filter(post => post.id !== heroPost?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {heroPost && (
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Modern Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insightful articles on technology, travel, and lifestyle. 
              Stay informed with our latest posts and expert perspectives.
            </p>
          </div>
          
          <div className="mb-8">
            <PostCard post={heroPost} featured={true} />
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Latest Posts
          </h2>
        </div>

        {mainPosts && mainPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">
              Check back soon for new content, or explore our authors and categories.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}