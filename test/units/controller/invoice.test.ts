import InvoiceController from "@controllers/invoices";
import { CreateInvoice } from "@controllers/invoices/utils";
import { prismaMock } from "@test/mockPrisma";
describe("InvoiceController unit happy path", () => {
  let controller: InvoiceController;
  beforeAll(() => {
    controller = new InvoiceController(prismaMock);
  });
  it("should create an invoice and its line item", () => {
    const payload: CreateInvoice = {};
  });
});
