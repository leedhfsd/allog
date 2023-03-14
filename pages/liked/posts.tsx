import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Like() {
  const { data: session } = useSession();
  console.log(session);
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
    </div>
  );
}
