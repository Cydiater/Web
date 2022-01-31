import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import jinghuiAvatar from '../public/jinghui.jpg';
import Image from 'next/image';
import { PostPreview } from '../components/post-preview';
import { getSortedPostData } from '../lib/posts';
import type { PostData } from '../lib/posts';
import { FaTwitter, FaGithub, FaAt, FaTelegram } from 'react-icons/fa';
import Link from 'next/link';

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

			<div className="flex flex-col items-center space-y-2 pt-5 px-5 w-full max-w-lg">

				<div className="flex flex-row space-x-5 items-center w-full max-w-md">

					<Image
						src={jinghuiAvatar}
						alt="my selfish"
						width={96}
						height={96}
						className="rounded-full"
					>
					</Image>

					<h1 className="text-3xl font-bold text-center text-stone-700 grow">
						Hi 👋 <br />
						I&#39;m Cydiater
					</h1>

				</div>

				<div className="flex flex-row text-3xl text-stone-500 justify-between self-stretch">
					<Link href="https://twitter.com/Cydiater" passHref>
						<a><FaTwitter /></a>
					</Link>
					<Link href="https://github.com/Cydiater" passHref>
						<a><FaGithub /></a>
					</Link>
					<Link href="https://t.me/Cydiater" passHref>
						<a><FaTelegram /></a>
					</Link>
					<Link href="mailto:cydiater@gmail.com" passHref>
						<a><FaAt /></a>
					</Link>
				</div>

			</div>

			<div className="flex flex-col items-left space-y-3 pt-5 w-full max-w-3xl">
				{allPostData.map((postData: PostData) => (<PostPreview
					key={postData.id}
					id={postData.id}
					title={postData.title}
					postDate={new Date(postData.postDateString)}
					intro={postData.intro}
					imagePath={postData.imagePath}
				/>))}
			</div>

		</div>
	)
}

export default Home
