export const clearHtmlBody = (html: string): string => {
  if (!html || typeof html !== "string") {
    return html;
  }

  const bodyRegex = /<body[^>]*>[\s\S]*?<\/body>/gi;

  return html.replace(bodyRegex, "<body></body>");
};
