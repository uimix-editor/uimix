type MessageData =
  | { type: "call"; callID: number; name: string; args: any[] }
  | {
      type: "result";
      callID: number;
      status: "success" | "error";
      value: any;
    };

export interface Target {
  post(data: MessageData): void;
  subscribe(handler: (data: MessageData) => void): () => void;
}

export class RPC<Remote, Self> {
  constructor(target: Target, handler: Self) {
    this.disposeHandler = target.subscribe(async (data) => {
      if (data.type === "call") {
        try {
          const result = await (handler as any)[data.name](...data.args);
          target.post({
            type: "result",
            callID: data.callID,
            status: "success",
            value: result,
          });
        } catch (error) {
          target.post({
            type: "result",
            callID: data.callID,
            status: "error",
            value: String(error),
          });
        }
      } else {
        const resolver = this.resolvers.get(data.callID);
        if (resolver) {
          if (data.status === "error") {
            resolver.reject(data.value);
          } else {
            resolver.resolve(data.value);
          }
          this.resolvers.delete(data.callID);
        }
      }
    });

    this.remote = new Proxy(
      {},
      {
        get: (_, name: string) => {
          return (...args: any[]) => {
            return new Promise((resolve, reject) => {
              const callID = Math.random();
              this.resolvers.set(callID, { resolve, reject });
              target.post({ type: "call", callID, name, args });
            });
          };
        },
      }
    ) as Remote;
  }

  readonly remote: Remote;
  private resolvers = new Map<
    number,
    {
      resolve: (value: unknown) => void;
      reject: (error: unknown) => void;
    }
  >();
  private disposeHandler: () => void;

  dispose() {
    this.disposeHandler();
  }
}
