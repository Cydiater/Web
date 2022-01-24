import type { NextPage } from 'next';
import Head from 'next/head';
import jinghuiAvatar from '../public/jinghui.jpg';
import Image from 'next/image';
import PostPreview from '../components/post-preview';

const Home: NextPage = () => {
	return (
		<div className="flex flex-col items-center">
			<Head>
				<title>Cydiater Site</title>
				<meta name="description" content="Personal Site of Cydiater" />
			</Head>

			<div className="flex flex-col items-center space-y-2 pt-5 px-3">

				<Image
					src={jinghuiAvatar}
					alt="my selfish"
					width={150}
					height={150}
					className="rounded-full"
				></Image>

				<h1 className="text-3xl font-bold text-center text-stone-700">
					Hi 👋 , I&#39;m Cydiater
				</h1>

				<p className="text-neutral-400 italic max-w-xl">
					This is a trivial side-project for building a personal blog website to help me kill the spare holiday time. 
					Checkout the <a href="https://github.com/Cydiater/Web" className="underline">Github Repo</a> to view the source code and reach me out.
				</p>

			</div>

			<div className="flex flex-col items-left space-y-3 pt-5 w-full max-w-xl">
				<PostPreview 
					title="Demo Post Title"
					postDate={new Date('2000-08-09')}
					intro="Do not go gentle into that good night."
				/>
			</div>

		</div>
	)
}

export default Home
