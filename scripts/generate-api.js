const { execSync } = require("child_process");

console.log("Generating API started...");

const apis = [
  {
    name: "base",
    url: "https://demozoonest.pagekite.me/openapi.json",
  },
  {
    name: "nima",
    url: "https://zoonestmac.pagekite.me/openapi.json",
  },
];

function generateAPI() {
  for (const api of apis) {
    try {
      console.log(`Generating ${api.name} API...`);
      console.log(api.url);

      execSync(
        `npx openapi-generator-cli generate -i ${api.url} -o src/lib/api/${api.name}/ -g typescript-axios --additional-properties=supportsES6=true,npmVersion=6.9.0,typescriptThreePlus=true`,
        { stdio: "inherit" }
      );

      console.log(`✅ ${api.name} API generated`);
    } catch (e) {
      console.error(`❌ Failed generating ${api.name}`);
      process.exit(1);
    }
  }
}

generateAPI();
console.log("Generating API ended...");
