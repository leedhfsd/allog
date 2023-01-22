import Link from "next/link";
import { useState, useRef, SyntheticEvent } from "react";

export default function Write() {
  const [title, setTitle] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const onChangeText = (e: SyntheticEvent) => {
    const target = e.target as HTMLTextAreaElement;
    if (textRef.current !== null) {
      textRef.current.style.height = "30px";
      textRef.current.style.height = `${target.scrollHeight}px`;
    }
    setTitle(target.value);
  };

  return (
    <div className="flex">
      <div className="w-full lg:w-1/2">
        <form>
          <div className="px-14 py-11 flex flex-col">
            <textarea
              rows={1}
              spellCheck={false}
              className="text-5xl font-bold focus:outline-none w-full resize-none truncate"
              name="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={onChangeText}
              ref={textRef}
            />
            <hr className="border-b-8 my-4" />
            <input
              className="focus:outline-none my-16 text-xl"
              name="tag"
              type="text"
              placeholder="태그를 입력하세요"
            />
            <textarea
              className="focus:outline-none resize-none"
              name="description"
              placeholder="내용을 입력하세요"
            />
          </div>
          <div className="flex justify-between items-center">
            <Link href="/">
              <button type="button" className="text-xl">
                나가기
              </button>
            </Link>
            <div>
              <button
                type="submit"
                className="text-sky-500 rounded text-lg mx-1 px-5 font-bold"
              >
                임시버튼
              </button>
              <button
                type="submit"
                className="bg-sky-500 text-white rounded text-lg mx-1 px-5 py-1 font-bold"
              >
                출간하기
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden lg:block lg:w-1/2">
        <p>마크다운 영역</p>
      </div>
    </div>
  );
}
