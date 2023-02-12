import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Article } from "../../interfaces";

function Post({
  data,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <div>{data}</div>
      <div>{slug}</div>
    </div>
  );
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
