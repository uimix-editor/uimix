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
      data: string;
    };

export type MessageToUI = {
  type: "copy-data";
  data: string;
};
