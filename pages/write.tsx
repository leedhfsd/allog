import Link from "next/link";
import {
  useState,
  useRef,
  SyntheticEvent,
  useEffect,
  KeyboardEvent,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [option, setOption] = useState(false);
  const [tag, setTag] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [fail, setFail] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
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
        const formData = {
          title,
          content,
          hashtag: tag,
          createdAt: `${kst.getFullYear()}년 ${
            kst.getMonth() + 1
          }월 ${kst.getDate()}일`,
          writer: session.user.name,
          profile: session.user.image,
        };
        await fetch("/api/write", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }
    };
    postData()
      .then(() => redirect())
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    if (option) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="flex h-screen mx-16 lg:mx-24 py-4">
      <div className="flex flex-col w-full lg:w-1/2">
        <div>
          <form>
            <div className="">
              <textarea
                rows={1}
                spellCheck={false}
                className="text-5xl font-bold focus:outline-none w-full resize-none truncate my-4"
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
                  className="focus:outline-none mb-4 text-xl"
                  name="tag"
                  type="text"
                  placeholder="태그를 입력하세요"
                />
              </div>
              {option && (
                <div className="relative bg-slate-700 text-white z-10 text-xs px-4 py-4 w-1/2 lg:w-2/5">
                  <p>엔터를 입력하면 태그를 등록할 수 있습니다.</p>
                  <p>등록된 태그를 클릭하면 삭제할 수 있습니다.</p>
                </div>
              )}
              <textarea
                className="focus:outline-none resize-none text-lg w-full"
                rows={23}
                name="content"
                placeholder="내용을 입력하세요"
                onChange={onChangeContent}
                value={content}
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Link href="/">
                <button type="button" className="text-xl font-bold">
                  뒤로 가기
                </button>
              </Link>
              <div>
                <button
                  type="button"
                  className="text-sky-500 rounded text-lg mx-1 px-5 font-bold"
                >
                  임시버튼
                </button>
                <button
                  type="button"
                  onClick={handleSubmitArticle}
                  className="bg-sky-500 text-white rounded text-lg mx-1 px-5 py-1 font-bold"
                >
                  출간하기
                </button>
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
      <div className="hidden lg:block lg:w-1/2">
        <p>마크다운 영역</p>
      </div>
    </div>
  );
}
