import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import jinghuiAvatar from "../public/jinghui.jpg";
import Image from "next/image";
import { PostPreview } from "../components/post-preview";
import { getSortedPostData } from "../lib/posts";
import type { PostData } from "../lib/posts";
import { FaTwitter, FaGithub, FaAt, FaTelegram } from "react-icons/fa";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  const allPostData = getSortedPostData();
  return {
    props: {
      allPostData,
    },
  };
};

type HomeProps = {
  allPostData: PostData[];
};

const Home: NextPage<HomeProps> = ({ allPostData }) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Cydiater Site</title>
        <meta name="description" content="Personal Site of Cydiater" />
      </Head>

      <div className="flex w-full max-w-lg flex-col items-center space-y-2 px-5 pt-5">
        <div className="flex w-full max-w-md flex-row items-center space-x-5">
          <Image
            src={jinghuiAvatar}
            alt="my selfish"
            width={96}
            height={96}
            className="rounded-full"
          ></Image>

          <h1 className="grow text-center text-3xl font-bold text-stone-700">
            Hi 👋 <br />
            I&#39;m Cydiater
          </h1>
        </div>

        <div className="flex flex-row justify-between self-stretch text-3xl text-stone-500">
          <Link href="https://twitter.com/Cydiater" passHref>
            <a>
              <FaTwitter />
            </a>
          </Link>
          <Link href="https://github.com/Cydiater" passHref>
            <a>
              <FaGithub />
            </a>
          </Link>
          <Link href="https://t.me/Cydiater" passHref>
            <a>
              <FaTelegram />
            </a>
          </Link>
          <Link href="mailto:cydiater@gmail.com" passHref>
            <a>
              <FaAt />
            </a>
          </Link>
        </div>
      </div>

      <div className="items-left flex w-full max-w-3xl flex-col space-y-3 pt-5">
        {allPostData.map((postData: PostData) => (
          <PostPreview
            key={postData.id}
            id={postData.id}
            title={postData.title}
            postDate={new Date(postData.postDateString)}
            intro={postData.intro}
            imagePath={postData.imagePath}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
