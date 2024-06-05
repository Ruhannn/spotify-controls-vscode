import * as vscode from "vscode";
import axios from "axios";

let accessToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (!accessToken) {
    try {
      const configuration =
        vscode.workspace.getConfiguration("spotify-controls");
      const databaseUrl = configuration.get<string>("databaseUrl");

      if (!databaseUrl) {
        console.error("Database URL is not configured.");
        return null;
      }

      const response = await axios.get(`${databaseUrl}`);
      if (response.data && response.data.accessToken) {
        accessToken = response.data.accessToken.replace('"', "");
      } else {
        console.error("Access token not found in response");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return accessToken;
}
