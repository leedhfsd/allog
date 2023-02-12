import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "../../interfaces";

function Post({
  data,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [article, setArticle] = useState<Article[]>([]);
  useEffect(() => {
    setArticle(data as Article[]);
  }, [data, slug]);
  const slugs = slug as string[];
  if (slugs.length === 1 && article.length > 0) {
    return (
      <div className="flex flex-col justify-center py-24 items-center">
        <div className="flex flex-row items-center mb-8">
          <img
            className="rounded-full mr-6"
            src={article[article.length - 1].profile}
            width={128}
            height={128}
            alt="user_profile"
          />
          <div className="text-2xl font-bold">{slugs[0]}</div>
        </div>
        <div>
          <p className="text-xl font-bold text-sky-700">
            {slugs[0]}이 작성한 글들을 확인하세요.
          </p>
          <hr className="border-b-2 my-4 border-sky-700 w-full" />
        </div>
        {article.map((post) => (
          <div className="cursor-pointer my-16" key={post._id}>
            <Link href={`/article/@${post.writer}/${post._id}/${post.slug}`}>
              <div className="">
                <img
                  alt="sample"
                  className="rounded-md inline-block"
                  src="/sample.gif"
                />
                <h1 className="text-2xl font-bold my-1 truncate">
                  {post.title}
                </h1>
                <p className="text-base mb-4 line_clamp h-8">{post.content}</p>
                <div>
                  {post.hashtag.map((item) => {
                    return (
                      <a
                        key={item}
                        href={`post/${item}`}
                        className="text-sky-500 px-1 mx-2 my-4 cursor-pointer inline-block text-base"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
                <div className="truncate text-sm text-gray-400">
                  {post.createdAt}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  let writer = "";
  let id = "";
  let res: Response | undefined;
  if (slug && slug[0]) {
    writer = slug[0].substring(1);
    res = await fetch(`${process.env.BASE_URL}/api/article/${writer}`);
  }
  if (slug && slug[1]) {
    [writer, id] = [slug[0].substring(1), slug[1]];
    res = await fetch(`${process.env.BASE_URL}/api/article/${writer}/${id}`);
  }
  if (res && res.status !== 200) {
    return {
      notFound: true,
    };
  }
  if (res && res.status === 200) {
    const data = (await res.json()) as Article[];
    return {
      props: {
        data,
        slug,
      },
    };
  }
  return {
    props: {},
  };
};

export default Post;
