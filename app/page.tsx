import Link from 'next/link';

export default function Home() {
  // Featured games data
  const featuredGames = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic Snake game with modern graphics',
      image: '/images/snake-game.jpg',
      path: '/games/snake',
    },
    {
      id: 'coming-soon-1',
      title: '3D Adventure (Coming Soon)',
      description: 'Exciting 3D adventure with Babylon.js',
      image: '/images/coming-soon.jpg',
      path: '#',
    },
    {
      id: 'coming-soon-2',
      title: 'Puzzle Master (Coming Soon)',
      description: 'Challenge your brain with complex puzzles',
      image: '/images/coming-soon.jpg',
      path: '#',
    },
  ];

  // Game categories
  const categories = [
    'Action', 'Adventure', 'Puzzle', 'Strategy', 'Sports', 'Racing'
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-purple-800 to-blue-700 rounded-xl overflow-hidden">
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Play Amazing Games Online
              </h1>
              <p className="text-lg text-purple-100 mb-8">
                Discover our collection of free online games. Play the classic Snake game
                and stay tuned for upcoming 3D games built with Babylon.js!
              </p>
              <Link
                href="/games"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 inline-flex items-center"
              >
                Play Now
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Abstract shapes for decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full bg-purple-500"></div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 md:w-48 md:h-48 rounded-full bg-blue-500"></div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Games</h2>
          <Link href="/games" className="text-purple-400 hover:text-purple-300">
            View All Games
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <Link href={game.path} key={game.id} className="block">
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition duration-300 transform hover:-translate-y-1">
                <div className="relative h-48 bg-gray-700">
                  {/* We'll use a placeholder color until we have actual images */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-600">
                    <span className="text-xl font-bold">{game.title}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {game.id === 'snake' ? 'Available Now' : 'Coming Soon'}
                    </span>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-purple-100 bg-purple-700 rounded">
                      {game.id === 'snake' ? 'Play' : 'Preview'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Game Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center cursor-pointer transition duration-300"
            >
              <h3 className="text-md font-medium text-white">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
            <p className="text-gray-400">
              Subscribe to our newsletter to get updates on new games and features.
            </p>
          </div>
          <div className="md:w-1/2">
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}