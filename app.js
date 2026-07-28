const http = require("http");
const next = require("next");

const dev = false;

const app = next({
  dev,
  dir: __dirname,
});

const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, host, () => {
      console.log(`Next.js démarré sur ${host}:${port}`);
    });
});