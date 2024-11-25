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
    return res.status(400).send("Invalid credentials");
  }
  const user = { id: demoUsers.length + 1, email, password: hashedPassword };
  demoUsers.push(user);
  // 本来は、demoUsersをDBに預ける
  res.status(201).send("User created");
});

app.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  // リクエストにあるemailがDBにあるかを判断する
  // 実際はDBから探しだす
  const targetUser = demoUsers.find((user) => user.email === email);
  if (!targetUser) {
    return res.status(400).send("Invalid credentials");
  }

  // 入力されたパスワードが、DBのハッシュ化されたパスワードと一致するか
  const isMatch = await bcrypt.compare(password, targetUser.password);
  if (!isMatch) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign(
    { id: targetUser.id, email: targetUser.email },
    // [WARN]:本来は以下の秘密鍵等を環境変数等に記述する
    "secret_key",
    { expiresIn: "1h" }
  );

  // 発行されたアクセストークンをクライアントへ返す
  // TODO：Cookieを学習後は、Cookieで管理する
  res.status(200).json({ token });
});

// ヘルスチェック
app.get("/health-check", (_req: any, res: any) => {
  res.send("Server heart beat!");
});

app.listen(PORT, (_res: any, _req: any) => {});
