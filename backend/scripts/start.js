const { exec } = require('child_process');
const process = require("process");

exec('node scripts/seed.js', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error executing seed script: ${stderr}`);
    process.exit(1);
  }
  console.log(`Seed script output: ${stdout}`);


  const app = exec('node index.js');

  app.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  app.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  app.on('exit', (code) => {
    console.log(`App process exited with code ${code}`);
  });
});
