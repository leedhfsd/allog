import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Article } from "../../interfaces";

function Post({
  data,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const articles = data as Article[];
  const slugs = slug as string[];
  if (slugs.length === 1) {
    return (
      <div className="flex flex-col justify-center py-24 items-center">
        <div className="flex flex-row items-center mb-8">
          <img
            className="rounded-full mr-6"
            src={articles[articles.length - 1].profile}
            width={128}
            height={128}
            alt="user_profile"
          />
          <div className="text-2xl font-bold">{articles[0].writer}</div>
        </div>
        <div>
          <p className="text-xl font-bold text-sky-700">
            {articles[0].writer}의 포스트를 확인하세요.
          </p>
          <hr className="border-b-2 my-4 border-sky-700 w-full" />
        </div>
        {articles.map((article) => (
          <div className="cursor-pointer my-16" key={article._id}>
            <Link
              as={`/article/@${article.writer}/${article._id}/${article.slug}`}
              href={{
                pathname: `/article/@${article.writer}/${article._id}/${article.slug}`,
                query: {
                  ...article,
                },
              }}
            >
              <div className="">
                <img
                  alt="sample"
                  className="rounded-md inline-block"
                  src="/sample.gif"
                />
                <h1 className="text-2xl font-bold my-1 truncate">
                  {article.title}
                </h1>
                <p className="text-base mb-4 line_clamp h-8">
                  {article.content}
                </p>
                <div>
                  {article.hashtag.map((item) => {
                    return (
                      <a
                        key={item}
                        href={`article/${item}`}
                        className="text-sky-500 px-1 mx-2 my-4 cursor-pointer inline-block text-base"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
                <div className="truncate text-sm text-gray-400">
                  {article.createdAt}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  let writer = "";
  let id = "";
  let res: Response | undefined;
  if (slug && slug[0]) {
    writer = slug[0].substring(1);
    res = await fetch(`${process.env.BASE_URL}/api/article/${writer}`);
  }
  if (slug && slug[1]) {
    [writer, id] = [slug[0].substring(1), slug[1]];
    res = await fetch(`${process.env.BASE_URL}/api/article/${writer}/${id}`);
  }
  if (res && res.status !== 200) {
    return {
      notFound: true,
    };
  }
  if (res && res.status === 200) {
    const data = (await res.json()) as Article[];
    return {
      props: {
        data,
        slug,
      },
    };
  }
  return {
    props: {},
  };
};

export default Post;
