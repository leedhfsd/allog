import { useRouter } from "next/router";
import Link from "next/link";

export default function Article() {
  const router = useRouter();
  const prop = router.query;
  let hashtag;
  if (typeof prop.hashtag === "string") {
    hashtag = [];
    hashtag.push(prop.hashtag);
  } else if (typeof prop.hashtag === "object") {
    hashtag = prop.hashtag;
  }
  return (
    <div>
      <article className="flex flex-col items-center justify-center my-16">
        <h1 className="text-6xl font-bold my-8">{prop.title}</h1>
        <div>
          {typeof prop.writer === "string" && (
            <Link href={`article/${prop.writer}`}>
              <span className="font-bold">{prop.writer}</span>
            </Link>
          )}
          <span>|</span>
          <span className="text-gray-700">{prop.createdAt}</span>
        </div>
        <div>
          {hashtag &&
            hashtag.map((item) => {
              return (
                <Link
                  href={`/tags/${item}`}
                  className="text-sky-500 px-1 mx-2 my-2 cursor-pointer inline-block"
                >
                  {item}
                </Link>
              );
            })}
        </div>
        <pre>{prop.content}</pre>
      </article>
    </div>
  );
}
