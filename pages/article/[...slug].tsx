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
      <div className="flex flex-col justify-center py-24 items-center w-full">
        <div>
          <div className="flex flex-row items-center mb-8">
            <img
              className="rounded-full mr-6"
              src={article[article.length - 1].profile}
              width={128}
              height={128}
              alt="user-profile"
            />
            <div className="text-2xl font-bold">{slugs[0]}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-sky-700">
              {slugs[0]}이 작성한 글들을 확인하세요.
            </div>
            <hr className="border-b-2 my-4 border-sky-700 w-full" />
          </div>
          {article.map((post) => (
            <div className="my-16" key={post._id}>
              <Link href={`/article/@${post.writer}/${post._id}/${post.slug}`}>
                <img
                  alt="sample"
                  className="rounded-md inline-block"
                  src="/sample.gif"
                />
                <h1 className="text-2xl font-bold my-1 truncate">
                  {post.title}
                </h1>
                <p className="text-base mb-4 line_clamp h-12 whitespace-pre-wrap">
                  {post.content}
                </p>
              </Link>
              <div>
                {post.hashtag.map((item) => {
                  return (
                    <a
                      key={item}
                      href={`/hashtag/${item}`}
                      className="text-sky-500 px-1 mx-2 my-4 cursor-pointer inline-block text-base"
                    >
                      {item}
                    </a>
                  );
                })}
              </div>
              <div className="flex flex-row truncate text-sm text-gray-400">
                <div className="">{post.createdAt}</div>
                <span className="px-2">·</span>
                <div>❤ {post.liked}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (slugs.length >= 2 && article.length > 0) {
    return (
      <div className="w-full">
        {article.map((post) => (
          <div className="my-16 mx-12 2xl:mx-80 3xl:mx-96" key={post._id}>
            <h1 className="text-4xl lg:text-5xl font-bold whitespace-pre-wrap">
              {post.title}
            </h1>
            <div className="flex flex-row justify-between mt-12">
              <div className="flex flex-row items-center">
                <span className="font-bold ml-2">{post.writer}</span>
                <span className="mx-2">·</span>
                <span className="text-gray-500">{post.createdAt}</span>
              </div>
              <span>❤ {post.liked}</span>
            </div>
            <div>
              {post.hashtag.map((item) => {
                return (
                  <a
                    key={item}
                    href={`/hashtag/${item}`}
                    className="text-sky-500 px-1 mx-2 my-4 cursor-pointer inline-block text-base"
                  >
                    {item}
                  </a>
                );
              })}
            </div>
            <p className="whitespace-pre-wrap mt-16 min-h-[328px]">
              {post.content}
            </p>
            <div className="flex flex-row items-center my-16">
              <img
                className="rounded-full mr-4"
                src={post.profile}
                width={128}
                height={127}
                alt="user-profile"
              />
              <div className="text-xl font-bold">{slugs[0]}</div>
            </div>
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
