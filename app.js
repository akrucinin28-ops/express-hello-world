
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    project: "ISPEEG Robux",
    status: "online",
    hosting: "Render"
  });
});

app.get("/telegram-test", async (req, res) => {
  const token = process.env.BOT_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "BOT_TOKEN not configured"
    });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getMe`,
      { signal: AbortSignal.timeout(10000) }
    );

    const result = await response.json();

    res.json({
      http_status: response.status,
      telegram_ok: result.ok,
      bot: result.ok ? result.result.username : null,
      error_code: result.ok ? null : result.error_code,
      description: result.ok ? null : result.description,
      retry_after: result.parameters?.retry_after || null
    });

} catch (error) {
  console.error("Telegram connection:", error.message);

  res.status(500).json({
    error: "Telegram connection failed",
    reason: error.name,
    cause: error.cause?.code || null
  });
}

});

app.listen(port, "0.0.0.0", () => {
  console.log(`ISPEEG Robux running on port ${port}`);
});
