import { formatISO } from 'date-fns';
import { FunctionComponent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type PostPreviewProps = {
	id: string,
	title: string,
	postDate: Date,
	intro: string,
	imagePath: string,
};

export const PostPreview: FunctionComponent<PostPreviewProps> = ({
	id,
	title,
	postDate,
	intro,
	imagePath,
}) => {
	return (
		<div className="flex sm:flex-row flex-col w-full px-2">
			<div className="text-neutral-400 text-base whitespace-nowrap mr-5">
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
				<div className="w-full h-60 relative">
					<Image 
						src={imagePath}
						layout="fill"
						objectFit="contain"
						alt="main image of the post"
					/>
				</div>
				<div className="text-neutral-500 text-md">
					{intro}
				</div>
			</div>
		</div>
	)
}
