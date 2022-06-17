export type MessageToPlugin =
  | {
      type: "copy";
    }
  | {
      type: "notify";
      data: string;
    };

export type MessageToUI =
  | {
      type: "copy";
      data: string;
    }
  | {
      type: "selectionChange";
      count: number;
    };
