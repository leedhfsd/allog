import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article, Like } from "../../interfaces";

export default function Posts() {
  const { data: session } = useSession();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [posts, setPosts] = useState<Article[]>([]);

  const onClickRemoveLikedPost = async (id: number) => {
    if (session?.user) {
      setPosts(posts.filter((item) => item._id !== id));
      await fetch(
        `/api/liked?name=${session?.user.name}&id=${id}&status=posts`,
        {
          method: "DELETE",
        },
      );
    }
  };

  useEffect(() => {
    async function getLike() {
      if (session?.user) {
        const res = await fetch(`/api/liked?name=${session?.user?.name}`);
        const data = (await res.json()) as Like[];
        if (Array.isArray(data[0].posts)) setLikedPosts(data[0].posts);
      }
    }
    getLike().catch(() => {
      throw new Error();
    });
  }, [session]);
  useEffect(() => {
    async function getLikedPosts() {
      if (likedPosts.length > 0) {
        const queryString = likedPosts.map((id) => `id=${id}`).join("&");
        const res = await fetch(`/api/article?status=arr&${queryString}`);
        const data = (await res.json()) as Article[];
        setPosts(data);
      }
    }
    getLikedPosts().catch(() => {
      throw new Error();
    });
  }, [likedPosts]);
  return (
    <div>
      <div className="flex justify-center my-16 text-xl">
        <Link className="" href="/liked/posts">
          <div className="mx-2 py-2 border-black border-b-2">좋아한 글</div>
        </Link>
        <Link href="/liked/users">
          <div className="mx-2 py-2 text-[#868e96]">좋아한 작성자</div>
        </Link>
      </div>
      <div>
        <div className="px-4 mx-12 2xl:mx-80 3xl:mx-96 text-xl mb-12">
          전체 글 ({posts.length})
        </div>
        {session && posts && posts.length > 0 ? (
          <div>
            {posts.map((item) => (
              <div
                key={item._id}
                className="flex mx-12 2xl:mx-80 3xl:mx-96 py-16"
              >
                <Link
                  href={`/article/@${item.writer}/${item._id}/${item.slug}`}
                >
                  <h1 className="font-bold text-xl my-1">{item.title}</h1>
                  <p className="mb-2 line_clamp whitespace-pre-wrap min-h-[80px] text-[#666666]">
                    {item.content}
                  </p>
                  <div className="flex text-sm">
                    <span className="font-bold">{item.writer}</span>
                    <span className="mx-1">·</span>
                    <span className="text-gray-500">{item.createdAt}</span>
                    <span className="mx-1">·</span>
                    <button
                      type="button"
                      onClick={() => onClickRemoveLikedPost(item._id)}
                    >
                      ❤
                    </button>
                    <span>{item.liked.length}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
