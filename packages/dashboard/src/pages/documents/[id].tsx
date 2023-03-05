import { useRouter } from "next/router";

const Document = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  return (
    <iframe
      className="fixed inset-0 w-full h-full"
      src="http://localhost:5173"
    />
  );
};

export default Document;
