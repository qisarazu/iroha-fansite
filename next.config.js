/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    domains: ['i.ytimg.com']
  },
  async redirects() {
    return [
      {
        source: '/singing-stream',
        destination: '/singing-stream/search',
        permanent: true
      }
    ];
  }
};
