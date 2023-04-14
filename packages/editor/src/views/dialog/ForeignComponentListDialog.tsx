import { observer } from "mobx-react-lite";
import * as Dialog from "@radix-ui/react-dialog";
import { dialogState } from "../../state/DialogState";
import { action } from "mobx";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { IconButton } from "@uimix/foundation/src/components";
import { projectState } from "../../state/ProjectState";
import { z } from "zod";

export const ForeignComponentListDialog = observer(() => {
  const open = dialogState.foreignComponentListDialogOpen;

  const urls = [...projectState.project.componentURLs];
  const [urlToAdd, setUrlToAdd] = useState("");
  const isURLValid = z.string().url().safeParse(urlToAdd).success;
  console.log(isURLValid);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={action((open) => {
        dialogState.foreignComponentListDialogOpen = open;
      })}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content
          className="fixed bg-white
        -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2
        rounded-md shadow-xl p-4 text-xs
        w-[40rem] min-h-[20rem]
        "
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="font-semibold">
              React Components
            </Dialog.Title>
            <Dialog.Close>
              <Icon icon="material-symbols:close" className="w-4 h-4" />
            </Dialog.Close>
          </div>
          <div>
            <div className="flex justify-between items-center gap-2 mb-2">
              <input
                className="block outline-0 w-full h-7 px-1.5 bg-macaron-uiBackground rounded focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base placeholder:text-macaron-disabledText aria-invalid:ring-red-500"
                placeholder="JS/CSS URL"
                aria-invalid={urlToAdd.length > 0 && !isURLValid}
                value={urlToAdd}
                onChange={(e) => {
                  setUrlToAdd(e.target.value);
                }}
              />
              <button
                className="h-fit bg-blue-500 hover:bg-blue-700 disabled:bg-neutral-300 text-white py-1.5 px-3 rounded flex items-center gap-1 disabled:cursor-not-allowed"
                disabled={!isURLValid}
                onClick={action(() => {
                  projectState.project.componentURLs.push([urlToAdd]);
                  setUrlToAdd("");
                })}
              >
                Add
              </button>
            </div>
            <ul>
              {urls.map((url, i) => (
                <li className="flex justify-between items-center gap-2 py-1.5">
                  <p>{url}</p>
                  <IconButton
                    icon="material-symbols:remove"
                    onClick={action(() => {
                      projectState.project.componentURLs.delete(i);
                    })}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

ForeignComponentListDialog.displayName = "ForeignComponentListDialog";
