import { MessageToCode, MessageToUI } from "../types/message";

let textToCopy = "";

window.addEventListener("message", (e) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const msg = e.data.pluginMessage as MessageToUI;

  switch (msg.type) {
    case "copy-data": {
      textToCopy = msg.data;
      document.execCommand("copy");
      postPluginMessage({
        type: "notify",
        data: "Copied to clipboard. Paste in Macaron",
      });
      break;
    }
  }
});

document.addEventListener("copy", (e) => {
  if (textToCopy) {
    e.preventDefault();
    e.clipboardData?.setData("text/plain", textToCopy);
    textToCopy = "";
  }
});

function postPluginMessage(pluginMessage: MessageToCode): void {
  parent.postMessage({ pluginMessage }, "*");
}

const App: React.FC = () => {
  const onCopyButtonClick = () => {
    postPluginMessage({
      type: "copy-nodes",
    });
  };
  const onPasteButtonClick = () => {
    postPluginMessage({
      type: "notify",
      data: "Paste not implemented yet",
    });
  };

  return (
    <div className="p-2 flex gap-2 text-xs">
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded-md"
        onClick={onCopyButtonClick}
      >
        Copy
      </button>
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded-md"
        onClick={onPasteButtonClick}
      >
        Paste
      </button>
    </div>
  );
};

export default App;
