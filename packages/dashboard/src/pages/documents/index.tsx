import { Icon } from "@iconify/react";
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
    <div className="text-xs">
      <div className="h-10 border-b border-neutral-200 relative flex items-center justify-end px-4"></div>
      <main className="max-w-[960px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-lg py-8">Documents</h1>
          <button
            className="h-fit bg-blue-500 hover:bg-blue-700 text-base text-white py-1 px-3 rounded flex items-center gap-1"
            onClick={onAddClick}
          >
            <Icon icon="material-symbols:add" />
            Add
          </button>
        </div>
        <ul className="grid grid-cols-3 gap-8">
          {documents.data?.map((document) => (
            <li key={document.id}>
              <Link
                href={`/documents/${document.id}`}
                className="block border border-gray-200 rounded-lg"
              >
                <div className="aspect-video w-full bg-gray-100" />
                <div className="p-4">
                  <div className="text-sm text-gray-900 font-medium mb-1">
                    {document.title}
                  </div>
                  <div className="text-gray-500">Edited 3 days ago</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
