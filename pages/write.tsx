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

function getPlainText(str: string) {
  let content = str;
  content = content.replace(/`([^`]+)`/g, "$1");
  content = content.replace(/!\[[^\]]*\]\(([^)]+)\)/g, "");
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  content = content.replace(/(\*|_){1,2}([^*_]+)\1{1,2}/g, "$2");
  content = content.replace(/#{1,6}\s?(.*)/g, "$1");
  content = content.replace(/^\s*[-+*]\s?(.*)/gm, "$1");
  content = content.replace(/^\s*\d+\.\s?(.*)/gm, "$1");
  content = content.replace(/^\s*>/gm, "");
  return content.trim();
}

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
  const imageRef = useRef<HTMLInputElement>(null);
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
  const imageUploader = async (file: Blob) => {
    alert("이미지 파일의 크기가 큰 경우 업로드를 기다려주세요.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS,
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    return res.json();
  };
  // eslint-disable-next-line
  const onChangeImagefile = async (e: any) => {
    // eslint-disable-next-line
    const uploaded = await imageUploader(e.target.files[0]);
    // eslint-disable-next-line
    setMarkdown(markdown + marked.parse(`\n![](${uploaded.secure_url})\n`));
    // eslint-disable-next-line
    setContent(content + `\n![](${uploaded.secure_url})\n`);
    if (imageRef.current !== null) {
      imageRef.current.value = "";
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
        const regex = /!\[(.*?)\]\((.*?)\)/g;
        const matches = content.match(regex);
        let thumbnail = "";
        if (matches && matches.length > 0) {
          const tmp = matches[0].match(/(?<=\().+?(?=\))/);
          if (tmp !== null) {
            [thumbnail] = tmp;
          }
        }
        const plainText = getPlainText(content);
        if (!data) {
          const formData = {
            title,
            content,
            plainText,
            hashtag: tag,
            createdAt: `${kst.getFullYear()}년 ${
              kst.getMonth() + 1
            }월 ${kst.getDate()}일`,
            writer: session.user.name,
            profile: session.user.image,
            slug: url,
            thumbnailImage: thumbnail,
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
            plainText,
            hashtag: tag,
            slug: url,
            thumbnailImage: thumbnail,
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
    <div className="flex h-screen mx-2 sm:mx-4 md:mx-8 lg:mx-24 py-4">
      <Head>
        <title>글 작성 | Allog</title>
        <meta
          name="description"
          content="Allog의 회원님들이 글을 작성하는 페이지입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog, 글작성" />
      </Head>
      <div className="flex flex-col w-full lg:w-1/2">
        <div>
          <form>
            <div className="">
              <textarea
                rows={1}
                spellCheck={false}
                className="text-4xl md:text-5xl font-bold focus:outline-none w-full resize-none truncate my-4"
                name="title"
                placeholder="제목을 입력하세요"
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
                  className="focus:outline-none mb-4 text-base sm:text-xl"
                  name="tag"
                  type="text"
                  placeholder="태그를 입력하세요"
                />
              </div>
              {option && (
                <div className="absolute bg-slate-700 text-white z-10 text-xs px-4 py-4 w-1/2 lg:w-2/5">
                  <p>엔터를 입력하면 태그를 등록할 수 있습니다.</p>
                  <p>등록된 태그를 클릭하면 삭제할 수 있습니다.</p>
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="img" className="hover:opacity-80">
                  <img
                    src="upload_64.png"
                    alt="img_upload"
                    height={36}
                    width={36}
                  />
                </label>
                <input
                  ref={imageRef}
                  className="hidden"
                  type="file"
                  id="img"
                  accept="image/*"
                  onChange={onChangeImagefile}
                />
              </div>
              <textarea
                className="focus:outline-none resize-none text-lg w-full"
                rows={23}
                name="content"
                placeholder="내용을 입력하세요"
                onChange={onChangeContent}
                value={content}
              />
            </div>
            <div className="flex justify-between items-center mt-4 mb-2">
              <div className="bg-[#333333] rounded py-1 px-2 sm:px-5">
                <input type="checkbox" id="private" onClick={onClickPrivate} />
                <label
                  htmlFor="private"
                  className="mx-2 text-base sm:text-xl font-bold text-white"
                >
                  비공개
                </label>
              </div>
              <div>
                <Link href="/">
                  <button
                    type="button"
                    className="text-sky-500 hover:text-sky-400 rounded text-base sm:text-xl mx-1 px-5 font-bold"
                  >
                    뒤로가기
                  </button>
                </Link>
                {data ? (
                  <button
                    type="button"
                    onClick={handleSubmitArticle}
                    className="bg-sky-500 hover:bg-sky-400 text-white rounded text-base sm:text-xl mx-1 px-5 py-1 font-bold"
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitArticle}
                    className="bg-sky-500 hover:bg-sky-400 text-white rounded text-base sm:text-xl mx-1 px-5 py-1 font-bold"
                  >
                    출간하기
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      {fail && (
        <div className="top-4 right-4 bg-red-500 text-white text-base w-fit rounded px-4 py-1 absolute z-20">
          <p>포스트에 실패하였습니다. 로그인과 제목 입력은 필수입니다.</p>
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
