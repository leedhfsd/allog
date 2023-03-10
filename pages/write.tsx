import Link from "next/link";
import Head from "next/head";
import {
  useState,
  useRef,
  SyntheticEvent,
  useEffect,
  KeyboardEvent,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { marked } from "marked";
import DOMPurify from "dompurify";
import prism from "prismjs";
import "../components/marked-prism";
import "github-markdown-css";
import { Article } from "../interfaces";
import { authOptions } from "./api/auth/[...nextauth]";

interface Certificate {
  name: string;
  email: string;
  image: string | undefined;
}
function Write({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [option, setOption] = useState(false);
  const [tag, setTag] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [fail, setFail] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  marked.setOptions({
    highlight: (code, lang) => {
      if (prism.languages[lang]) {
        return prism.highlight(code, prism.languages[lang], lang);
      }
      return code;
    },
  });
  const redirect = async () => {
    await router.push("/");
  };
  const onChangeTitle = (e: SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    if (textRef.current !== null) {
      textRef.current.style.height = "30px";
      textRef.current.style.height = `${target.scrollHeight}px`;
    }
    setTitle(target.value);
  };
  const onChangeContent = (e: SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setContent(target.value);
    setMarkdown(marked.parse(target.value));
  };
  const onMouseDownOption = () => setOption((value) => !value);
  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (option && !tagRef.current?.contains(target)) {
      setOption(false);
    }
  };
  const onTagChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setTagInput(target.value);
  };
  const onKeyDownTag = (e: KeyboardEvent) => {
    if (e.key === "Enter" && tagInput !== "") {
      e.preventDefault();
      if (tag.indexOf(tagInput) === -1) {
        setTag([tagInput, ...tag]);
      }
      if (tagRef.current) {
        tagRef.current.value = "";
      }
      setTagInput("");
    }
  };
  const removeTag = (item: string) => {
    const newTagArray = tag.filter((value) => value !== item);
    setTag(newTagArray);
  };
  const onClickPrivate = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setIsPrivate(true);
    } else {
      setIsPrivate(false);
    }
  };
  const handleSubmitArticle = (e: SyntheticEvent) => {
    if (title !== "" && session !== null) {
      setFail(false);
    } else {
      setFail(true);
      setTimeout(() => setFail(false), 1500);
      return;
    }
    e.preventDefault();
    const curDate = new Date();
    const utc = curDate.getTime() + curDate.getTimezoneOffset() * 60 * 1000;
    const kst = new Date(utc + 9 * 60 * 60 * 1000);
    const postData = async () => {
      if (session?.user) {
        let url = title
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gim, "")
          .replace(/\n/gim, " ")
          .split(" ")
          .join("-")
          .trim();
        if (!url) {
          url = `${curDate.getTime()}`;
        }
        if (!data) {
          const formData = {
            title,
            content,
            hashtag: tag,
            createdAt: `${kst.getFullYear()}??? ${
              kst.getMonth() + 1
            }??? ${kst.getDate()}???`,
            writer: session.user.name,
            profile: session.user.image,
            slug: url,
            sanitizedHtml: markdown,
            disclosureStatus: isPrivate,
          };
          await fetch("/api/write", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
        } else if (data && Array.isArray(data)) {
          const article = data[0] as Article;
          const formData = {
            _id: article._id,
            title,
            content,
            hashtag: tag,
            slug: url,
            sanitizedHtml: markdown,
            disclosureStatus: isPrivate,
          };
          await fetch("/api/write", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
        }
      }
    };
    postData()
      .then(() => redirect())
      .catch((err) => {
        throw err;
      });
  };
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const article = data[0] as Article;
      setTitle(article.title);
      setTag(article.hashtag);
      setContent(article.content);
      setMarkdown(article.sanitizedHtml);
    }
  }, [data]);
  useEffect(() => {
    if (option) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  useEffect(() => {
    const markdownDiv = document.getElementById("markdown-preview");
    if (markdownDiv) {
      markdownDiv.innerHTML = DOMPurify.sanitize(markdown);
    }
  }, [markdown]);

  return (
    <div className="flex h-screen mx-16 lg:mx-24 py-4">
      <Head>
        <title>??? ?????? | Allog</title>
        <meta
          name="description"
          content="Allog??? ??????????????? ?????? ???????????? ??????????????????."
        />
        <meta name="keywords" content="BLOG, ?????????, Allog, ?????????" />
      </Head>
      <div className="flex flex-col w-full lg:w-1/2">
        <div>
          <form>
            <div className="">
              <textarea
                rows={1}
                spellCheck={false}
                className="text-5xl font-bold focus:outline-none w-full resize-none truncate my-4"
                name="title"
                placeholder="????????? ???????????????"
                value={title}
                onChange={onChangeTitle}
                ref={textRef}
              />
              <hr className="border-b-8 my-4 border-gray-700 w-32" />
              <input className="hidden" type="text" />
              <div className="w-5/6">
                {tag.map((item) => {
                  return (
                    <div
                      key={item}
                      aria-hidden="true"
                      onClick={() => removeTag(item)}
                      className="text-sky-500 px-1 mx-2 my-2 cursor-pointer inline-block"
                    >
                      {item}
                    </div>
                  );
                })}
                <input
                  ref={tagRef}
                  onChange={onTagChange}
                  onMouseDown={onMouseDownOption}
                  autoComplete="off"
                  onKeyDown={onKeyDownTag}
                  className="focus:outline-none mb-4 text-xl"
                  name="tag"
                  type="text"
                  placeholder="????????? ???????????????"
                />
              </div>
              {option && (
                <div className="absolute bg-slate-700 text-white z-10 text-xs px-4 py-4 w-1/2 lg:w-2/5">
                  <p>????????? ???????????? ????????? ????????? ??? ????????????.</p>
                  <p>????????? ????????? ???????????? ????????? ??? ????????????.</p>
                </div>
              )}
              <textarea
                className="focus:outline-none resize-none text-lg w-full"
                rows={23}
                name="content"
                placeholder="????????? ???????????????"
                onChange={onChangeContent}
                value={content}
              />
            </div>
            <div className="flex justify-between items-center mt-4 mb-2">
              <div className="bg-[#333333] rounded py-1 px-5">
                <input type="checkbox" id="private" onClick={onClickPrivate} />
                <label
                  htmlFor="private"
                  className="mx-2 text-xl font-bold text-white"
                >
                  ?????????
                </label>
              </div>
              <div>
                <Link href="/">
                  <button
                    type="button"
                    className="text-sky-500 hover:text-sky-400 rounded text-lg mx-1 px-5 font-bold"
                  >
                    ????????????
                  </button>
                </Link>
                {data ? (
                  <button
                    type="button"
                    onClick={handleSubmitArticle}
                    className="bg-sky-500 hover:bg-sky-400 text-white rounded text-lg mx-1 px-5 py-1 font-bold"
                  >
                    ????????????
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitArticle}
                    className="bg-sky-500 hover:bg-sky-400 text-white rounded text-lg mx-1 px-5 py-1 font-bold"
                  >
                    ????????????
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      {fail && (
        <div className="top-4 right-4 bg-red-500 text-white text-base w-fit rounded px-4 py-1 absolute z-20">
          <p>???????????? ?????????????????????. ???????????? ?????? ????????? ???????????????.</p>
        </div>
      )}
      <div className="hidden mt-16 lg:block lg:w-1/2">
        <div
          className="whitespace-pre-wrap markdown-body"
          id="markdown-preview"
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user, id } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);
  const curUser = session?.user as Certificate;
  if (
    typeof user === "string" &&
    typeof id === "string" &&
    session &&
    curUser.name === user
  ) {
    const res = await fetch(
      `${process.env.BASE_URL}/api/article?writer=${user}&id=${id}`,
    );
    const data = (await res.json()) as Article[];
    return {
      props: { data },
    };
  }
  return {
    props: {},
  };
};

export default Write;
