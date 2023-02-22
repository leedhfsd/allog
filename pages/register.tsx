import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);

  const onChangeEmail = () => {};
  const onChangePassword = () => {};
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-[400px] h-[768px] my-10">
          <div className="text-3xl font-bold text-center my-16">
            Allog 회원가입
          </div>
          <form className="flex flex-col text-sm">
            <label htmlFor="email" className="flex flex-col">
              이메일
            </label>
            <input
              className="outline-blue-500 py-3 mt-1 mb-4"
              id="email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              onChange={onChangeEmail}
            />
            <label htmlFor="password" className="flex flex-col">
              비밀번호
            </label>
            {isValidPassword ? (
              <input
                className="outline-blue-500 py-3 mt-1"
                type="password"
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                onChange={onChangePassword}
              />
            ) : (
              <input
                className="outline-red-500 py-3 mt-1"
                type="password"
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                onChange={onChangePassword}
              />
            )}

            {!isValidPassword && (
              <div className="text-xs text-red-500 my-1">
                8~16자 영문 소문자, 숫자, 특수문자를 사용하세요.
              </div>
            )}
            <label htmlFor="verification" className="flex flex-col mt-4">
              인증번호
            </label>
            <div className="flex justify-between">
              <input
                className="outline-blue-500 py-3 my-2"
                type="text"
                id="verification"
                placeholder="인증번호"
                onChange={onChangePassword}
              />
              <button
                className="text-sky-600 py-2 rounded-lg text-sm"
                type="button"
              >
                인증확인
              </button>
            </div>
            <button
              className=" bg-sky-600 py-2 text-white rounded-lg text-sm mt-8 mb-2"
              type="submit"
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
