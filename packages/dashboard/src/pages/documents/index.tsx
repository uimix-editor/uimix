import { Icon } from "@iconify/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { toastController } from "../../components/toast/ToastController";
import Router from "next/router";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { getDesktopAPI, LocalDocument } from "../../types/DesktopAPI";
TimeAgo.addDefaultLocale(en);

// TODO: move to layout?
const Header = () => {
  const session = useSession().data;

  return (
    <div className="border-b border-neutral-200 relative">
      <div className="max-w-[960px] h-10 mx-auto flex items-center justify-end">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="outline-none">
              <img
                className="rounded-full"
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? undefined}
                width={28}
                height={28}
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
                  signOut({
                    callbackUrl: "/",
                  });
                }}
                className="hover:bg-blue-500 rounded px-4 py-1 hover:text-white outline-none"
              >
                Sign Out
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 border-gray-200 border-t" />
              <DropdownMenu.Item
                className="hover:bg-blue-500 rounded px-4 py-1 hover:text-white outline-none"
                onClick={() => {
                  signIn("github", {
                    callbackUrl: "/documents",
                  });
                }}
              >
                Connect GitHub
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="hover:bg-blue-500 rounded px-4 py-1 hover:text-white outline-none"
                onClick={() => {
                  signIn("google", {
                    callbackUrl: "/documents",
                  });
                }}
              >
                Connect Google
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

const DocumentCard = ({
  document,
}: {
  document:
    | {
        type: "cloud";
        data: {
          id: string;
          title: string;
          updatedAt: string;
        };
      }
    | {
        type: "local";
        data: LocalDocument;
      };
}) => {
  const documentDeleteMutation = trpc.document.delete.useMutation();

  return (
    <li>
      <Link
        href={`/documents/${document.data.id}`}
        className="block border border-gray-200 rounded-lg hover:bg-gray-50 overflow-hidden"
      >
        <div className="aspect-video w-full bg-gray-100" />
        <div className="p-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-900 font-medium mb-1">
              {document.data.title}

              {document.type === "local" && (
                <span className="text-xs text-amber-600 ml-2 bg-amber-100 p-0.5 px-1 rounded">
                  Local
                </span>
              )}
            </div>
            <div className="text-gray-500">
              Edited{" "}
              {new TimeAgo("en-US").format(Date.parse(document.data.updatedAt))}
            </div>
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
                    onClick={async () => {
                      const ok = confirm(
                        "Are you sure you want to delete this document?"
                      );
                      if (ok) {
                        try {
                          await documentDeleteMutation.mutateAsync({
                            id: document.data.id,
                          });
                        } catch (err) {
                          toastController.show({
                            type: "error",
                            message: "Failed to delete document",
                          });
                        }
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
  );
};

export default function Documents() {
  const documents = trpc.document.all.useQuery();
  const documentCreateMutation = trpc.document.create.useMutation();

  const onAddClick = async () => {
    try {
      const doc = await documentCreateMutation.mutateAsync({
        title: "New document",
      });
      Router.push(`/documents/${doc.id}`);
    } catch (err) {
      toastController.show({
        type: "error",
        message: "Failed to create document",
      });
    }
  };

  const isError = documents.status === "error";

  useEffect(() => {
    if (isError) {
      toastController.show({
        type: "error",
        message: "Failed to load documents",
      });
    }
  }, [isError]);

  const [localDocuments, setLocalDocuments] = useState<LocalDocument[]>([]);
  useEffect(() => {
    getDesktopAPI()
      ?.getLocalDocuments()
      .then((docs) => {
        setLocalDocuments(docs);
      });
  }, []);

  console.log(localDocuments);

  return (
    <>
      <Head>
        <title>Documents</title>
      </Head>
      <div className="text-xs">
        <Header />
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
                <DocumentCard
                  key={document.id}
                  document={{ type: "cloud", data: document }}
                />
              ))}
              {localDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={{
                    type: "local",
                    data: doc,
                  }}
                />
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}
