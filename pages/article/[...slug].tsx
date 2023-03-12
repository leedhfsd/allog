import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "prismjs/themes/prism.css";
import "github-markdown-css";
import { Article, User, Comment } from "../../interfaces";

function Post({
  data,
  slug,
  userdata,
  commentData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [article, setArticle] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User>();
  const [isChange, setIsChange] = useState<boolean[]>([]);
  const [isDelete, setisDelete] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const slugs = slug as string[];
  const redirect = async () => {
    await router.push("/");
  };
  const onChangeComment = (e: SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    if (commentRef.current !== null) {
      commentRef.current.style.height = "30px";
      commentRef.current.style.height = `${target.scrollHeight}px`;
    }
    setComment(target.value);
  };
  const onClickWriteComment = async () => {
    if (comment === "") return;
    const curDate = new Date();
    const utc = curDate.getTime() + curDate.getTimezoneOffset() * 60 * 1000;
    const kst = new Date(utc + 9 * 60 * 60 * 1000);
    const postData = {
      articleId: slugs[1],
      writer: session?.user?.name,
      email: session?.user?.email,
      createdAt: `${kst.getFullYear()}년 ${
        kst.getMonth() + 1
      }월 ${kst.getDate()}일`,
      profile: session?.user?.image,
      content: comment,
    };
    await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then(async () => {
      if (commentRef.current) {
        setComment("");
        commentRef.current.value = "";
      }
      const res = await fetch(`/api/comment?id=${slugs[1]}`);
      const fetchComment = (await res.json()) as Comment[];
      setComments(fetchComment);
      setIsChange([...isChange, false]);
    });
  };
  const onClickDeleteComment = async (id: string, idx: number) => {
    if (session && session.user)
      await fetch(`/api/comment?id=${id}&writer=${session?.user.name}`, {
        method: "DELETE",
      }).then(async () => {
        const res = await fetch(`/api/comment?id=${slugs[1]}`);
        const fetchComment = (await res.json()) as Comment[];
        setComments(fetchComment);
        setIsChange((prev) => {
          return prev.filter((item, index) => index !== idx);
        });
      });
  };
  const onChangeIsChangeStatus = (idx: number) => {
    setIsChange((prev) => {
      return prev.map((item, index) => {
        if (index === idx) {
          setComment(comments[idx].content);
          return !prev[idx];
        }
        return false;
      });
    });
  };

  const onClickChangeComment = async (id: string) => {
    if (comment === "") return;
    const curDate = new Date();
    const utc = curDate.getTime() + curDate.getTimezoneOffset() * 60 * 1000;
    const kst = new Date(utc + 9 * 60 * 60 * 1000);
    const patchData = {
      writer: session?.user?.name,
      email: session?.user?.email,
      createdAt: `${kst.getFullYear()}년 ${
        kst.getMonth() + 1
      }월 ${kst.getDate()}일`,
      profile: session?.user?.image,
      content: comment,
    };
    await fetch(`/api/comment?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchData),
    }).then(async () => {
      if (commentRef.current) {
        commentRef.current.value = "";
        setComment("");
      }
      const commentTextareaElement = document.getElementById(
        "commentTextarea",
      ) as HTMLTextAreaElement;
      commentTextareaElement.value = "";
      const res = await fetch(`/api/comment?id=${slugs[1]}`);
      const fetchComment = (await res.json()) as Comment[];
      setComments(fetchComment);
      const booleanArr = new Array(fetchComment.length).fill(false);
      setIsChange(booleanArr);
    });
  };

  useEffect(() => {
    setUser(userdata as User);
    setArticle(data as Article[]);
    setComments(commentData as Comment[]);
    if (Array.isArray(commentData)) {
      const booleanArr = new Array(commentData.length).fill(false);
      setIsChange(booleanArr);
    }
  }, [data, slug, userdata, commentData]);

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
        {session && (
          <div className="mx-12 my-16 2xl:mx-80 3xl:mx-96">
            <textarea
              id="commentTextarea"
              rows={1}
              className="focus:outline-none resize-none w-full truncate"
              placeholder="댓글을 남겨주세요."
              ref={commentRef}
              onChange={onChangeComment}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="text-white px-4 py-1 mt-8 bg-sky-500 rounded"
                onClick={onClickWriteComment}
              >
                댓글 작성
              </button>
            </div>
          </div>
        )}
        <div className="mx-12 my-16 2xl:mx-80 3xl:mx-96">
          <div className="my-12 text-xl text-gray-600">
            <span className="font-bold text-black">
              {comments.length ? comments.length : 0}
            </span>
            개의 댓글
          </div>
          {comments.length > 0 &&
            comments.map((item, idx) => (
              <div key={item._id.toString()}>
                <div className="flex justify-between">
                  <div className="flex my-8">
                    <Link href={`/article/@${item.writer}`}>
                      <img
                        src={item.profile}
                        alt="profile"
                        height={48}
                        width={48}
                        className="rounded-full"
                      />
                    </Link>
                    <div className="flex flex-col mx-4">
                      <Link href={`/article/@${item.writer}`}>
                        <div className="font-bold">{item.writer}</div>
                      </Link>
                      <div className="text-gray-500 text-sm">
                        {item.createdAt}
                      </div>
                    </div>
                  </div>
                  {item.writer === session?.user?.name && (
                    <div className="flex">
                      <button
                        type="button"
                        className="text-gray-500 text-sm mx-1"
                        onClick={() => onChangeIsChangeStatus(idx)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 text-sm"
                        onClick={() =>
                          onClickDeleteComment(item._id.toString(), idx)
                        }
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                {!isChange[idx] ? (
                  <div
                    id={item._id.toString()}
                    className="whitespace-pre-wrap mb-12"
                  >
                    {item.content}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={1}
                      className="focus:outline-none resize-none w-full truncate"
                      placeholder="댓글을 남겨주세요."
                      ref={commentRef}
                      onChange={onChangeComment}
                      value={comment}
                    />
                    <div className="flex justify-end">
                      <div>
                        <button
                          className="text-sky-500 px-4 py-1"
                          type="button"
                          onClick={() => onChangeIsChangeStatus(idx)}
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          className="text-white px-4 py-1 mt-8 bg-sky-500 rounded"
                          onClick={() =>
                            onClickChangeComment(item._id.toString())
                          }
                        >
                          댓글 수정
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
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
  let commentData: Response | undefined;
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
    commentData = await fetch(`${process.env.BASE_URL}/api/comment?id=${id}`);
    res = await fetch(`${process.env.BASE_URL}/api/auth/user?name=${writer}`);
  }
  const userdata = (await res?.json()) as User;
  const article = (await articleData?.json()) as Article[];

  if (slug && slug.length > 1) {
    const comment = (await commentData?.json()) as Comment[];
    return {
      props: {
        data: article,
        slug,
        userdata,
        commentData: comment,
      },
    };
  }

  if (article[0] && userdata) {
    return {
      props: {
        data: article,
        slug,
        userdata,
        commentData: {},
      },
    };
  }

  if (slug && slug.length === 1 && res?.status === 200) {
    return {
      props: {
        data: {},
        slug,
        userdata,
        commentData: {},
      },
    };
  }

  return {
    notFound: true,
  };
};

export default Post;
