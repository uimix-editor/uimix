import { observer } from "mobx-react-lite";
import * as Dialog from "@radix-ui/react-dialog";
import { dialogState } from "../../state/DialogState";
import { action } from "mobx";

export const ForeignComponentListDialog = observer(() => {
  const open = dialogState.foreignComponentListDialogOpen;

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
        "
        >
          <Dialog.Title className="font-bold">React Components</Dialog.Title>
          <Dialog.Description />
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

ForeignComponentListDialog.displayName = "ForeignComponentListDialog";
