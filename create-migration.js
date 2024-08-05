const { exec } = require("child_process");
const name = process.argv[2];

if (!name) {
  console.error("Please provide a name for the migration: npm run typeorm:migration:create <name>");
  process.exit(1);
}

const command = `npx typeorm-ts-node-commonjs migration:create ./src/migrations/${name}`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${stderr}`);
    process.exit(1);
  } else {
    console.log(stdout);
  }
});