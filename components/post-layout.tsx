import type { PostData } from '../lib/posts';
import { FunctionComponent } from 'react';

export const PostLayout: FunctionComponent<PostData> = (postData) => {
	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col max-w-2xl w-full px-3 pt-3">
				<div className="text-2xl font-bold font-serif"> 
					{postData.title} 
				</div>
				<div 
					className="prose leading-normal"
					dangerouslySetInnerHTML={{ __html: postData.content }} 
				/>
			</div>
		</div>
	)
}
