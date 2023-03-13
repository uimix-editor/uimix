import { makeAutoObservable } from "mobx";

export type ToastMessage = {
  type: "error" | "success" | "info" | "warning" | "processing";
  message: string;
};

class ToastController {
  constructor() {
    makeAutoObservable(this);
  }

  message: ToastMessage = {
    type: "info",
    message: "",
  };
  visible = false;

  show(message: ToastMessage) {
    this.message = message;
    this.visible = true;
  }
}

export const toastController = new ToastController();
