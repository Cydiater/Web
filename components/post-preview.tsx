import { formatISO } from "date-fns";
import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";

type PostPreviewProps = {
  id: string;
  title: string;
  postDate: Date;
  intro: string;
  imagePath: string;
};

export const PostPreview: FunctionComponent<PostPreviewProps> = ({
  id,
  title,
  postDate,
  intro,
  imagePath,
}) => {
  return (
    <div className="flex w-full flex-col px-2 sm:flex-row">
      <div className="mr-5 whitespace-nowrap text-base text-neutral-400">
        {formatISO(postDate, {
          representation: "date",
        })}
      </div>
      <div className="flex flex-col space-y-1">
        <Link href={`/posts/${id}`} passHref>
          <button className="text-left font-serif text-xl font-bold transition transition-all ease-in-out hover:text-blue-600">
            <a>{title}</a>
          </button>
        </Link>
        <div className="relative h-60 w-full">
          <Image
            src={imagePath}
            layout="fill"
            objectFit="contain"
            alt="main image of the post"
          />
        </div>
        <div className="text-md text-neutral-500">{intro}</div>
      </div>
    </div>
  );
};
