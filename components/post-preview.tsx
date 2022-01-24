import { formatISO } from 'date-fns';

export default function PostPreview( {
	title,
	postDate,
	intro,
} : {
	title: string,
	postDate: Date,
	intro: string,
}) {
	return (
		<div className="flex flex-row space-x-6 w-full px-2">
			<div className="text-neutral-400 text-base whitespace-nowrap">
				{formatISO(postDate, {
					representation: "date",
				})}
			</div>
			<div className="flex flex-col space-y-1">
				<div className="text-xl font-bold font-serif">
					{title}
				</div>
				<div className="text-neutral-500 text-lg">
					{intro}
				</div>
			</div>
		</div>
	)
}
