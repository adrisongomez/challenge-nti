import type { PrismaClient } from "@prisma/client";

export interface CRUDbase<T, C = {}, U = {}, F = {}> {
  findById(id: string): Promise<T>;
  create(payload: C): Promise<T>;
  update(id: string, payload: U): Promise<T>;
  delete(id: string): Promise<boolean>;
  list(filter?: F): Promise<T[]>;
}

export abstract class Controller {
  private _client: PrismaClient;
  private _user: string;
  constructor(client: PrismaClient, user: string = 'system') {
    this._client = client;
    this._user = user;
  }

  get client() {
    if (this._client) {
      return this._client;
    }
    throw Error("Client is not initialized");
  }

  get user (){
        return this._user;
    }
}
