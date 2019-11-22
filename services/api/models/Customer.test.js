const chai = require("chai");
const expect = chai.expect;

const customer = require("./Customer");

describe("Customer model", () => {
  it("should return error when requried ares are missing", done => {
    let Customer = new customer();

    Customer.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.ip).to.not.exist;
    });
    done();
  });

  it("should have optional fields", done => {
    let Customer = new customer({
      firstName: "loo",
      lastName: "chen",
      email: "foo@bar.com",
      ip: "1.1.1.1",
      latitude: 10,
      longitude: 100
    });

    done();
  });
});
