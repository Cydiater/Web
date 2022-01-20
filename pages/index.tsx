import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Cydiater Site</title>
				<meta name="description" content="Personal Site of Cydiater" />
			</Head>
			<h1 className="text-3xl font-bold text-center text-sky-800 pt-10">
				Do not go gentle into that good night.
			</h1>
		</div>
	)
}

export default Home
