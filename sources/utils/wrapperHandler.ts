import { Controller } from "@controllers/base";
import { NextApiRequest, NextApiResponse } from "next";

type HandlerFunction<T extends Controller | any> = (
  request: NextApiRequest,
  response: NextApiResponse,
  controller?: T
) => Promise<void> | void;

interface HandlerWrapperOptions<T extends Controller | any> {
  onPut?: HandlerFunction<T>;
  onPost?: HandlerFunction<T>;
  onDelete?: HandlerFunction<T>;
  onGet?: HandlerFunction<T>;
  controller?: T;
}

class HandlerError extends Error {}

enum HttpMethod {
    POST="POST",
    GET="GET",
    PUT="PUT",
    DELETE="DELETE"
}

export const createHandlerWrapper =
  <T extends Controller | any>(options: HandlerWrapperOptions<T> = {}) =>
  async (request: NextApiRequest, response: NextApiResponse) => {
    try {
      switch (request.method) {
        case HttpMethod.POST:
          if (!options.onPost) {
            throw new HandlerError("POST method not allow on this route");
          }
          await options.onPost(request, response, options.controller);
          break;
        case HttpMethod.GET:
          if (!options.onGet) {
            throw new HandlerError("GET method not allow on this route");
          }
          await options.onGet(request, response, options.controller);
          break;
        case HttpMethod.PUT:
          if (!options.onPut) {
            throw new HandlerError("PUT method not allow on this route");
          }
          await options.onPut(request, response, options.controller);
          break;
        case HttpMethod.DELETE:
          if (!options.onDelete) {
            throw new HandlerError("DELETE method not allow on this route");
          }
          await options.onDelete(request, response, options.controller);
          break;
        default:
          throw new HandlerError(
            `${request.method} mothod not support for this routes`
          );
      }
    } catch (error) {
      if (typeof error === typeof new HandlerError()) {
        response.status(404).json({ errors: [(error as HandlerError).message] });
      }
    }
  };
