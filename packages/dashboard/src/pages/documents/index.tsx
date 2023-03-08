import Link from "next/link";
import { trpc } from "../../utils/trpc";

export default function Documents() {
  const documents = trpc.document.all.useQuery();
  const documentCreateMutation = trpc.document.create.useMutation();

  const onAddClick = async () => {
    await documentCreateMutation.mutateAsync({
      title: "New document",
    });
    documents.refetch();
  };

  return (
    <>
      <h1>Documents</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onAddClick}
      >
        Add
      </button>
      <ul>
        {documents.data?.map((document) => (
          <li key={document.id}>
            <Link href={`/documents/${document.id}`}>{document.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
