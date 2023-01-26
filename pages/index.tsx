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
    <div className="flex flex-wrap pt-16 text-center">
      {data.map((article) => (
        <div className="px-4 py-2 cursor-pointer w-1/2 lg:w-1/4">
          <Image
            className="rounded-md inline-block"
            src="/sample.gif"
            height={200}
            width={300}
          />
          <div className="">
            <h1 className="text-base font-bold">{article.title}</h1>
            <p className="text-sm mb-6 truncate">{article.description}</p>
            <div className="text-sm text-gray-500">
              <span className="mx-1">{article.createdAt}</span>
              <span>{article.hashTag}</span>
            </div>
            <div className="flex justify-between">
              <div>
                <span className="mx-1">{article.profile}</span>
                <span>by {article.writer}</span>
              </div>
              <span>❣ {article.liked}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
