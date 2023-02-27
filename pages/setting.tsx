import { DefaultSession } from "next-auth";
import { useSession } from "next-auth/react";
import { SyntheticEvent, useEffect, useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [userinfo, setUserinfo] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [user, setUser] = useState<DefaultSession["user"]>();
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (session && session.user) {
      const { name, email, image } = session.user;
      setUser({ name, email, image });
      setUserinfo(name);
      setNickname(name);
    }
  }, [session]);
  const onClickisCheck = () => {
    setIsCheck(true);
  };
  const onChangeUserinfo = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setUserinfo(target.value);
  };
  const onChangenickname = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setNickname(target.value);
  };
  const onClickModify = async () => {
    const res = await fetch(
      `/api/auth/user?email=${user?.email}&nickname=${nickname}&userinfo=${userinfo}`,
      {
        method: "PATCH",
      },
    ).then(() => setIsCheck(false));
  };

  if (status === "unauthenticated") {
    return <div>로그인 후 이용 가능합니다.</div>;
  }
  return (
    <div>
      {session && (
        <div className="flex flex-col h-[768px] my-16 md:w-[720px]">
          <section className="flex items-center">
            <div className="flex flex-col">
              <img src={user?.image} alt="user-img" />
              <button
                className="mt-4 mb-2 text-white bg-sky-500 rounded py-1"
                type="button"
              >
                이미지 업로드
              </button>
              <button
                className="text-white bg-sky-500 rounded py-1"
                type="button"
              >
                이미지 제거
              </button>
            </div>
            <div className="ml-12 w-5/6">
              {!isCheck ? (
                <div>
                  <h1 className="text-4xl font-bold">{user?.name}</h1>
                  <button
                    className="my-4 text-sm underline text-sky-500"
                    type="button"
                    onClick={onClickisCheck}
                  >
                    소개말 수정
                  </button>
                </div>
              ) : (
                <div className="flex flex-col my-4">
                  <label className="" htmlFor="nickname">
                    별명
                  </label>
                  <input
                    className="py-1.5 border rounded border-gray-300 my-2 focus:outline-sky-400"
                    type="text"
                    id="nickname"
                    placeholder="별명 변경"
                    onChange={onChangenickname}
                    value={nickname}
                  />
                  <label htmlFor="userinfo">한 줄 메시지</label>
                  <input
                    className="py-1.5 border rounded border-gray-300 my-2 mb-4 focus:outline-sky-400"
                    type="text"
                    id="userinfo"
                    placeholder="한 줄 메시지를 작성해주세요."
                    onChange={onChangeUserinfo}
                    value={userinfo}
                  />
                  <button
                    type="button"
                    className="text-white bg-sky-500 rounded-md py-1 px-4 my-2 w-[72px]"
                    onClick={onClickModify}
                  >
                    변경
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
