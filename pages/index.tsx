import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import jinghuiAvatar from '../public/jinghui.jpg';
import Image from 'next/image';
import { PostPreview } from '../components/post-preview';
import { getSortedPostData } from '../lib/posts';
import type { PostData } from '../lib/posts';

export const getStaticProps: GetStaticProps = async () => {
	const allPostData = getSortedPostData()
	return {
		props: {
			allPostData
		}
	}
}

type HomeProps = {
	allPostData: PostData[],
};

const Home: NextPage<HomeProps> = ({ allPostData }) => {
	return (
		<div className="flex flex-col items-center">
			<Head>
				<title>Cydiater Site</title>
				<meta name="description" content="Personal Site of Cydiater" />
			</Head>

			<div className="flex flex-col items-center space-y-2 pt-5 px-3">

				<div className="flex flex-row space-x-5 items-center w-full max-w-xs">
					<Image
						src={jinghuiAvatar}
						alt="my selfish"
						width={100}
						height={100}
						className="rounded-full"
					>
					</Image>

					<div className="grow"/>

					<h1 className="text-3xl font-bold text-center text-stone-700">
						Hi 👋 <br />
						I&#39;m Cydiater
					</h1>
				</div>

				<p className="text-neutral-400 italic max-w-2xl">
					This is a trivial side-project for building a personal blog website to help me kill the spare holiday time. 
					Checkout the <a href="https://github.com/Cydiater/Web" className="underline">Github Repo</a> to view the source code and reach me out.
				</p>

			</div>

			<div className="flex flex-col items-left space-y-3 pt-5 w-full max-w-2xl">
				{allPostData.map((postData: PostData) => (<PostPreview
					key={postData.id}
					title={postData.title}
					postDate={new Date(postData.postDateString)}
					intro={postData.intro}
				/>))}
			</div>

		</div>
	)
}

export default Home
