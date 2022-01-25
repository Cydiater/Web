import { formatISO } from 'date-fns';
import { FunctionComponent } from 'react';
import Link from 'next/link';

type PostPreviewProps = {
	id: string,
	title: string,
	postDate: Date,
	intro: string,
};

export const PostPreview: FunctionComponent<PostPreviewProps> = ({
	id,
	title,
	postDate,
	intro,
}) => {
	return (
		<div className="flex flex-row space-x-6 w-full px-2">
			<div className="text-neutral-400 text-base whitespace-nowrap">
				{formatISO(postDate, {
					representation: "date",
				})}
			</div>
			<div className="flex flex-col space-y-1">
				<Link href={`/posts/${id}`} passHref>
					<button className="text-xl font-bold font-serif hover:text-blue-600 text-left transition transition-all ease-in-out">
						<a>{title}</a>
					</button>
				</Link>
				<div className="text-neutral-500 text-lg">
					{intro}
				</div>
			</div>
		</div>
	)
}
