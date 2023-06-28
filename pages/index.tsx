import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "../interfaces";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Home() {
  const { data, error, isLoading } = useSwr<Article[], Error>(
    "api/posts",
    fetcher,
  );
  if (error) return <div>게시글을 불러오는 것을 실패하였습니다.</div>;
  if (isLoading) return <div />;
  if (!data) return <div />;
  return (
    <div className="flex flex-wrap my-12 min-h-[728px] justify-center sm:justify-start">
      <Head>
        <title>Allog</title>
        <meta
          name="description"
          content="블로그 기능을 제공하는 Allog의 메인 페이지 입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog" />
      </Head>
      {data.map((article) => (
        <div
          className="w-[400px] sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 px-4 py-4 cursor-pointer"
          key={article._id}
        >
          {article.thumbnailImage ? (
            <div className="post-card">
              <Link
                as={`/article/@${article.writer}/${article._id}/${article.slug}`}
                href={{
                  pathname: `/article/@${article.writer}/${article._id}/${article.slug}`,
                  query: {
                    ...article,
                  },
                }}
              >
                <img
                  alt="thumb"
                  className="rounded-md inline-block w-full sm:h-[180px] object-center object-cover"
                  src={article.thumbnailImage}
                />
                <h1 className="text-base font-bold my-1 break-all sm:truncate">
                  {article.title}
                </h1>
                <p className="text-sm mb-6 line_clamp h-16 break-all sm:whitespace-pre-wrap">
                  {article.plainText}
                </p>
                <div className="truncate text-sm text-gray-500">
                  {article.createdAt}
                </div>
                <hr className="my-1 h-1 border-1" />
                <div className="flex justify-between text-xs items-center">
                  <div>
                    <img
                      className="rounded-full bg-white h-8 w-8 bg-cover mr-1 inline"
                      alt="profile"
                      src={article.profile}
                    />
                    <span className="font-bold">
                      <span className="text-gray-500">by</span> {article.writer}
                    </span>
                  </div>
                  <span>
                    ❤ {article.liked.length ? article.liked.length : 0}
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="post-card">
              <Link
                as={`/article/@${article.writer}/${article._id}/${article.slug}`}
                href={{
                  pathname: `/article/@${article.writer}/${article._id}/${article.slug}`,
                  query: {
                    ...article,
                  },
                }}
              >
                <h1 className="text-xl break-all sm:truncate font-bold mb-12">
                  {article.title}
                </h1>
                <p className="text-sm mb-6 line_clamp h-16 break-all sm:whitespace-pre-wrap">
                  {article.content}
                </p>
                <div className="w-[300px] h-[140px]" />
                <div className="truncate text-sm text-gray-500">
                  {article.createdAt}
                </div>
                <hr className="my-1 h-1 border-1" />
                <div className="flex justify-between text-xs items-center">
                  <div>
                    <img
                      className="rounded-full bg-white h-8 w-8 bg-cover mr-1 inline"
                      alt="profile"
                      src={article.profile}
                    />
                    <span className="font-bold">
                      <span className="text-gray-500">by</span> {article.writer}
                    </span>
                  </div>
                  <span>
                    ❤ {article.liked.length ? article.liked.length : 0}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
