import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Like() {
  const { data: session } = useSession();
  if (!session) return <div />;

  return (
    <div>
      <div className="flex justify-center my-16 text-xl">
        <Link className="" href="/liked/posts">
          <div className="mx-2 py-2 text-[#868e96]">좋아한 글</div>
        </Link>
        <Link href="/liked/users">
          <div className="mx-2 py-2 text-black border-black border-b-2">
            좋아한 작성자
          </div>
        </Link>
      </div>
    </div>
  );
}
