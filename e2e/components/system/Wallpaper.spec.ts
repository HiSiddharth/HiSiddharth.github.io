import { test } from "@playwright/test";
import {
  backgroundCanvasMaybeIsVisible,
  backgroundIsUrl,
  canvasBackgroundIsHidden,
  captureConsoleLogs,
  clickContextMenuEntry,
  clickFileExplorerEntry,
  closePage,
  contextMenuIsVisible,
  disableWallpaper,
  fileExplorerEntriesAreVisible,
  loadApp,
  loadAppWithCanvas,
  sessionIsWriteable,
  windowsAreVisible,
} from "e2e/functions";

test.beforeEach(captureConsoleLogs());
test.afterEach(closePage);

test("has background", loadAppWithCanvas);

test.describe("can set background", () => {
  test.beforeEach(disableWallpaper);
  test.beforeEach(async ({ page }) =>
    loadApp({ url: "/System/Icons/48x48" })({ page })
  );
  test.beforeEach(windowsAreVisible);
  test.beforeEach(fileExplorerEntriesAreVisible);
  test.beforeEach(backgroundCanvasMaybeIsVisible);

  test("via image", async ({ browserName, headless, page }) => {
    await backgroundCanvasMaybeIsVisible({ browserName, headless, page });

    await clickFileExplorerEntry("audio.png", { page }, true);
    await contextMenuIsVisible({ page });

    await clickContextMenuEntry(/^Set as background$/, { page });
    await sessionIsWriteable({ page });
    await clickContextMenuEntry(/^Tile$/, { page });

    await backgroundIsUrl({ page });
    await canvasBackgroundIsHidden({ page });
  });
});
