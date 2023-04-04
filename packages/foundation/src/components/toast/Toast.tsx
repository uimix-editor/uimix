import { Icon } from "@iconify/react";
import * as Toast from "@radix-ui/react-toast";
import { observer } from "mobx-react-lite";
import { toastController } from "./ToastController";
import styles from "./Toast.module.css";

export const ToastPresenter: React.FC = observer(() => {
  // TODO: more message types

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        duration={3000}
        className={`
        fixed bottom-10 left-0 right-0 w-fit mx-auto z-50 bg-red-500 text-red-500 rounded-full px-1 text-xs outline-none shadow-xl
        ${styles.ToastRoot}
        `}
        open={toastController.visible}
        onOpenChange={(open) => {
          toastController.visible = open;
        }}
      >
        <Toast.Title className="flex items-center gap-2 p-2 text-xs">
          <div className="bg-white p-1 rounded-full">
            <Icon
              icon="material-symbols:priority-high-rounded"
              className="text-base"
            />
          </div>
          <span className="text-white font-medium">
            {toastController.message.message}
          </span>
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
});
