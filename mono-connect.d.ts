declare module "@mono.co/connect.js" {
  interface MonoConnectSuccessResponse {
    code: string;
  }

  interface MonoConnectConfig {
    key: string;
    onSuccess: (response: MonoConnectSuccessResponse) => void;
    onClose?: () => void;
    onLoad?: () => void;
    onEvent?: (eventName: string, data: unknown) => void;
    reference?: string;
    scope?: string;
  }

  export default class MonoConnect {
    constructor(config: MonoConnectConfig);
    setup(): void;
    open(): void;
    reauthorise(accountId: string): void;
  }
}
