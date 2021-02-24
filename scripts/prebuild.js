const fs = require("fs");

if (fs.existsSync("src/constants/config.ts")) {
    process.exit(0);
}

fs.copyFileSync("src/constants/config.example.ts", "src/constants/config.ts");
console.log("Created configuration file.");