import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
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
  const [image, setImage] = useState("");
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .then((res) => setUserData(res))
      .catch(() => {
        throw new Error();
      });
  }, [user]);
  useEffect(() => {
    if (userData && userData.nickname && userData.userinfo && userData.image) {
      setNickname(userData.nickname);
      setUserinfo(userData.userinfo);
      setImage(userData.image);
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
  const imageUploader = async (file) => {
    alert("변경 완료후 로그아웃 됩니다. 다시 로그인해주세요.");
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

  const onChangeImagefile = async (e) => {
    const uploaded = await imageUploader(e.target.files[0]);
    setImage(uploaded.url);
    await fetch(
      `/api/auth/user?email=${userData?.email}&image=${uploaded.url}`,
      {
        method: "PATCH",
      },
    );
    await signOut();
  };
  const handleDeleteUser = async () => {
    if (userData) {
      await fetch(`/api/article?writer=${userData.name}`, {
        method: "DELETE",
      });
      await fetch(`/api/comment?author=${userData.name}`, {
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
    if (userData) {
      await fetch(
        `/api/auth/user?email=${userData?.email}&nickname=${nickname}&userinfo=${userinfo}`,
        {
          method: "PATCH",
        },
      ).then(() => setIsCheck(false));
    }
  };

  if (status === "unauthenticated") {
    return <div>로그인 후 이용 가능합니다.</div>;
  }

  return (
    <div>
      <Head>
        <title>설정 | Allog</title>
        <meta name="description" content="" />
        <meta name="keywords" content="BLOG, 블로그, Allog" />
      </Head>
      {session && session.user && (
        <div className="flex flex-col min-h-[720px] my-16 md:w-[768px] md:mx-32">
          <section className="flex items-center">
            <div className="flex flex-col">
              <div className="w-[128px] h-[128px]">
                {image ? (
                  <img
                    src={image}
                    alt="user-img"
                    className="rounded-full aspect-square"
                  />
                ) : (
                  <img
                    src={session.user.image}
                    alt="user-img"
                    className="rounded-full aspect-square"
                  />
                )}
              </div>
              <label
                htmlFor="img"
                className="mt-4 mb-2 text-white bg-sky-500 rounded-md py-1.5 text-sm text-center"
              >
                이미지 변경
              </label>
              <input
                className="hidden"
                type="file"
                id="img"
                accept="image/*"
                onChange={onChangeImagefile}
              />
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
            <p className="text-gray-500 text-xs my-3">
              회원님의 모든 작성글과 회원정보가 삭제되며 복구되지 않습니다.
            </p>
            <div className="flex mt-12 items-center">
              <h3 className="font-bold mr-12">이용문의</h3>
              <span className="font-bold text-sm text-gray-600">
                leedhfsd@gmail.com
              </span>
            </div>
            <p className="text-gray-500 text-xs my-3">
              이용하시면서 불편하시던 점을 피드백을 주시면 감사하겠습니다.
            </p>
          </section>
          {isDelete && (
            <div>
              <div className="bg-[#f9f9f9] z-40 delete_opacity opacity-95" />
              <div className="delete_post z-50 delete_sd">
                <div className="flex flex-col mx-6">
                  <h1 className="font-bold text-2xl mb-3 mt-12">회원 탈퇴</h1>
                  <p className="mb-2">정말로 탈퇴하시겠습니까?</p>
                  <p className="text-xs text-sky-500 mb-16">
                    이대로 헤어지기는 너무 아쉽습니다...
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
