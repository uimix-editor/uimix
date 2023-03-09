import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
      <Head>
        <title>Documents</title>
      </Head>
      <div className="text-xs">
        <div className="border-b border-neutral-200 relative">
          <div className="max-w-[960px] h-10 mx-auto flex items-center justify-end">
            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Sign out
            </button>
          </div>
        </div>
        <main className="px-4 pb-8">
          <div className="max-w-[960px] mx-auto">
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
            <ul className="grid grid-cols-3 gap-4">
              {documents.data?.map((document) => (
                <li key={document.id}>
                  <Link
                    href={`/documents/${document.id}`}
                    className="block border border-gray-200 rounded-lg"
                  >
                    <div className="aspect-video w-full bg-gray-100" />
                    <div className="p-4 flex justify-between">
                      <div>
                        <div className="text-sm text-gray-900 font-medium mb-1">
                          {document.title}
                        </div>
                        <div className="text-gray-500">Edited 3 days ago</div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-2 hover:bg-gray-100 aria-expanded:bg-gray-100 rounded outline-none">
                              <Icon
                                icon="material-symbols:more-vert"
                                className="text-base"
                              />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              sideOffset={4}
                              className="bg-white border border-gray-200 rounded-lg p-1 text-xs outline-none shadow-xl"
                            >
                              <DropdownMenu.Item
                                onClick={() => {
                                  const ok = confirm(
                                    "Are you sure you want to delete this document?"
                                  );
                                  if (ok) {
                                    // TODO
                                  }
                                }}
                                className="hover:bg-blue-500 rounded px-4 py-1 hover:text-white outline-none text-red-500"
                              >
                                Delete...
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}
