export type MessageToCode =
  | {
      type: "copy-nodes";
    }
  | {
      type: "paste-nodes";
      data: string;
    }
  | {
      type: "notify";
      message: string;
    };

export type MessageToUI = {
  type: "copy-data";
  data: string;
};
