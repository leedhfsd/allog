import Link from "next/link";
import { useRef } from "react";

export default function Write() {
  return (
    <div className="flex">
      <div className="w-full lg:w-1/2">
        <form>
          <div className="flex flex-col">
            <div className="px-14 py-11">
              <textarea
                rows={1}
                className="text-5xl font-bold focus:outline-none w-full resize-none"
                name="title"
                placeholder="제목을 입력하세요"
              />
              <hr />
              <input
                className="focus:outline-none"
                name="tag"
                type="text"
                placeholder="태그를 입력하세요"
              />
              <textarea
                className="focus:outline-none resize-none"
                name="description"
                placeholder="내용을 입력하세요..."
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
          </div>
        </form>
      </div>
      <div className="hidden lg:block lg:w-1/2">
        <p>마크다운 영역</p>
      </div>
    </div>
  );
}
