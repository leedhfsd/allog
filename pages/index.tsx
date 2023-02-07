import useSwr from "swr";
import { Article } from "../interfaces";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Home() {
  const { data, error, isLoading } = useSwr<Article[], Error>(
    "api/articles",
    fetcher,
  );

  if (error) return <div>게시글을 불러오는 것을 실패하였습니다.</div>;
  if (isLoading) return <div>로딩중...</div>;
  if (!data) return null;
  return (
    <div className="flex flex-wrap my-12">
      {data.map((article) => (
        <div className="sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 px-4 py-4 cursor-pointer">
          <div className="post-card">
            <img
              alt="sample"
              className="rounded-md inline-block"
              src="/sample.gif"
            />
            <h1 className="text-base font-bold my-1 truncate">
              {article.title}
            </h1>
            <p className="text-sm mb-6 line_clamp h-16">{article.content}</p>
            <div className="text-sm text-gray-500">
              <div className="truncate text-sm">{article.createdAt}</div>
              <div className="truncate text-xs my-1">
                #{article.hashtag.join(" #")}
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <img
                  className="rounded-full bg-white h-8 w-8 bg-cover mr-1 inline"
                  alt="profile"
                  src={article.profile}
                />
                <span className="text-xs font-bold">
                  <span className="text-gray-500 text-xs">by</span>{" "}
                  {article.writer}
                </span>
              </div>
              <span>❣ {article.liked}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
