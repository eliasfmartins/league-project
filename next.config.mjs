/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
  domains: [
    'ddragon.leagueoflegends.com',
    'i.pravatar.cc',
    'image-1.uhdpaper.com',
    'image-2.uhdpaper.com',
    'image-5.uhdpaper.com',
    'image0.uhdpaper.com',
    'blogger.googleusercontent.com',
    'www.skinexplorer.lol',
    'raw.communitydragon.org',
    'www.leaguesplash.com',
  ],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.uhdpaper.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'blogger.googleusercontent.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'ddragon.leagueoflegends.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'i.pravatar.cc',
      pathname: '**',
    },
  ],
  unoptimized: true,
}
};

export default nextConfig;
