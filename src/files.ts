import path from "path";
import * as vscode from "vscode";
import fs from "fs";

export class RagFolderManager {
  context: vscode.ExtensionContext;
  folderPath: string;
  constructor(private _context: vscode.ExtensionContext) {
    this.context = _context;
    this.folderPath = path.join(
      this.context.globalStorageUri.fsPath,
      ".copilot-rag"
    );
  }

  createCopilotRagFolder() {
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true });
    }
  }
}

export function urlToFileName(url: string) {
  return (
    url
      .replace(/^https?:\/\//, "")
      .replace(/\//g, "_")
      .replace(/\./, "_") + ".html"
  );
}
