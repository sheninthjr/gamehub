import { User } from "./User";

export class SocketManager {
  private static instance: SocketManager;
  private interestedUser: Map<string, User[]>;
  private userRoomMapping: Map<string, string>;

  constructor() {
    this.interestedUser = new Map<string, User[]>();
    this.userRoomMapping = new Map<string, string>();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SocketManager();
    return this.instance;
  }

  addUser(user: User, gameId: string) {
    this.interestedUser.set(gameId, [
      ...(this.interestedUser.get(gameId) || []),
      user,
    ]);
    this.userRoomMapping.set(user.userId, gameId);
  }

  broadcast(gameId: string, message: any) {
    const users = this.interestedUser.get(gameId);
    if (!users) {
      console.log("No user found");
      return;
    }
    users?.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(user: User) {
    const gameId = this.userRoomMapping.get(user.userId);
    if (!gameId) {
      console.log("User is not interested in any room");
      return;
    }
    const room = this.interestedUser.get(gameId);
    const remainingUsers = room?.filter((u) => u.userId !== user.userId) || [];
    this.interestedUser.set(gameId, remainingUsers);
    if (this.interestedUser.get(gameId)?.length === 0) {
      this.interestedUser.delete(gameId);
    }
    this.interestedUser.delete(user.userId);
  }
}
