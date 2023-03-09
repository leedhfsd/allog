import Head from "next/head";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center font-bold h-[832px]">
      <Head>
        <title>404 | Allog</title>
        <meta
          name="description"
          content="Allog에서 제공하지 않는 페이지입니다."
        />
        <meta name="keywords" content="BLOG, 블로그, Allog" />
      </Head>
      <p className="text-9xl my-32">404</p>
      <p className="text-2xl mt-4 mb-12">Oops, page not found</p>
      <p className="text-xl">Sorry, but the requested page is not found.</p>
    </div>
  );
}
