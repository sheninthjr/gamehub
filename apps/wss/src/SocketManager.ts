export class SocketManager {
  public static instance: SocketManager;
  constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SocketManager();
    return this.instance;
  }
}
