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
        w-96
        "
        >
          <div className="flex justify-between items-center h-8 mb-2">
            <Dialog.Title className="font-bold">React Components</Dialog.Title>
            <Dialog.Close>
              <Icon icon="material-symbols:close" className="w-4 h-4" />
            </Dialog.Close>
          </div>
          <div>
            <div className="flex justify-between items-center gap-2 mb-2">
              <Input
                placeholder="URL"
                value={urlToAdd}
                onChange={(e) => {
                  setUrlToAdd(e.target.value);
                }}
              />
              <IconButton
                icon="material-symbols:add"
                onClick={() => {
                  setUrls([...urls, urlToAdd]);
                  setUrlToAdd("");
                }}
              />
            </div>
            <ul>
              {urls.map((url, i) => (
                <li className="flex justify-between items-center gap-2 h-8">
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
