// HTML to markdown conversion is inspired from Cline approach
// Except that we just fetch the HTML content instead of running a headless browser
// @see https://github.com/cline/cline
// @see https://github.com/cline/cline/blob/fa67db75e0ae2abc19de970d8ee1bf7854aab0bc/src/services/browser/UrlContentFetcher.ts#L65
import TurndownService from "turndown";

export function htmlToMarkdown(rawHtml: string) {
  // These regex are AI generated easy on them
  const turndownService = new TurndownService({
    codeBlockStyle: "fenced",
  });
  const markdown = turndownService.turndown(rawHtml);
  return markdown;
  //const bodyContent =
  //  rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || rawHtml;
  //const withoutScriptTags = bodyContent.replace(
  //  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  //  ""
  //);
  //const withoutComments = withoutScriptTags.replace(/<!--[\s\S]*?-->/g, "");
  //return withoutComments;
}
