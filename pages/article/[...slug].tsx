import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "prismjs/themes/prism.css";
import "github-markdown-css";
import { Article } from "../../interfaces";

interface User {
  name: string;
  email: string;
  image: string;
}

function Post({
  data,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [article, setArticle] = useState<Article[]>([]);
  const [user, setUser] = useState("");
  const [isDelete, setisDelete] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const redirect = async () => {
    await router.push("/");
  };

  useEffect(() => {
    if (session && session.user) {
      const curUser = session.user as User;
      setUser(curUser.email.split("@")[0]);
    }
    setArticle(data as Article[]);
  }, [data, slug, session]);

  useEffect(() => {
    const markdownDiv = document.getElementById("markdown") as HTMLDivElement;
    if (article.length === 1 && article[0].sanitizedHtml) {
      markdownDiv.innerHTML = article[0].sanitizedHtml;
    }
  }, [article]);

  const slugs = slug as string[];
  const handleDeleteArticle = async () => {
    await fetch(`/api/article/${article[0].writer}/${article[0]._id}`, {
      method: "DELETE",
    }).then(() => redirect());
  };

  if (slugs.length === 1 && article.length > 0) {
    return (
      <div className="flex flex-col justify-center py-24 items-center w-full">
        <div className="flex flex-col items-center">
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
            <div className="my-16 w-[400px]" key={post._id}>
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
              <div className="flex flex-row">
                {session && user === slugs[0].substring(1) && (
                  <div className="text-gray-400">
                    <a
                      href={`/write?user=${slugs[0].substring(1)}&id=${
                        slugs[1]
                      }`}
                      type="button"
                      className="mx-1"
                    >
                      수정
                    </a>
                    <button
                      type="button"
                      onClick={() => setisDelete((value) => !value)}
                      className="mr-1"
                    >
                      삭제
                    </button>
                  </div>
                )}
                <span>❤ {post.liked}</span>
              </div>
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
            <div className="whitespace-pre-wrap mt-16 min-h-[328px]">
              {article[0].sanitizedHtml ? (
                <div id="markdown" className="markdown-body" />
              ) : (
                <div>{article[0].content}</div>
              )}
            </div>
            <div className="flex flex-row items-center my-16">
              <Link
                href={`/article/${slugs[0]}`}
                className="flex flex-row items-center"
              >
                <img
                  className="rounded-full mr-4"
                  src={post.profile}
                  width={128}
                  height={127}
                  alt="user-profile"
                />
                <div className="text-xl font-bold">{slugs[0]}</div>
              </Link>
            </div>
          </div>
        ))}
        {isDelete && (
          <div>
            <div className="bg-[#f9f9f9] z-40 delete_opacity opacity-95" />
            <div className="delete_post z-50 delete_sd">
              <div className="flex flex-col mx-6">
                <h1 className="font-bold text-2xl mb-3 mt-12">포스트 삭제</h1>
                <p className="mb-16">정말로 삭제하시겠습니까?</p>
                <div className="flex justify-end mt-12">
                  <button
                    onClick={() => setisDelete((value) => !value)}
                    type="button"
                    className="text-sky-600 hover:text-sky-700 px-6 py-1.5 mr-4 rounded-md"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDeleteArticle}
                    type="button"
                    className="text-white bg-sky-600 hover:bg-sky-700 px-6 py-1.5 rounded-md"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
