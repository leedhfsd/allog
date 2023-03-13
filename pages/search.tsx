import Head from "next/head";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { Article } from "../interfaces";

export default function Search() {
  const [article, setArticle] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const onClickSearch = async (e: SyntheticEvent) => {
    setIsClicked(true);
    if (!query.length) return;
    e.preventDefault();
    const res = await fetch(`/api/article?all=${query}`);
    const data = (await res.json()) as Article[];
    setArticle(data);
  };
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>검색 | Allog</title>
        <meta
          name="description"
          content="Allog의 회원님들이 작성한 글을 검색할 수 있는 페이지입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog, 태그검색, 검색" />
      </Head>
      <section className="w-3/4 lg:w-[768px] mb-8">
        <div className="mt-16 flex border border-black h-16">
          <div className="flex w-full text-center">
            <button className="mx-4" type="button" onClick={onClickSearch}>
              <svg width="24" height="36" viewBox="0 0 24 24">
                <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z" />
              </svg>
            </button>
            <input type="hidden" />
            <input
              className="focus:outline-none w-5/6 md:text-xl"
              placeholder="검색어를 입력해주세요"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>
        </div>
      </section>
      <section className="">
        {isClicked && (
          <div className="text-gray-600">
            총
            <span className="font-bold mx-1">
              {article.length ? article.length : 0}개
            </span>
            의 작성글을 찾았습니다.
          </div>
        )}
        {Array.isArray(article) &&
          article.map((post) => (
            <div className="my-8 md:w-[768px]" key={post._id}>
              <div className="flex flex-row items-center mb-8">
                <img
                  className="rounded-full bg-white h-12 w-12 bg-cover mr-1 inline"
                  alt="profile"
                  src={post.profile}
                />
                <span className="mx-2 text-sm font-bold">{post.writer}</span>
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
    </div>
  );
}
