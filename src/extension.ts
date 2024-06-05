/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import * as vscode from "vscode";
import { getAccessToken } from "./utils/token";

export function activate(context: vscode.ExtensionContext) {
  const previousB = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  previousB.text = "$(previous-icon)";
  previousB.tooltip = "play previous track";
  previousB.command = "spotify-controls.playPrevious";
  previousB.show();

  const nextB = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  nextB.text = "$(next-icon)";
  nextB.tooltip = "play Next track";
  nextB.command = "spotify-controls.playNext";
  nextB.show();

  context.subscriptions.push(previousB);
  context.subscriptions.push(nextB);
  let prevD = vscode.commands.registerCommand(
    "spotify-controls.playPrevious",
    async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          vscode.window.showErrorMessage("spotify access token not available.");
          return;
        }
        await playPrevious(accessToken);
      } catch (e) {
        console.error(e);
        vscode.window.showErrorMessage("failed to play previous track");
      }
    }
  );

  let nextD = vscode.commands.registerCommand(
    "spotify-controls.playNext",
    async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          vscode.window.showErrorMessage("spotify access token not available.");
          return;
        }

        await playNext(accessToken);
      } catch (e) {
        console.error(e);
        vscode.window.showErrorMessage("failed to play next track");
      }
    }
  );

  context.subscriptions.push(prevD);
  context.subscriptions.push(nextD);
}

async function playPrevious(accessToken: string) {
  await axios.post("https://api.spotify.com/v1/me/player/previous", null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function playNext(accessToken: string) {
  await axios.post("https://api.spotify.com/v1/me/player/next", null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
