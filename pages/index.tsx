import { useEffect, useState } from "react";
import useSwr from "swr";
import { Article } from "../interfaces";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSwr<Article[]>("api/articles", fetcher);

  if (error) return <div>Failed to load users</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;
  return (
    <div className="flex flex-wrap w-full py-16">
      {data.map((article) => (
        <div className="px-4 py-4 cursor-pointer w-80 sd_b">
          <Image
            className="rounded-md inline-block"
            src="/sample.gif"
            height={200}
            width={350}
          />
          <h1 className="text-base font-bold my-1 truncate">{article.title}</h1>
          <p className="text-sm mb-6 line_clamp h-16">{article.description}</p>
          <div className="text-sm text-gray-500">
            <div className="truncate">{article.createdAt}</div>
            <div className="truncate">#{article.hashTag}</div>
          </div>
          <div className="flex justify-between">
            <div>
              <span>{article.profile}</span>
              <span>by {article.writer}</span>
            </div>
            <span>❣ {article.liked}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
