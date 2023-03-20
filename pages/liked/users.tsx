import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Like, User } from "../../interfaces";

export default function Users() {
  const { data: session } = useSession();
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const onClickRemoveLikedUsers = async (name: string) => {
    if (session?.user) {
      setUsers(users.filter((item) => item.name !== name));
      await fetch(
        `/api/liked?name=${session?.user.name}&user=${name}&status=users`,
        {
          method: "DELETE",
        },
      );
    }
    setLikedUsers(likedUsers.filter((item) => item !== name));
  };

  useEffect(() => {
    async function getLike() {
      if (session?.user) {
        const res = await fetch(`/api/liked?name=${session?.user?.name}`);
        const data = (await res.json()) as Like[];
        if (Array.isArray(data) && typeof data[0].users !== "undefined")
          setLikedUsers(data[0].users);
      }
    }
    getLike().catch(() => {
      throw new Error();
    });
  }, [session?.user]);
  useEffect(() => {
    async function getLikedUsers() {
      if (likedUsers.length > 0) {
        const queryString = likedUsers.map((name) => `name=${name}`).join("&");
        const res = await fetch(`/api/auth/user?status=arr&${queryString}`);
        const data = (await res.json()) as User[];
        setUsers(data);
      }
    }
    getLikedUsers().catch(() => {
      throw new Error();
    });
  }, [likedUsers]);
  return (
    <div>
      <Head>
        <title>좋아요 | Allog</title>
        <meta
          name="description"
          content="Allog 회원님들의 좋아요를 확인할 수 있는 페이지입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog" />
      </Head>
      <div className="flex justify-center my-16 text-xl">
        <Link className="" href="/liked/posts">
          <div className="mx-2 py-2 text-[#868e96]">좋아한 글</div>
        </Link>
        <Link href="/liked/users">
          <div className="mx-2 py-2 border-black border-b-2">좋아한 작성자</div>
        </Link>
      </div>
      <div>
        <div className="mx-12 2xl:mx-80 3xl:mx-96 text-xl mb-12">
          전체 유저 ({users.length ? users.length : 0})
        </div>
      </div>
      {session &&
        users.length > 0 &&
        users.map((user) => (
          <div
            key={user.email}
            className="mx-12 2xl:mx-80 3xl:mx-96 text-xl my-12 flex items-center justify-between"
          >
            <Link href={`/article/@${user.name}`}>
              <div className="flex items-center">
                <img
                  src={user.image}
                  alt="profile"
                  height={128}
                  width={128}
                  className="rounded-full aspect-square"
                />
                <div className="flex flex-col mx-4">
                  {user.nickname !== "" ? (
                    <div className="sm:text-2xl font-bold">{user.nickname}</div>
                  ) : (
                    <div className="sm:text-2xl font-bold">{user.name}</div>
                  )}
                  <div className="text-sm sm:text-base mt-1">
                    {user.userinfo}
                  </div>
                </div>
              </div>
            </Link>
            <span className="mr-16">
              <button
                type="button"
                onClick={() => onClickRemoveLikedUsers(user.name)}
              >
                ❤
              </button>
            </span>
          </div>
        ))}
    </div>
  );
}
