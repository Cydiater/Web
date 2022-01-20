import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Cydiater Site</title>
				<meta name="description" content="Personal Site of Cydiater" />
			</Head>
			<div className="flex flex-col items-center space-y-2 pt-5">
				<h1 className="text-3xl font-bold text-center text-stone-700">
					Hi 👋 , I&#39;m Cydiater
				</h1>

				<p className="text-neutral-400 italic max-w-xl">
					This is a trivial side-project for building a personal blog website to help me kill the spare holiday time. 
					Checkout the <a href="https://github.com/Cydiater/Web" className="underline">Github Repo</a> to view the source code and reach me out.
				</p>
			</div>
		</div>
	)
}

export default Home
