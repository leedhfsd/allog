import Head from "next/head";

export default function Goodbye() {
  return (
    <div className="flex flex-col items-center font-bold h-[832px]">
      <Head>
        <title>회원탈퇴 | Allog</title>
        <meta
          name="description"
          content="Allog의 회원님들이 회원탈퇴 후 방문하는 페이지입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog, 회원탈퇴" />
      </Head>
      <p className="text-7xl my-32">감사합니다</p>
      <p className="text-2xl mt-4 mb-12">회원탈퇴가 완료되었습니다</p>
      <p className="text-xl">Allog를 이용해주셔셔 감사했습니다❤</p>
    </div>
  );
}
