import * as vscode from "vscode";
import { RagFolderManager, urlToFileName } from "../files";
import { htmlToMarkdown } from "../html";
import fs from "fs";
import path from "path";

export function loadUrl(rfm: RagFolderManager) {
  return () => {
    // Get url
    vscode.window
      .showInputBox({ prompt: "Enter the URL to load", ignoreFocusOut: true })
      .then((url) => {
        if (!url) {
          // Silently ignore empty URL
          // vscode.window.showErrorMessage("No URL provided");
          return;
        }
        if (!url.match(/^https?:\/\//)) {
          vscode.window.showErrorMessage("Invalid URL provided to Copilot RAG");
          return;
        }
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Downloading and parsing content...",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ increment: 0 });
            // Compute clean filepath
            const fileName = urlToFileName(url);
            // HTML file is not stored yet but could be used in the future
            // const htmlFilePath = path.join(rfm.folderPath, fileName);
            const markdownFilePath = path.join(
              rfm.folderPath,
              path.basename(fileName, ".html") + ".md"
            );
            fetch(url)
              .then((response) => {
                if (!response.ok) {
                  vscode.window.showErrorMessage(
                    `Failed to fetch ${url}: ${response.statusText}`
                  );
                  throw new Error(
                    `Failed to fetch ${url}: ${response.statusText}`
                  );
                }
                return response.text();
              })
              .then((data) => {
                progress.report({ increment: 50 });
                const markdown = htmlToMarkdown(data);
                fs.writeFile(markdownFilePath, markdown, (err: any) => {
                  if (err) {
                    vscode.window.showErrorMessage(
                      `Failed to write file: ${err.message}`
                    );
                    throw err;
                  }
                  progress.report({ increment: 100 });
                  vscode.window.showInformationMessage(
                    `Content downloaded to ${markdownFilePath}`
                  );
                });
                // Add file to context
                vscode.workspace
                  .openTextDocument(markdownFilePath)
                  .then((document) => {
                    vscode.window.showTextDocument(document, {
                      preserveFocus: true,
                    });
                    vscode.window.showInformationMessage(
                      `File ${markdownFilePath} download from ${url} opened in your editor. It will now be part of GitHub Copilot context.`
                    );
                  });
              })
              .catch((err) => {
                vscode.window.showErrorMessage(
                  `Failed to download content: ${err.message}`
                );
              });
          }
        );
      });
  };
}
