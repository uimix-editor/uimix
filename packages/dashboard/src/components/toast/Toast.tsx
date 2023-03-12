import { Icon } from "@iconify/react";
import * as Toast from "@radix-ui/react-toast";
import { observer } from "mobx-react-lite";
import { toastController } from "./ToastController";

export const ToastPresenter: React.FC<{}> = observer(() => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        duration={3000}
        className={`
        fixed bottom-10 left-0 right-0 w-fit mx-auto z-50 bg-white border border-gray-200 rounded-full px-2 text-xs outline-none shadow-xl
        opacity-0 data-[state=open]:opacity-100 transition-opacity
        `}
        open={toastController.visible}
        onOpenChange={(open) => {
          toastController.visible = open;
        }}
      >
        <Toast.Title className="flex items-center gap-2 p-2">
          <div className="bg-red-500 p-1 rounded-full">
            <Icon
              icon="tabler:exclamation-mark"
              className="text-white text-base"
            />
          </div>
          {toastController.message.message}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
});
