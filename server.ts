const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;

const demoUsers = [
  {
    id: 1,
    email: "test@example.com",
    // 'password'をbcryptでハッシュ化したもの
    password: "$2a$10$J4yVrQWDe7j2uTwWlZpQQOEpc6dVG8YJXFAhxjOItxLnxHzpYbkwO",
  },
];

app.use(express.json());

app.post("/signup", async (req: any, res: any) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (demoUsers.find((user) => user.email === email)) {
    return res.status(400).send("User already exists");
  }
  const user = { id: demoUsers.length + 1, email, password: hashedPassword };
  demoUsers.push(user);
  res.status(201).send("User created");
});

app.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;
  const targetUser = demoUsers.find((user) => user.email === email);

  if (!targetUser) {
    return res.status(400).send("User not found");
  }

  const isMatch = await bcrypt.compare(password, targetUser.password);
  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }

  const token = jwt.sign(
    { id: targetUser.id, email: targetUser.email },
    // 本来は以下の秘密鍵等を環境変数等に記述する
    "secret_key",
    { expiresIn: "1h" }
  );

  res.status(200).send({ token });
});

// 登録済みユーザー一覧の取得←本来は必要ない機能
app.get("/user", (_req: any, res: any) => {
  res.send(demoUsers);
});

// ヘルスチェック
app.get("/health-check", (_req: any, res: any) => {
  res.send("Server heart beat!");
});

app.listen(PORT, (_res: any, _req: any) => {});
