import * as vscode from "vscode";
import { loadUrl } from "./commands/load-url";
import { RagFolderManager } from "./files";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Copilot Rag is now active.");

  const rfm = new RagFolderManager(context);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const webCmd = vscode.commands.registerCommand(
    "copilot-rag.web",
    loadUrl(rfm)
  );
  context.subscriptions.push(webCmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}
