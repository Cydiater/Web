/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			{
				source: '/public/:path*',
				destination: '/:path*',
				permanent: true,
			},
		]
	},
}

module.exports = nextConfig
