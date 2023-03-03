export type InsertMode =
  | {
      type: "frame";
    }
  | {
      type: "text";
    }
  | {
      type: "image";
      dataURL: string;
    };
