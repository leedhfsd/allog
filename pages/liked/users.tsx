import { useSession } from "next-auth/react";
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
        if (Array.isArray(data[0].users)) setLikedUsers(data[0].users);
      }
    }
    getLike().catch(() => {
      throw new Error();
    });
  }, [session]);

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
          전체 유저 ({users.length})
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
                  className="rounded-full"
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
