import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isCheck, setCheck] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const loginHandler = () => {
    signIn().catch(() => {
      throw new Error("Login Failed...");
    });
  };
  const logoutHandler = () => {
    signOut().catch(() => {
      throw new Error("Logout Failed...");
    });
  };
  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (isCheck && !listRef.current?.contains(target)) {
      setCheck(false);
    }
  };
  useEffect(() => {
    if (isCheck) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <header>
      <div className="flex justify-between items-center">
        <div>
          <Link className="text-3xl tracking-wider font-eng" href="/">
            Allog
          </Link>
        </div>
        <div className="flex">
          <Link className="text-center mx-4" href="/search">
            <svg width="16" height="36" viewBox="0 0 24 24">
              <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z" />
            </svg>
          </Link>
          {/* 로그인 시 비활성화 */}
          {!session && (
            <div className="flex items-center">
              <button
                type="button"
                className="text-white px-4 py-1 font-bold bg-black hover:bg-slate-800 rounded-full text-sm"
                onClick={loginHandler}
              >
                로그인
              </button>
            </div>
          )}
          {/* 로그인 시 활성화 */}
          {session?.user && (
            <div className="flex items-center">
              <Link
                className="hidden md:block border border-black px-4 py-1 bg-white hover:bg-black hover:text-white rounded-full mr-5 font-bold"
                href="/write"
              >
                새 글 작성
              </Link>
              {session.user.image && (
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-label="Profile"
                    className="rounded-full bg-black h-10 w-10 bg-cover mr-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setCheck((value) => !value);
                    }}
                    style={{ backgroundImage: `url('${session.user.image}')` }}
                  />
                  <button
                    type="button"
                    aria-label="sort-down"
                    onClick={(e) => {
                      e.preventDefault();
                      setCheck((value) => !value);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
          {isCheck && session && (
            <div className="hidden md:block absolute border-black bg-white z-10 w-48 rounded-lg sd mt-12">
              <ul
                className="text-base border-black cursor-pointer"
                ref={listRef}
              >
                <Link href={`/article/@${session.user.email.split("@")[0]}`}>
                  <li
                    aria-hidden="true"
                    className="py-3 px-4 hover:text-sky-500"
                  >
                    내 블로그
                  </li>
                </Link>
                <li className="md:hidden py-3 px-4 hover:text-sky-500">
                  새 글 작성
                </li>
                <li className="py-3 px-4 hover:text-sky-500">즐겨찾기</li>
                <li className="py-3 px-4 hover:text-sky-500">설정</li>
                <button
                  type="button"
                  onClick={logoutHandler}
                  className="py-3 px-4 hover:text-sky-500"
                >
                  로그아웃
                </button>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
