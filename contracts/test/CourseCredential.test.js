const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CourseCredential", function () {
  let contract, owner, learner, other;

  beforeEach(async function () {
    [owner, learner, other] = await ethers.getSigners();
    const CourseCredential = await ethers.getContractFactory("CourseCredential");
    contract = await CourseCredential.deploy();
  });

  it("deploys with correct name and symbol", async function () {
    expect(await contract.name()).to.equal("DataAnalyticsCredential");
    expect(await contract.symbol()).to.equal("DAC");
  });

  it("owner can issue a credential", async function () {
    const tx = await contract.issueCertificate(
      learner.address,
      "dbt-101",
      "Intro to dbt",
      "ipfs://QmTest"
    );
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    const [addr, courseId, courseName, issuedAt, uri] = await contract.verifyCertificate(1);
    expect(addr).to.equal(learner.address);
    expect(courseId).to.equal("dbt-101");
    expect(courseName).to.equal("Intro to dbt");
    expect(uri).to.equal("ipfs://QmTest");
    expect(issuedAt).to.be.gt(0);
  });

  it("non-owner cannot issue a credential", async function () {
    await expect(
      contract.connect(other).issueCertificate(learner.address, "dbt-101", "Intro to dbt", "ipfs://QmTest")
    ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
  });

  it("cannot issue duplicate credential for same learner + course", async function () {
    await contract.issueCertificate(learner.address, "dbt-101", "Intro to dbt", "ipfs://QmTest");
    await expect(
      contract.issueCertificate(learner.address, "dbt-101", "Intro to dbt", "ipfs://QmTest2")
    ).to.be.revertedWith("Credential already issued for this course");
  });

  it("hasCredential returns true after issuance", async function () {
    expect(await contract.hasCredential(learner.address, "dbt-101")).to.equal(false);
    await contract.issueCertificate(learner.address, "dbt-101", "Intro to dbt", "ipfs://QmTest");
    expect(await contract.hasCredential(learner.address, "dbt-101")).to.equal(true);
  });

  it("transfer is blocked (soulbound)", async function () {
    await contract.issueCertificate(learner.address, "dbt-101", "Intro to dbt", "ipfs://QmTest");
    await expect(
      contract.connect(learner).transferFrom(learner.address, other.address, 1)
    ).to.be.revertedWith("Soulbound: credentials are non-transferable");
  });

  it("getCourseCredentials returns all tokens for a course", async function () {
    const [, learner2] = await ethers.getSigners();
    await contract.issueCertificate(learner.address, "dbt-101", "Intro to dbt", "ipfs://Qm1");
    await contract.issueCertificate(learner2.address, "dbt-101", "Intro to dbt", "ipfs://Qm2");
    const tokens = await contract.getCourseCredentials("dbt-101");
    expect(tokens.length).to.equal(2);
  });
});
