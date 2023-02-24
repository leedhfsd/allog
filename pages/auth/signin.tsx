import { signIn } from "next-auth/react";
import { SyntheticEvent, useState } from "react";

export default function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginByEmail = async (e: SyntheticEvent) => {
    e.preventDefault();
    await signIn("email-password", {
      email,
      password,
      callbackUrl: "/",
    });
  };
  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" }).catch(() => {
      throw new Error();
    });
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[300px] h-[768px] my-10">
        <div className="text-3xl font-bold text-center my-16">
          Allog에 어서오세요!
        </div>
        <form onSubmit={loginByEmail} className="flex flex-col text-sm ">
          <input
            className="outline-blue-500 py-3 my-1.5"
            id="email"
            type="email"
            placeholder="이메일을 입력해 주세요"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="outline-blue-500  py-3"
            type="password"
            id="password"
            placeholder="비밀번호를 입력해 주세요"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className=" bg-sky-600 py-2 text-white rounded-lg text-sm mt-8 mb-2"
            type="submit"
          >
            로그인
          </button>
        </form>
        <div className="flex text-xs justify-between text-[#888]">
          <a href="/register" className="hover:text-black">
            회원가입
          </a>
          <a href="/find_password" className="hover:text-black">
            비밀번호 찾기
          </a>
        </div>
        <div className="text-center my-4 text-[#888]">또는</div>
        <div className="flex flex-col">
          <button
            type="button"
            className="flex items-center bg-[#1d5e87] rounded-lg my-1"
            onClick={() => handleLogin("github")}
          >
            <span className="flex justify-center items-center bg-[#123456] w-10 h-10  rounded-tl-lg rounded-bl-lg">
              <svg height="24" viewBox="0 0 16 16" width="40">
                <path
                  fill="#ffffff"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </span>
            <span className="text-white text-xs md:text-sm ml-10">
              GITHUB으로 로그인하기
            </span>
          </button>
          <button
            type="button"
            className="flex items-center bg-[#DB4437] rounded-lg"
            onClick={() => handleLogin("google")}
          >
            <span className="flex justify-center items-center bg-red-700 w-10 h-10 rounded-tl-lg rounded-bl-lg">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  fill="#ffffff"
                  d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.92-.725 2.303-2.084 3.233l-.02.124 3.028 2.292.21.02c1.926-1.738 3.037-4.296 3.037-7.33z"
                />
                <path
                  fill="#ffffff"
                  d="M10.2 19.931c2.753 0 5.064-.886 6.753-2.414l-3.218-2.436c-.862.587-2.017.997-3.536.997a6.126 6.126 0 0 1-5.801-4.141l-.12.01-3.148 2.38-.041.112c1.677 3.256 5.122 5.492 9.11 5.492z"
                />
                <path
                  fill="#ffffff"
                  d="M4.398 11.937a6.008 6.008 0 0 1-.34-1.971c0-.687.125-1.351.329-1.971l-.006-.132-3.188-2.42-.104.05A9.79 9.79 0 0 0 .001 9.965a9.79 9.79 0 0 0 1.088 4.473l3.309-2.502z"
                />
                <path
                  fill="#ffffff"
                  d="M10.2 3.853c1.914 0 3.206.809 3.943 1.484l2.878-2.746C15.253.985 12.953 0 10.199 0 6.211 0 2.766 2.237 1.09 5.492l3.297 2.503A6.152 6.152 0 0 1 10.2 3.853z"
                />
              </svg>
            </span>
            <span className="text-white text-xs md:text-sm ml-10">
              GOOGLE로 로그인하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
