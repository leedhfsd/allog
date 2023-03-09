import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "prismjs/themes/prism.css";
import "github-markdown-css";
import { Article, User } from "../../interfaces";

function Post({
  data,
  slug,
  userdata,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [article, setArticle] = useState<Article[]>([]);
  const [user, setUser] = useState<User>();
  const [isDelete, setisDelete] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const slugs = slug as string[];
  const redirect = async () => {
    await router.push("/");
  };

  useEffect(() => {
    setUser(userdata as User);
    setArticle(data as Article[]);
  }, [data, slug, userdata]);

  useEffect(() => {
    if (
      slugs &&
      slugs.length > 1 &&
      article.length === 1 &&
      article[0].sanitizedHtml
    ) {
      const markdownDiv = document.getElementById("markdown") as HTMLDivElement;
      markdownDiv.innerHTML = article[0].sanitizedHtml;
    }
  }, [slugs, article]);
  const handleDeleteArticle = async () => {
    await fetch(
      `/api/article?writer=${article[0].writer}&id=${article[0]._id}`,
      {
        method: "DELETE",
      },
    ).then(() => redirect());
  };

  if (slugs.length === 1 && article.length > 0) {
    return (
      <div className="flex flex-col py-12 items-center w-full">
        <Head>
          <title>{`@${article[0].writer} | Allog`}</title>
          <meta
            name="description"
            content="Allog 회원님들의 작성 글, 별명, 한 줄 메시지를 확인할 수 있는 페이지입니다."
          />
          <meta name="keywords" content="BLOG, 블로그, Allog" />
        </Head>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center mb-8">
            <img
              className="rounded-full mr-6"
              src={article[article.length - 1].profile}
              width={128}
              height={128}
              alt="user-profile"
            />
            <div>
              {user && user.nickname !== "" ? (
                <div className="text-2xl font-bold">{user?.nickname}</div>
              ) : (
                <div className="text-2xl font-bold">{user?.name}</div>
              )}
              <div className="mt-1">{user?.userinfo}</div>
            </div>
          </div>
          <div>
            {user && user.nickname !== "" ? (
              <div className="text-xl font-bold text-sky-700">
                {user?.nickname}님이 작성한 글들을 확인해보세요.
              </div>
            ) : (
              <div className="text-xl font-bold text-sky-700">
                {user?.name}님이 작성한 글들을 확인해보세요.
              </div>
            )}

            <hr className="border-b-2 my-4 border-sky-700 w-full" />
          </div>
          {session?.user?.name === user?.name &&
            article
              .filter((post) => post.disclosureStatus)
              .map((post) => (
                <div className="my-8 md:w-[768px]" key={post._id}>
                  <Link
                    href={`/article/@${post.writer}/${post._id}/${post.slug}`}
                  >
                    <img
                      alt="sample"
                      className="rounded-md inline-block w-full"
                      src="/sample.gif"
                    />
                    <h1 className="text-2xl font-bold my-4 truncate">
                      {post.title}
                    </h1>
                    <p className="text-base mb-8 line_clamp whitespace-pre-wrap min-h-[16px]">
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
                    <span className="px-2">·</span>
                    <div className="bg-[#333333] text-white pl-2 pr-4 rounded">
                      🗝 비공개
                    </div>
                  </div>
                </div>
              ))}
          {article
            .filter((post) => !post.disclosureStatus)
            .map((post) => (
              <div className="my-8 md:w-[768px]" key={post._id}>
                <Link
                  href={`/article/@${post.writer}/${post._id}/${post.slug}`}
                >
                  <img
                    alt="sample"
                    className="rounded-md inline-block w-full"
                    src="/sample.gif"
                  />
                  <h1 className="text-2xl font-bold my-4 truncate">
                    {post.title}
                  </h1>
                  <p className="text-base mb-8 line_clamp whitespace-pre-wrap min-h-[16px]">
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

  if (slugs.length >= 2 && article.length === 1) {
    return (
      <div className="w-full">
        {article.map((post) => (
          <div className="my-16 mx-12 2xl:mx-80 3xl:mx-96" key={post._id}>
            <Head>
              <title>{post.title}</title>
              <meta
                name="description"
                content="Allog 회원님들의 작성 글을 확인하는 페이지입니다."
              />
              <meta name="keywords" content="BLOG, 블로그, Allog" />
            </Head>
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
                {session &&
                  session.user &&
                  session.user.name === slugs[0].substring(1) && (
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
                <div className="flex flex-col">
                  {user?.nickname !== "" ? (
                    <div className="text-xl font-bold">{user?.nickname}</div>
                  ) : (
                    <div className="text-xl font-bold">{user?.name}</div>
                  )}
                  <div className="mt-1">{user?.userinfo}</div>
                </div>
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
  return (
    <div>
      <div className="flex flex-col py-12 items-center min-h-[748px]">
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center mb-8">
            <img
              className="rounded-full mr-6"
              src={user?.image}
              width={128}
              height={128}
              alt="user-profile"
            />
            <div className="flex flex-col">
              {user?.nickname !== "" ? (
                <div className="text-xl font-bold">{user?.nickname}</div>
              ) : (
                <div className="text-xl font-bold">{user?.name}</div>
              )}
              <div className="mt-1">{user?.userinfo}</div>
            </div>
          </div>
          <div>
            {user?.nickname !== "" ? (
              <div className="text-xl font-bold text-sky-700">
                {user?.nickname}님이 작성한 글이 아직 없네요!
              </div>
            ) : (
              <div className="text-xl font-bold text-sky-700">
                {user?.name}님이 작성한 글이 아직 없네요!
              </div>
            )}
            <hr className="border-b-2 my-4 border-sky-700 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  let writer = "";
  let id = "";
  let articleData: Response | undefined;
  let res: Response | undefined;
  if (slug && slug.length === 1) {
    writer = encodeURIComponent(slug[0].substring(1));
    articleData = await fetch(
      `${process.env.BASE_URL}/api/article?writer=${writer}`,
    );
    res = await fetch(`${process.env.BASE_URL}/api/auth/user?name=${writer}`);
  } else if (slug && slug.length > 1) {
    [writer, id] = [encodeURIComponent(slug[0].substring(1)), slug[1]];
    articleData = await fetch(
      `${process.env.BASE_URL}/api/article?writer=${writer}&id=${id}`,
    );
    res = await fetch(`${process.env.BASE_URL}/api/auth/user?name=${writer}`);
  }
  const userdata = (await res?.json()) as User;
  const article = (await articleData?.json()) as Article[];

  if (article[0] && userdata) {
    return {
      props: {
        data: article,
        slug,
        userdata,
      },
    };
  }

  if (slug && slug.length === 1 && res?.status === 200) {
    return {
      props: {
        data: {},
        slug,
        userdata,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default Post;
