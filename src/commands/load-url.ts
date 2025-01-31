import * as vscode from "vscode";
import { RagFolderManager, urlToFileName } from "../files";
const https = require("https");
const fs = require("fs");
const path = require("path");

export function loadUrl(rfm: RagFolderManager) {
  return () => {
    // Get url
    vscode.window
      .showInputBox({ prompt: "Enter the URL to load" })
      .then((url) => {
        console.log("URL, url");
        if (!url) {
          vscode.window.showErrorMessage("No URL provided");
          return;
        }
        console.log(`URL entered: ${url}`);
        // Compute clean filepath
        const fileName = urlToFileName(url);
        const filePath = path.join(rfm.folderPath, fileName);
        const file = fs.createWriteStream();
        https
          .get(url, (response: any) => {
            response.pipe(file);
            file.on("finish", () => {
              file.close();
              vscode.window.showInformationMessage(
                `Content downloaded to ${filePath}`
              );
            });
          })
          .on("error", (err: any) => {
            fs.unlink(filePath, () => {});
            vscode.window.showErrorMessage(
              `Failed to download content: ${err.message}`
            );
          });
        // Add file to context
        vscode.workspace.openTextDocument(filePath).then((document) => {
          vscode.window.showTextDocument(document, {
            preserveFocus: true,
          });
          vscode.window.showInformationMessage(
            `File ${filePath} download from ${url} opened in your editor. It will now be part of GitHub Copilot context.`
          );
        });
      });
  };
}
