import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article, User } from "../../interfaces";

function MyPage({
  data,
  userdata,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [article, setArticle] = useState<Article[]>([]);
  const [user, setUser] = useState<User>();
  const { data: session } = useSession();

  useEffect(() => {
    setUser(userdata as User);
    setArticle(data as Article[]);
  }, [data, userdata]);

  if (article.length > 0) {
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
        <div className="flex flex-col mx-8">
          <div className="flex flex-row items-center mb-4">
            <img
              className="rounded-full aspect-square mr-16"
              src={user?.image}
              width={128}
              height={128}
              alt="user-profile"
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                {user && user.nickname !== "" ? (
                  <div className="mr-4">{user?.nickname}</div>
                ) : (
                  <div className="mr-4">{user?.name}</div>
                )}
              </div>
              <div className="text-xs my-4">
                게시물 <span className="font-bold">{article.length}</span>
              </div>
              <div className="mt-1 text-xs">{user?.userinfo}</div>
            </div>
          </div>
          <hr className="my-4 w-full" />
          {session?.user?.name === user?.name &&
            article
              .filter((post) => post.disclosureStatus)
              .map((post) => (
                <div
                  className="my-8 w-[300px] sm:w-[400px] md:w-[768px]"
                  key={post._id}
                >
                  <Link
                    href={`/article/@${post.writer}/${post._id}/${post.slug}`}
                  >
                    {post.thumbnailImage ? (
                      <div className="">
                        <img
                          alt="thumbnail"
                          className="rounded-md inline-block w-full h-[400px] object-center object-cover"
                          src={post.thumbnailImage}
                        />
                      </div>
                    ) : (
                      <div />
                    )}
                    <h1 className="text-2xl font-bold my-4 truncate">
                      {post.title}
                    </h1>
                    <p className="text-base mb-8 line_clamp whitespace-pre-wrap min-h-[16px]">
                      {post.plainText}
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
                    <div>❤ {post.liked.length ? post.liked.length : 0}</div>
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
              <div
                className="my-8 w-[300px] sm:w-[400px] md:w-[768px]"
                key={post._id}
              >
                <Link
                  href={`/article/@${post.writer}/${post._id}/${post.slug}`}
                >
                  {post.thumbnailImage ? (
                    <div className="">
                      <img
                        alt="thumbnail"
                        className="rounded-md inline-block w-full h-full object-center object-cover"
                        src={post.thumbnailImage}
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                  <h1 className="font-bold my-4 truncate">{post.title}</h1>
                  <p className="text-sm mb-8 line_clamp whitespace-pre-wrap min-h-[16px]">
                    {post.plainText}
                  </p>
                </Link>
                <div>
                  {post.hashtag.map((item) => {
                    return (
                      <a
                        key={item}
                        href={`/hashtag/${item}`}
                        className="text-sky-500 my-2 cursor-pointer inline-block text-xs"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
                <div className="flex flex-row truncate text-xs text-gray-400">
                  <div className="">{post.createdAt}</div>
                  <span className="px-2">·</span>
                  <div>❤ {post.liked.length ? post.liked.length : 0}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col my-12 mx-8">
      <div className="flex flex-row items-center mb-4">
        <img
          className="rounded-full aspect-square mr-16"
          src={user?.image}
          width={128}
          height={128}
          alt="user-profile"
        />
        <div className="flex flex-col">
          <div className="flex items-center">
            {user && user.nickname !== "" ? (
              <div className="mr-4">{user?.nickname}</div>
            ) : (
              <div className="mr-4">{user?.name}</div>
            )}
          </div>
          <div className="text-xs my-4">
            게시물 <span className="font-bold">{article.length}</span>
          </div>
          <div className="mt-1 text-xs">{user?.userinfo}</div>
        </div>
      </div>
      <hr className="my-4 w-full" />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  let writer = "";
  let articleData: Response | undefined;
  let res: Response | undefined;
  if (slug && slug.length === 1) {
    writer = encodeURIComponent(slug[0].substring(1));
    articleData = await fetch(
      `${process.env.BASE_URL}/api/article?writer=${writer}&status=true`,
    );
    res = await fetch(`${process.env.BASE_URL}/api/auth/user?name=${writer}`);
  }
  const userdata = (await res?.json()) as User;
  const article = (await articleData?.json()) as Article[];

  if (slug && slug.length === 1 && article.length > 0) {
    return {
      props: {
        data: article,
        userdata,
      },
    };
  }

  if (userdata) {
    return {
      props: {
        data: [],
        userdata,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default MyPage;
