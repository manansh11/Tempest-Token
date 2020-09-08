const Token = artifacts.require("MyToken");

var chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

//Import value from .env file
require("dotenv").config({ path: "../.env" });

contract("Token Test", function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;

  it("there shouldnt be any coins in my account", async () => {
    let instance = await Token.deployed();
    expect(
      instance.balanceOf.call(initialHolder)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  beforeEach(async () => {
    //Reads from .ENV FILE
    this.myToken = await Token.new(process.env.INITIAL_TOKENS);
  });

  it("All tokens should be in my account", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    //old style:
    //let balance = await instance.balanceOf.call(initialHolder);
    //assert.equal(balance.valueOf(), 0, "Account 1 has a balance");
    //condensed, easier readable style:
    expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);

    // NEW ADD
    return expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("I can send tokens from Account 1 to Account 2", async () => {
    const sendTokens = 1;
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
    expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
    expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(
      new BN(sendTokens)
    );

    // NEW ADD
    return expect(
      instance.balanceOf(recipient)
    ).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  });

  it("It's not possible to send more tokens than account 1 has", async () => {
    let instance = this.myToken;
    let balanceOfAccount = await instance.balanceOf(initialHolder);
    expect(instance.transfer(recipient, new BN(balanceOfAccount + 1))).to
      .eventually.be.rejected;

    //check if the balance is still the same
    expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(balanceOfAccount);
    // NEW ADD
    return expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(balanceOfAccount);
  });
});
