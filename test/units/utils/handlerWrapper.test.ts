import { Controller } from "@controllers/base";
import { prismaMock } from "@test/mockPrisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse, MockResponse } from "node-mocks-http";
import { createHandlerWrapper } from "sources/utils/handlerWrapper";

let request: NextApiRequest;
let response: NextApiResponse;
beforeEach(() => {
  request = createRequest<NextApiRequest>();
  response = createResponse<NextApiResponse>();
});

describe("Handler Wrapper unit test, happy path", () => {
  it.each([
    ["GET", "onGet"],
    ["POST", "onPost"],
    ["PUT", "onPut"],
    ["DELETE", "onDelete"],
  ])("should run a %s request", async (method: string, key: string) => {
    request.method = method;
    const httpResponse = { data: "this is a test" };
    const handler = createHandlerWrapper({
      // @ts-nocheck
      [key]: (_: NextApiRequest, res: NextApiResponse) => {
        res.json(httpResponse);
      },
    });
    await handler(request, response);
    const result = (response as MockResponse<NextApiResponse>)._getJSONData();
    expect(result.data).toBe(httpResponse.data);
  });

  it("should get a controller methods", async () => {
    request.method = "GET";
    const httpResponse = { data: "this is a test" };
    class MockController extends Controller {
      testFunction() {
        return httpResponse;
      }
    }
    const handler = createHandlerWrapper<MockController>({
      onGet: (_, res, controller) => {
        res.json(controller?.testFunction());
      },
      controller: new MockController(prismaMock),
    });
    await handler(request, response);
    const result = (response as MockResponse<NextApiResponse>)._getJSONData();
    expect(result.data).toBe(httpResponse.data);
  });
});

describe("Handler Wrapper unit test fails path", () => {
  it("should return an error message when the method has not handler function", async () => {
    request.method = "PATCH";
    const handler = createHandlerWrapper();
    await handler(request, response);
    const result = (response as MockResponse<NextApiResponse>)._getJSONData();
    expect(result?.errors).toBeDefined();
  });

  it("should return an error message when the method is not being set", async () => {
    request.method = "GET";
    const handler = createHandlerWrapper();
    await handler(request, response);
    const result = (response as MockResponse<NextApiResponse>)._getJSONData();
    expect(result?.errors).toBeDefined();
    })
});
