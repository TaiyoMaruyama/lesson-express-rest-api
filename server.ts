const express = require("express");
const app = express();
const PORT = 8080;

app.get("/get", (_req: any, res: any) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
