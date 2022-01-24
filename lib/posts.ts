import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostData = {
	id: string,
	title: string,
	intro: string,
	content: string,
	postDateString: string,
};

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostData(): PostData[] {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory)
	const allPostData: PostData[] = fileNames.map(fileName => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '');

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, 'utf8');

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			title: matterResult.data.title,
			intro: matterResult.data.intro,
			content: matterResult.content,
			postDateString: matterResult.data.postDate,
		} as PostData;
	});
	// Sort posts by date
	return allPostData.sort(({ postDateString: a }, { postDateString: b }) => {
		const dateA = new Date(a);
		const dateB = new Date(b);
		if (dateA < dateB) {
			return 1
		} else if (dateA > dateB) {
			return -1
		} else {
			return 0
		}
	});
}

