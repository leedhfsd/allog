import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import "prismjs/themes/prism.css";
import "github-markdown-css";
import { Article, User, Comment, Like } from "../../interfaces";

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
  const [likedPost, setLikedPost] = useState<string[]>([]);
  const [likedUser, setLikedUser] = useState<string[]>([]);
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
      author: slugs[0].substring(1),
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
  const onClickAddLikedPost = async () => {
    if (typeof user !== "undefined" && session?.user) {
      if (likedPost.indexOf(session?.user.name) === -1) {
        setLikedPost([...likedPost, session?.user.name]);
      }
      await fetch(
        `/api/liked?name=${session?.user.name}&id=${article[0]._id}&status=posts`,
        {
          method: "POST",
        },
      );
    }
  };
  const onClickRemoveLikedPost = async () => {
    if (typeof user !== "undefined" && session?.user) {
      const tmp = session?.user.name;
      if (likedPost.indexOf(session?.user.name) !== -1) {
        setLikedPost(likedPost.filter((item) => item !== tmp));
      }
      await fetch(
        `/api/liked?name=${session?.user.name}&id=${article[0]._id}&status=posts`,
        {
          method: "DELETE",
        },
      );
    }
  };
  const onClickAddLikedUser = async () => {
    if (typeof user !== "undefined" && session?.user) {
      if (likedUser.indexOf(session?.user.name) === -1) {
        setLikedUser([...likedUser, session?.user.name]);
      }
      await fetch(
        `/api/liked?name=${session?.user.name}&user=${user.name}&status=users`,
        {
          method: "POST",
        },
      );
    }
  };

  const onClickRemoveLikedUser = async () => {
    if (typeof user !== "undefined" && session?.user) {
      const tmp = session?.user.name;
      if (likedUser.indexOf(session?.user.name) !== -1) {
        setLikedUser(likedUser.filter((item) => item !== tmp));
      }
      await fetch(
        `/api/liked?name=${session?.user.name}&user=${user.name}&status=users`,
        {
          method: "DELETE",
        },
      );
    }
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
    if (article.length > 0) {
      setLikedPost(article[0].liked);
    }
    if (Array.isArray(commentData)) {
      const booleanArr = new Array(commentData.length).fill(false);
      setIsChange(booleanArr);
    }
  }, [data, userdata, commentData, article]);

  useEffect(() => {
    async function fetchLikes(name: string) {
      const res = await fetch(`/api/liked?name=${name}`);
      const likesData = (await res.json()) as Like[];
      if (
        Array.isArray(likesData) &&
        typeof likesData[0].likesMe !== "undefined"
      ) {
        setLikedUser([...likesData[0].likesMe]);
      }
    }
    fetchLikes(slugs[0].substring(1)).catch(() => {
      throw new Error();
    });
  }, [slugs]);

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
  const handleDeleteArticleComment = async () => {
    await fetch(
      `/api/comment?author=${article[0].writer}&id=${article[0]._id}`,
      {
        method: "DELETE",
      },
    );
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
        <div className="flex flex-col">
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
                <span>
                  {session?.user &&
                  likedUser.indexOf(session.user.name) === -1 ? (
                    <div className="flex font-bold bg-[#0095F6] rounded-md text-white px-4 py-0.5">
                      <button type="button" onClick={onClickAddLikedUser}>
                        <span className="text-xs">팔로우</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex font-bold bg-[#0095F6] rounded-md text-white px-4 py-0.5">
                      <button type="button" onClick={onClickRemoveLikedUser}>
                        <span className="text-xs">팔로우 취소</span>
                      </button>
                    </div>
                  )}
                </span>
              </div>
              <div className="text-xs my-4">
                게시물 <span className="font-bold">{article.length}</span>
              </div>
              <div className="mt-1 text-sm">{user?.userinfo}</div>
            </div>
          </div>
          <hr className="my-4 w-full" />
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
                        className="rounded-md inline-block w-full h-[400px] object-center object-cover"
                        src={post.thumbnailImage}
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                  <h1 className="text-xl font-bold my-4 truncate">
                    {post.title}
                  </h1>
                  <p className="mb-8 line_clamp whitespace-pre-wrap min-h-[16px]">
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
                <div className="flex flex-row truncate text-sm text-gray-400">
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

  if (slugs.length >= 2 && article.length === 1) {
    return (
      <div className="w-full">
        {article.map((post) => (
          <div
            className="my-16 mx-2 sm:mx-6 md:mx-12 2xl:mx-80 3xl:mx-96"
            key={post._id}
          >
            <Head>
              <title>{post.title}</title>
              <meta
                name="description"
                content="Allog 회원님들의 작성 글을 확인하는 페이지입니다."
              />
              <meta name="keywords" content="BLOG, 블로그, Allog" />
            </Head>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold white break-all whitespace-pre-wrap">
              {post.title}
            </h1>
            <div className="flex flex-row justify-between mt-12">
              <div className="flex flex-row items-center text-xs sm:text-base">
                <span className="font-bold ml-2">{post.writer}</span>
                <span className="mx-2">·</span>
                <span className="text-gray-500">{post.createdAt}</span>
              </div>
              <div className="flex flex-row">
                {session &&
                  session.user &&
                  session.user.name === slugs[0].substring(1) && (
                    <div className="flex items-center text-gray-400 text-xs sm:text-base">
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
                <span>
                  {session?.user &&
                  likedPost.indexOf(session.user.name) === -1 ? (
                    <div>
                      <button type="button" onClick={onClickAddLikedPost}>
                        🤍
                      </button>
                      <span className="text-xs sm:text-base">
                        {likedPost.length}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <button type="button" onClick={onClickRemoveLikedPost}>
                        ❤
                      </button>
                      <span className="text-xs sm:text-base">
                        {likedPost.length}
                      </span>
                    </div>
                  )}
                </span>
              </div>
            </div>
            <div>
              {post.hashtag.map((item) => {
                return (
                  <a
                    key={item}
                    href={`/hashtag/${item}`}
                    className="text-xs sm:text-base text-sky-500 px-1 mx-2 my-4 cursor-pointer inline-block"
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
                  className="rounded-full mr-4 aspect-square"
                  src={user?.image}
                  width={128}
                  height={128}
                  alt="user-profile"
                />
                <div className="flex flex-col">
                  {user?.nickname !== "" ? (
                    <div className="text-base sm:text-xl font-bold">
                      {user?.nickname}
                    </div>
                  ) : (
                    <div className="text-base sm:text-xl font-bold">
                      {user?.name}
                    </div>
                  )}
                  <div className="mt-1 text-xs sm:text-base">
                    {user?.userinfo}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
        <div className="mt-24 sm:mt-48 mx-4 sm:mx-6 md:mx-12 2xl:mx-80 3xl:mx-96 text-gray-600 text-base sm:text-xl">
          <span className="font-bold text-black">
            {comments.length ? comments.length : 0}
          </span>
          개의 댓글
        </div>
        {session && (
          <div className="mx-4 sm:mx-6 md:mx-12 my-12 2xl:mx-80 3xl:mx-96">
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
        <div className="mx-4 sm:mx-6 md:mx-12 2xl:mx-80 3xl:mx-96 mb-32">
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
            <div className="w-[300px] h-[200px] sm:w-[450px] sm:h-[300px] delete_post z-50 delete_sd">
              <div className="flex flex-col mx-6">
                <h1 className="font-bold text-2xl mb-3 mt-2 sm:mt-12">
                  포스트 삭제
                </h1>
                <p className="mb-16">정말로 삭제하시겠습니까?</p>
                <div className="flex justify-end sm:mt-12">
                  <button
                    onClick={() => setisDelete((value) => !value)}
                    type="button"
                    className="text-sky-600 hover:text-sky-700 px-6 py-1.5 mr-4 rounded-md"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDeleteArticleComment}
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
    <div className="flex flex-col py-12 mx-4">
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
            <span>
              {session?.user && likedUser.indexOf(session.user.name) === -1 ? (
                <div className="flex font-bold bg-[#0095F6] rounded-md text-white px-4 py-0.5">
                  <button type="button" onClick={onClickAddLikedUser}>
                    <span className="text-xs">팔로우</span>
                  </button>
                </div>
              ) : (
                <div className="flex font-bold bg-[#0095F6] rounded-md text-white px-4 py-0.5">
                  <button type="button" onClick={onClickRemoveLikedUser}>
                    <span className="text-xs">팔로우 취소</span>
                  </button>
                </div>
              )}
            </span>
          </div>
          <div className="text-xs my-4">
            게시물 <span className="font-bold">0</span>
          </div>
          <div className="mt-1 text-sm">{user?.userinfo}</div>
        </div>
      </div>
      <hr className="my-4 w-full" />
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
      `${process.env.BASE_URL}/api/article?writer=${writer}&status=false`,
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
