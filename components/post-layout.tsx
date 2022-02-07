import type { PostData } from "../lib/posts";
import Link from "next/link";
import Head from "next/head";
import { FunctionComponent } from "react";

export const PostLayout: FunctionComponent<PostData> = (postData) => {
  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div className="mb-5 flex flex-col items-center">
        <div className="flex w-full max-w-3xl flex-col px-3 pt-3">
          <div className="flex flex-row pb-2 text-sm text-neutral-400">
            <Link href="/">Back</Link>
            <div className="grow" />
            <div>{postData.postDateString}</div>
          </div>
          <div className="font-serif text-3xl font-bold">{postData.title}</div>
          <div className="pb-5 pt-2">{postData.intro}</div>
          <div
            className="scaleSvg prose max-w-3xl leading-normal"
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        </div>
      </div>
    </>
  );
};
