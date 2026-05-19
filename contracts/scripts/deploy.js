const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const CourseCredential = await ethers.getContractFactory("CourseCredential");
  const contract = await CourseCredential.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CourseCredential deployed to:", address);

  // Write address + ABI to frontend for easy import
  const artifact = await ethers.getContractFactory("CourseCredential");
  const abi = JSON.parse(artifact.interface.formatJson());

  const output = {
    address,
    abi,
    network: (await ethers.provider.getNetwork()).name,
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "../../frontend/lib");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "contract-deployment.json"),
    JSON.stringify(output, null, 2)
  );
  console.log("Deployment info written to frontend/lib/contract-deployment.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
