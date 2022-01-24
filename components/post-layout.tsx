import type { PostData } from '../lib/posts';
import { FunctionComponent } from 'react';

export const PostLayout: FunctionComponent<PostData> = (postData) => {
	return (
		<div>
			<h1> {postData.title} </h1>
			<p> {postData.content} </p>
		</div>
	)
}
