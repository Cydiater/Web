import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostIds, getPostData, PostData } from '../../lib/posts'
import { ParsedUrlQuery } from 'querystring';
import { PostLayout } from '../../components/post-layout';

type Props = {
	postData: PostData
};

interface Params extends ParsedUrlQuery {
	id: string,
}

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = getAllPostIds()
	return {
		paths,
		fallback: false
	}
}


export const getStaticProps: GetStaticProps<Props, Params> = async (ctx) => {
	const params = ctx.params!;
	const postData = await getPostData(params.id)
	return {
		props: {
			postData
		}
	};
}

const PostView: NextPage<Props> = ({ postData }) => {
	return (
		<PostLayout {...postData} />
	);
}

export default PostView;
