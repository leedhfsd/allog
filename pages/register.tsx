import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { User } from "../interfaces";
import { validationPassword } from "../lib/validation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [option, setOption] = useState(true);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const redirect = async () => {
    await router.push("/auth/welcome");
  };

  const onChangeEmail = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setEmail(target.value);
  };
  const onChangePassword = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setPassword(target.value);
  };
  const onChangeconfirmPassword = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setconfirmPassword(target.value);
  };
  const onClickPassword = () => {
    setOption(true);
  };
  const onSubmitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    const postUser = async () => {
      const formData: User = {
        name: email.split("@")[0],
        email,
        password,
        image:
          "https://www.shareicon.net/data/128x128/2015/10/04/112008_people_512x512.png",
        emailVerified: true,
      };
      await fetch("/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    };
    postUser()
      .then(() => redirect())
      .catch((err) => {
        throw err;
      });
  };

  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (option && !passwordRef.current?.contains(target)) {
      setOption(false);
    }
  };
  useEffect(() => {
    if (option) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  useEffect(() => {
    if (!option) {
      setIsValidPassword(validationPassword(password));
    }
  }, [option, password]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-[400px] h-[768px] my-10">
          <div className="text-3xl font-bold text-center my-16">
            Allog 회원가입
          </div>
          <form onSubmit={onSubmitForm} className="flex flex-col text-sm">
            <label htmlFor="email">이메일</label>
            <input
              className="outline-blue-500 py-3 mt-1 mb-4"
              id="email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              onChange={onChangeEmail}
            />
            <label htmlFor="password">비밀번호</label>
            {isValidPassword ? (
              <input
                className="outline-blue-500 py-3 mt-1 mb-4"
                type="password"
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                ref={passwordRef}
                onClick={onClickPassword}
                onChange={onChangePassword}
              />
            ) : (
              <input
                className="outline-red-500 py-3 mt-1"
                type="password"
                id="password"
                placeholder="비밀번호를 입력해 주세요"
                ref={passwordRef}
                onClick={onClickPassword}
                onChange={onChangePassword}
              />
            )}

            {!isValidPassword && (
              <div className="text-xs text-red-500 my-1">
                공백없이 8~16자 영문 대소문자, 숫자, 특수문자를 사용해주세요.
              </div>
            )}
            <label htmlFor="re-password">비밀번호 재확인</label>
            <input
              className="outline-blue-500 py-3 mt-1"
              type="password"
              id="re-password"
              placeholder="동일한 비밀번호를 입력해주세요"
              onChange={onChangeconfirmPassword}
            />
            {confirmPassword &&
              (password === confirmPassword ? (
                <div className="text-sky-500 text-xs mt-1">
                  동일한 비밀번호입니다.
                </div>
              ) : (
                <div className="text-red-500 text-xs mt-1">
                  동일하지 않은 비밀번호입니다.
                </div>
              ))}
            <label htmlFor="verification" className="flex flex-col mt-4">
              인증번호
            </label>
            <div className="flex justify-between">
              <input
                className="outline-blue-500 py-3 my-2"
                type="text"
                id="verification"
                placeholder="인증번호"
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
