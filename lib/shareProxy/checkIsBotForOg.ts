import type { NextRequest } from "next/server";

export const checkIsBotForOg = (request: NextRequest): boolean => {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";

  // 常见的 bot User-Agent 列表
  const botPatterns = [
    // Facebook/Meta
    "facebookexternalhit",
    "facebookcatalog",
    "facebot",

    // Twitter/X
    "twitterbot",
    "twitter",

    // LinkedIn
    "linkedinbot",
    "linkedin",

    // WhatsApp
    "whatsapp",

    // Telegram
    "telegrambot",
    "telegram",

    // Discord
    "discordbot",

    // Slack
    "slackbot",

    // Google
    "googlebot",
    "google-structured-data-testing-tool",

    // Bing
    "bingbot",
    "msnbot",

    // 其他搜索引擎和爬虫
    "baiduspider",
    "yandexbot",
    "duckduckbot",
    "slurp", // Yahoo
    "ia_archiver", // Internet Archive

    // 通用爬虫标识
    "bot",
    "crawler",
    "spider",
    "scraper",
  ];

  return botPatterns.some((pattern) => userAgent.includes(pattern));
};
