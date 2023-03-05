import { useRouter } from "next/router";

const Document = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Document: {id}</p>;
};

export default Document;
