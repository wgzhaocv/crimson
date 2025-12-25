const BASE_URL = process.env.BASE_URL || "https://crimson.app";

/**
 * HTML 字符串：用于提示内容不存在或不公开（给 SNS bot 使用）
 * @param pathname - 页面路径，如 /share/abc123，会与 BASE_URL 拼接成完整 URL
 */
export const getNotFoundOrPrivateOgHtml = (pathname: string): string => {
  const ogUrl = `${BASE_URL}${pathname}`;
  const ogImageUrl = `${BASE_URL}/api/share/og/not-found`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>コンテンツが見つかりません - Crimson</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="この共有コンテンツは存在しないか、非公開に設定されています。">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${ogUrl}">

  <!-- OpenGraph Meta Tags -->
  <meta property="og:title" content="コンテンツが見つかりません - Crimson">
  <meta property="og:description" content="この共有コンテンツは存在しないか、非公開に設定されています。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:alt" content="Crimson - コンテンツが見つかりません">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Crimson">
  <meta property="og:locale" content="ja_JP">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="コンテンツが見つかりません - Crimson">
  <meta name="twitter:description" content="この共有コンテンツは存在しないか、非公開に設定されています。">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta name="twitter:image:alt" content="Crimson - コンテンツが見つかりません">
</head>
<body></body>
</html>`;
};

/**
 * HTML 字符串：用于提示需要密码确认（给 SNS bot 使用）
 * @param pathname - 页面路径，如 /share/abc123，会与 BASE_URL 拼接成完整 URL
 */
export const getPasswordRequiredOgHtml = (pathname: string): string => {
  const ogUrl = `${BASE_URL}${pathname}`;
  const ogImageUrl = `${BASE_URL}/api/share/og/need-pw`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>パスワード確認が必要です - Crimson</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="この共有コンテンツを閲覧するには、パスワードの確認が必要です。">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${ogUrl}">

  <!-- OpenGraph Meta Tags -->
  <meta property="og:title" content="パスワード確認が必要です - Crimson">
  <meta property="og:description" content="この共有コンテンツを閲覧するには、パスワードの確認が必要です。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:alt" content="Crimson - パスワード確認が必要です">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Crimson">
  <meta property="og:locale" content="ja_JP">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="パスワード確認が必要です - Crimson">
  <meta name="twitter:description" content="この共有コンテンツを閲覧するには、パスワードの確認が必要です。">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta name="twitter:image:alt" content="Crimson - パスワード確認が必要です">
</head>
<body></body>
</html>`;
};
