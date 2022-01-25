import type { PostData } from '../lib/posts';
import Link from 'next/link';
import { FunctionComponent } from 'react';

export const PostLayout: FunctionComponent<PostData> = (postData) => {
	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col max-w-2xl w-full px-3 pt-3">
				<div className="flex flex-row text-sm text-neutral-400 pb-2">
					<Link href='/'>
						Back
					</Link>
					<div className="grow"/>
					<div>
						{postData.postDateString}
					</div>
				</div>
				<div className="text-2xl font-bold font-serif"> 
					{postData.title} 
				</div>
				<div className="text-neutral-500 pb-5">
					{postData.intro}
				</div>
				<div 
					className="prose leading-normal"
					dangerouslySetInnerHTML={{ __html: postData.content }} 
				/>
			</div>
		</div>
	)
}
