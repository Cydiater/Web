import type { PostData } from '../lib/posts';
import Link from 'next/link';
import Script from 'next/script';
import { FunctionComponent } from 'react';

export const PostLayout: FunctionComponent<PostData> = (postData) => {
	return (
		<div className="flex flex-col items-center mb-5">
			<div className="flex flex-col max-w-3xl w-full px-3 pt-3">
				<div className="flex flex-row text-sm text-neutral-400 pb-2">
					<Link href='/'>
						Back
					</Link>
					<div className="grow"/>
					<div>
						{postData.postDateString}
					</div>
				</div>
				<div className="text-3xl font-bold font-serif"> 
					{postData.title} 
				</div>
				<div className="pb-5 pt-2">
					{postData.intro}
				</div>
				<div 
					className="prose leading-normal max-w-3xl"
					dangerouslySetInnerHTML={{ __html: postData.content }} 
				/>
				<Script id='scale-svg'>
					{`
						let svgs = document.querySelectorAll('svg'); 
						svgs.forEach(svg => {
							svg.style.maxWidth = '100%'; 
							svg.style.margin = 'auto';
							svg.style.height = 'fit-content';
						});
					`}
				</Script>
			</div>
		</div>
	)
}
