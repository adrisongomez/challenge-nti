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
  constructor(client: PrismaClient) {
    this._client = client;
  }

  get client() {
    if (this._client) {
      return this._client;
    }
    throw Error("Client is not initialized");
  }
}
