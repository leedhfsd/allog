import Head from "next/head";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center font-bold h-[832px]">
      <Head>
        <title>회원가입을 환영합니다!</title>
        <meta
          name="description"
          content="Allog의 서비스를 이용하기 위한 회원가입 후 방문하는 페이지 입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog, 회원가입" />
      </Head>
      <p className="text-7xl my-32">Welcome!</p>
      <p className="text-2xl mt-4 mb-12">회원가입이 완료되었습니다!</p>
      <p className="text-xl">Allog를 이용하시려면 로그인해주세요❤</p>
    </div>
  );
}
