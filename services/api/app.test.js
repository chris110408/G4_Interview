const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");
const request = require("supertest");
let app = rewire("./app");
const sandbox = sinon.createSandbox();

describe("app", () => {
  afterEach(() => {
    sandbox.restore();
  });
  context("GET /api/users", () => {
    it("should work", done => {
      request(app)
        .get("/api/users")
        .expect(200)
        .end((err, response) => {
          expect(response.body)
            .to.have.property("name")
            .to.equal("John Doe");
          done(err);
        });
    });

    it("should fail when mockData is null", done => {
      app.__set__("userMockData", null);
      request(app)
        .get("/api/users")
        .expect(400)
        .end((err, response) => {
          done(err);
        });
    });
  });

  context("GET /api/mock_customers", () => {
    it("should works", done => {
      request(app)
        .get("/api/mock_customers")
        .expect(200)
        .end((err, response) => {
          expect(response.body.length).to.equal(2000);
          done(err);
        });
    });

    it("should fail when mockData is null", done => {
      app.__set__("customerMockData", null);
      request(app)
        .get("/api/mock_customers")
        .expect(400)
        .end((err, response) => {
          // expect(errorStub).to.have.been.calledOnce;
          done(err);
        });
    });
  });
});
