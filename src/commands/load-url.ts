import * as vscode from "vscode";
import { RagFolderManager, urlToFileName } from "../files";
import { Readable } from "stream";
import { simplifyHtml } from "../html";
const https = require("https");
const fs = require("fs");
const path = require("path");

export function loadUrl(rfm: RagFolderManager) {
  return () => {
    // Get url
    vscode.window
      .showInputBox({ prompt: "Enter the URL to load" })
      .then((url) => {
        if (!url) {
          vscode.window.showErrorMessage("No URL provided");
          return;
        }
        // Compute clean filepath
        const fileName = urlToFileName(url);
        const filePath = path.join(rfm.folderPath, fileName);
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              vscode.window.showErrorMessage(
                `Failed to fetch ${url}: ${response.statusText}`
              );
              throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            return response.text();
          })
          .then((data) => {
            fs.writeFile(filePath, simplifyHtml(data), (err: any) => {
              if (err) {
                vscode.window.showErrorMessage(
                  `Failed to write file: ${err.message}`
                );
                throw err;
              }
              vscode.window.showInformationMessage(
                `Content downloaded to ${filePath}`
              );
            });
          })
          .catch((err) => {
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
