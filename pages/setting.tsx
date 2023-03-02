import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { User } from "../interfaces";

export default function Profile() {
  const { data: session, status } = useSession();
  const [userinfo, setUserinfo] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [user, setUser] = useState<User>();
  const [nickname, setNickname] = useState("");
  const [userData, setUserData] = useState<User>();
  const [isDelete, setisDelete] = useState(false);
  const router = useRouter();
  const redirect = async () => {
    await router.push("/auth/goodbye");
  };
  useEffect(() => {
    if (session && session.user) {
      const curUser = session.user;
      setUser(curUser);
    }
  }, [session]);
  useEffect(() => {
    if (!user) return;
    fetch(`api/auth/user?name=${user.name}`)
      .then((res) => res.json())
      .then((res) => setUserData(res))
      .catch(() => {
        throw new Error();
      });
  }, [user]);
  useEffect(() => {
    if (userData && userData.nickname && userData.userinfo) {
      setNickname(userData.nickname);
      setUserinfo(userData.userinfo);
    }
  }, [userData]);

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
  const handleDeleteUser = async () => {
    if (userData) {
      await fetch(`/api/article?writer=${userData.name}`, {
        method: "DELETE",
      });
      await fetch(`/api/auth/user?email=${userData.email}`, {
        method: "DELETE",
      })
        .then(() => redirect())
        .then(() => signOut());
    }
  };
  const onClickModify = async () => {
    await fetch(
      `/api/auth/user?email=${userData?.email}&nickname=${nickname}&userinfo=${userinfo}`,
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
        <div className="flex flex-col h-[768px] my-16 md:w-[768px] md:mx-32">
          <title>설정 | Allog</title>
          <section className="flex items-center">
            <div className="flex flex-col">
              <img
                src={user?.image}
                alt="user-img"
                width={128}
                height={128}
                className="rounded-full"
              />
              <button
                className="mt-4 mb-2 text-white bg-sky-500 rounded-md py-1 text-sm"
                type="button"
              >
                이미지 업로드
              </button>
              <button
                className="text-white bg-sky-500 rounded-md py-1 text-sm"
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
                    placeholder="별명 변경(최대 15자)"
                    onChange={onChangenickname}
                    value={nickname}
                    maxLength={15}
                  />
                  <label htmlFor="userinfo">한 줄 메시지</label>
                  <input
                    className="py-1.5 border rounded border-gray-300 my-2 mb-4 focus:outline-sky-400"
                    type="text"
                    id="userinfo"
                    placeholder="한 줄 메시지를 작성해주세요(최대 30자)"
                    onChange={onChangeUserinfo}
                    value={userinfo}
                    maxLength={30}
                  />
                  <button
                    type="button"
                    className="text-white bg-sky-500 rounded-md py-1 px-4 my-2 w-[72px] text-sm"
                    onClick={onClickModify}
                  >
                    변경
                  </button>
                </div>
              )}
            </div>
          </section>
          <section>
            <div className="flex mt-16 items-center">
              <h3 className="font-bold mr-12">회원탈퇴</h3>
              <button
                type="button"
                className="bg-red-500 px-4 py-1.5 text-white rounded-md text-sm"
                onClick={() => setisDelete((value) => !value)}
              >
                회원 탈퇴
              </button>
            </div>
            <div className="text-gray-500 text-xs my-3">
              회원님의 모든 작성글과 회원정보가 삭제되며 복구되지 않습니다.
            </div>
          </section>
          {isDelete && (
            <div>
              <div className="bg-[#f9f9f9] z-40 delete_opacity opacity-95" />
              <div className="delete_post z-50 delete_sd">
                <div className="flex flex-col mx-6">
                  <h1 className="font-bold text-2xl mb-3 mt-12">회원 탈퇴</h1>
                  <p className="mb-2">정말로 탈퇴하시겠습니까?</p>
                  <p className="text-xs text-sky-500 mb-16">
                    이대로 헤어지기는 너무 아쉬워요!
                  </p>
                  <div className="flex justify-end mt-12">
                    <button
                      onClick={() => setisDelete((value) => !value)}
                      type="button"
                      className="text-sky-600 hover:text-sky-700 px-6 py-1.5 mr-4 rounded-md"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      type="button"
                      className="text-white bg-sky-600 hover:bg-sky-700 px-6 py-1.5 rounded-md"
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
