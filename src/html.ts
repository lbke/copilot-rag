export function simplifyHtml(rawHtml: string) {
  // These regex are AI generated easy on them
  const bodyContent =
    rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || rawHtml;
  const withoutScriptTags = bodyContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  const withoutComments = withoutScriptTags.replace(/<!--[\s\S]*?-->/g, "");
  return withoutComments;
}
