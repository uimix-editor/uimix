export type InsertMode =
  | {
      type: "frame";
    }
  | {
      type: "text";
    }
  | {
      type: "image";
      hash: string;
    };
