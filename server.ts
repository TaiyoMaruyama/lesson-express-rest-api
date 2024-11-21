const express = require("express");
const app = express();
const PORT = 3000;

app.get("/get", (_req: any, res: any) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
