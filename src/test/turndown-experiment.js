const fs = require("fs")
const path = require("path")
const TurndownService = require('turndown');

const htmlFile = fs.readFileSync(path.join(__dirname, "./fixtures/www_ericburel.tech_blog_nextjs-stream-files.html"), "utf-8")
const turndownService = new TurndownService({
    codeBlockStyle: "fenced"
})
const markdown = turndownService.turndown(htmlFile)
const mdFile = fs.writeFileSync(path.join(__dirname, "./fixtures/", "www_ericburel.tech_blog_nextjs-stream-files.md"), markdown)