// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const https = require("https");
const fs = require("fs");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "copilot-rag" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "copilot-rag.load-url",
    () => {
      // TODO: Add logic to load the web page using the provided URL
      // Check if copilot is installed
      const copilotExtension = vscode.extensions.getExtension("GitHub.copilot");
      if (!copilotExtension) {
        vscode.window.showWarningMessage(
          "GitHub Copilot is not installed. Please install it to use this feature."
        );
        return;
      }
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
          // Create a temp dir for rag content
          const tempDir = path.join(
            context.globalStorageUri.fsPath,
            ".copilot-rag"
          );
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }

          // Compute clean filepath
          const filePath = path.join(
            tempDir,
            url
              .replace(/^https?:\/\//, "")
              .replace(/\//g, "_")
              .replace(/\./, "_") + ".html"
          );
          const file = fs.createWriteStream(filePath);

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
      //vscode.window.showInformationMessage("Hello World from copilot-rag!");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
