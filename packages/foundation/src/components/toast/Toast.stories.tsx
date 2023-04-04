import React from "react";
import { ToastPresenter } from "./Toast";
import { toastController } from "./ToastController";

export default {
  title: "Toast",
};

export const Basic: React.FC = () => {
  const onClick = () => {
    toastController.show({
      type: "error",
      message: "Example error message",
    });
  };

  return (
    <>
      <ToastPresenter />
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={onClick}
      >
        Show toast
      </button>
    </>
  );
};
