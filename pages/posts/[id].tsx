import { useRouter } from 'next/router';

export const Post = () => {
	const router = useRouter()
	const { id } = router.query

	return <p>Post: {id}</p>
}
