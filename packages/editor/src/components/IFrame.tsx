import React from "react";
import ReactDOM from "react-dom/client";

export const IFrame: React.FC<{
  init: (window: Window, iframe: HTMLIFrameElement) => React.ReactNode;
  className?: string;
}> = ({ init, className }) => {
  const onLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = event.currentTarget;
    const window = iframe.contentWindow;
    if (!window) {
      return;
    }

    console.log("load");

    const reactRoot = ReactDOM.createRoot(
      window.document.getElementById("root") as HTMLElement
    );

    reactRoot.render(
      <React.StrictMode>{init(window, iframe)}</React.StrictMode>
    );
  };

  return <iframe onLoad={onLoad} src="/iframe.html" className={className} />;
};

IFrame.displayName = "IFrame";
