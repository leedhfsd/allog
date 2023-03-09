import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "../../interfaces";

function Hashtag({
  query,
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [article, setArticle] = useState<Article[]>([]);
  const [hashtag, setHashtag] = useState("");
  useEffect(() => {
    setHashtag(query as string);
    setArticle(data as Article[]);
  }, [data, query]);

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>{`#${hashtag} | Allog`}</title>
        <meta
          name="description"
          content="Allog에서 작성된 글을 해시태그를 이용하여 검색하는 페이지입니다."
        />
        <meta
          name="keywords"
          content="BLOG, 블로그, Allog, 해시태그, Hashtag"
        />
      </Head>
      {article && (
        <section className="">
          <h1 className="font-bold text-6xl my-12"># {hashtag}</h1>
          <div className="text-gray-600">
            총<span className="font-bold mx-1">{article.length}개</span>의
            작성글을 찾았습니다.
          </div>
          {article.map((post) => (
            <div className="my-8 md:w-[768px]" key={post._id}>
              <div className="flex flex-row items-center mb-8">
                <Link href={`/article/@${post.writer}`}>
                  <img
                    className="rounded-full bg-white h-12 w-12 bg-cover mr-1 inline"
                    alt="profile"
                    src={post.profile}
                  />
                  <span className="mx-2 text-sm font-bold">{post.writer}</span>
                </Link>
              </div>
              <Link href={`/article/@${post.writer}/${post._id}/${post.slug}`}>
                <img
                  alt="sample"
                  className="rounded-md inline-block w-full"
                  src="/sample.gif"
                />
                <h1 className="text-2xl font-bold my-4 truncate">
                  {post.title}
                </h1>
                <p className="text-base mb-8 line_clamp whitespace-pre-wrap">
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
        </section>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  let articleData: Response | undefined;
  if (slug && slug.length === 1) {
    articleData = await fetch(
      `${process.env.BASE_URL}/api/article?hashtag=${slug[0]}`,
    );
  }
  const article = (await articleData?.json()) as Article[];
  if (slug && slug.length === 1 && articleData?.status === 200) {
    return {
      props: {
        query: slug[0],
        data: article,
      },
    };
  }
  return {
    notFound: true,
  };
};

export default Hashtag;
