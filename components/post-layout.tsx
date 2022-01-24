import type { PostData } from '../lib/posts';

export default function PostLayout(postData: PostData) {
	return (
		<div>
			<h1> {postData.title} </h1>
			<p> {postData.content} </p>
		</div>
	)
}
