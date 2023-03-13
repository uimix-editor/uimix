import { observer } from "mobx-react-lite";
import * as Dialog from "@radix-ui/react-dialog";
import { dialogState } from "../../state/DialogState";
import { action } from "mobx";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { IconButton } from "../../components/IconButton";
import { Input } from "../../components/Input";

export const ForeignComponentListDialog = observer(() => {
  const open = dialogState.foreignComponentListDialogOpen;

  const [urls, setUrls] = useState<string[]>([]);
  const [urlToAdd, setUrlToAdd] = useState<string>("");

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
          className="fixed w-fit h-fit bg-white
        -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2
        rounded-md shadow-xl p-4 text-xs
        w-[640px] min-h-[320px]
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
                className="block outline-0 w-full h-7 px-1.5 bg-macaron-uiBackground rounded focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base placeholder:text-macaron-disabledText"
                placeholder="URL"
                value={urlToAdd}
                onChange={(e) => {
                  setUrlToAdd(e.target.value);
                }}
              />
              <button
                className="h-fit bg-blue-500 hover:bg-blue-700 text-white py-1.5 px-3 rounded flex items-center gap-1"
                onClick={() => {
                  setUrls([...urls, urlToAdd]);
                  setUrlToAdd("");
                }}
              >
                Add
              </button>
            </div>
            <ul>
              {urls.map((url, i) => (
                <li className="flex justify-between items-center gap-2 h-7">
                  <p>{url}</p>
                  <IconButton
                    icon="material-symbols:remove"
                    onClick={() => {
                      setUrls(urls.filter((_, j) => j !== i));
                    }}
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
