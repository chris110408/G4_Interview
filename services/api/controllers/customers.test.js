const EventEmitter = require("events");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");
const mongoose = require("mongoose");
const httpMocks = require("node-mocks-http");
let customers = rewire("./customers");
let Customer = require("../models/Customer");

const sandbox = sinon.createSandbox();

describe("Customers Controller", async () => {
  let findByIdStub;
  let sampleCustomer;
  let findStub;
  let sortStub;
  let findByIdAndUpdateStub;
  let findByIdAndRemoveStub;
  let mockResponse;
  beforeEach(async () => {
    sampleCustomer = {
      id: 123,
      firstName: "loo",
      lastName: "chen",
      email: "foo@bar.com",
      ip: "1.1.1.1",
      latitude: 10,
      longitude: 100
    };

    Customers = [
      {
        id: 1,
        firstName: "a",
        lastName: "chen",
        date: new Date(1552261496281)
      },
      {
        id: 2,
        firstName: "b",
        lastName: "chen",
        date: new Date(1552261496282)
      },
      {
        id: 3,
        firstName: "c",
        lastName: "chen",
        date: new Date(1552261496283)
      }
    ];
    findByIdAndUpdateStub = sandbox
      .stub(mongoose.Model, "findByIdAndUpdate")
      .resolves(sampleCustomer);

    findByIdAndRemoveStub = sandbox
      .stub(mongoose.Model, "findByIdAndRemove")
      .resolves(sampleCustomer);
    findByIdStub = sandbox
      .stub(mongoose.Model, "findById")
      .resolves(sampleCustomer);
    sortStub = sandbox.stub().resolves(Customers);
    findStub = sandbox.stub(mongoose.Model, "find").returns({ sort: sortStub });
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      query: {}
    });

    mockResponse = httpMocks.createResponse();
    await customers.index(mockRequest, mockResponse);
  });

  afterEach(() => {
    sandbox.restore();
    customers = rewire("./customers");
  });

  context("getCustomers", () => {
    it("should get sorted customers", async () => {
      let data = mockResponse._getJSONData();
      expect(data.length).to.equal(3);
    });

    it("should call find", async () => {
      expect(findStub).to.have.been.called;
    });

    it("should sort Customer", async () => {
      expect(sortStub).to.have.been.called;
      expect(sortStub).to.have.been.calledWith({ date: -1 });
    });
  });
  context("newCustomer", () => {
    let FakeCustomerClass, saveStub, mockResponse;

    beforeEach(async () => {
      saveStub = sandbox.stub().resolves(sampleCustomer);
      FakeCustomerClass = sandbox.stub().returns({ save: saveStub });
      customers.__set__("Customer", FakeCustomerClass);
      const mockRequest = httpMocks.createRequest({
        method: "POST",
        body: sampleCustomer
      });

      mockResponse = httpMocks.createResponse();
      await customers.newCustomer(mockRequest, mockResponse);
    });

    it("should create a customer ", async () => {
      let data = mockResponse._getJSONData();

      Object.keys(sampleCustomer).map(i => {
        expect(data)
          .to.have.property(`${i}`)
          .to.equal(sampleCustomer[`${i}`]);
      });
    });

    it("should call Customer with new", async () => {
      expect(FakeCustomerClass).to.have.been.calledWithNew;
      expect(FakeCustomerClass).to.have.been.calledWith(sampleCustomer);
    });

    it("should save the Customer", async () => {
      expect(saveStub).to.have.been.called;
    });
  });
  context("getCustomer", async () => {
    it("should get a customer by using id", async () => {
      const mockRequest = httpMocks.createRequest({
        method: "GET",
        params: {
          customerId: 123
        }
      });

      let mockResponse = httpMocks.createResponse();
      await customers.getCustomer(mockRequest, mockResponse);
      let data = mockResponse._getJSONData();

      Object.keys(sampleCustomer).map(i => {
        expect(data)
          .to.have.property(`${i}`)
          .to.equal(sampleCustomer[`${i}`]);
      });
    });
  });

  context("replaceCustomer", async () => {
    it("should replace customer by using id", async () => {
      const mockRequest = httpMocks.createRequest({
        method: "put",
        params: {
          customerId: 123
        },
        body: sampleCustomer
      });

      let mockResponse = httpMocks.createResponse();
      await customers.replaceCustomer(mockRequest, mockResponse);
      let data = mockResponse._getJSONData();

      expect(data)
        .to.have.property("success")
        .to.equal(true);
    });
  });

  context("updateCustomer", async () => {
    let mockResponse;
    let mockRequest;
    beforeEach(async () => {
      mockRequest = httpMocks.createRequest({
        method: "patch",
        params: {
          customerId: 123
        },
        body: sampleCustomer
      });

      mockResponse = httpMocks.createResponse();
    });

    it("should update customer by using id", async () => {
      await customers.updateCustomer(mockRequest, mockResponse);
      let data = mockResponse._getJSONData();

      expect(data)
        .to.have.property("success")
        .to.equal(true);
    });
    it("should catch error if there is one", async () => {
      sandbox.restore();
      sandbox
        .stub(mongoose.Model, "findByIdAndUpdate")
        .rejects(new Error("fake"));
      await customers.updateCustomer(mockRequest, mockResponse);
      let data = mockResponse._getJSONData();
      expect(data)
        .to.have.property("success")
        .to.equal(false);
    });
  });

  context("deleteCustomer", async () => {
    let mockResponse;
    let mockRequest;
    beforeEach(async () => {
      mockRequest = httpMocks.createRequest({
        method: "delete",
        params: {
          customerId: 123
        }
      });

      mockResponse = httpMocks.createResponse();
      await customers.deleteCustomer(mockRequest, mockResponse);
    });

    it("should delete Customer by using id", async () => {
      let data = mockResponse._getJSONData();

      expect(data)
        .to.have.property("success")
        .to.equal(true);
    });
    it("should call findByIdAndRemove", async () => {
      expect(findByIdAndRemoveStub).to.have.been.calledOnce;
    });
  });
});
