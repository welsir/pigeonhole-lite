<p><a href="lite.md" lang="zh-CN">简体中文</a> · <strong>English</strong></p>

# Pigeonhole Lite

Lite is a Chrome and Edge extension for renaming downloads. Its local rules recognize generic names, numbers, UUIDs, paper identifiers and camera filenames. If you download `file.pdf` from a page titled *Spring Bird Walk — Nature Guide*, for example, Lite saves it as `Spring Bird Walk_Nature Guide.pdf`. Files with descriptive names keep them. If a name is already taken, the browser adds a number.

The rules apply to new downloads. Attachments from the same page can end up with the same base name. When the browser provides only the site's domain, or Lite cannot match the download to a specific source tab, it keeps the browser's filename.

## Install in Chrome or Edge

1. Select **Code → Download ZIP** on the repository homepage and unzip the archive, or clone the repository.
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge and enable **Developer mode**.
3. Select **Load unpacked**, then choose the `extension` folder inside the repository. Local naming works immediately. No build or API key is required.

## Optional AI naming

Click the Pigeonhole icon in your toolbar to open its settings. The Lite settings are in Simplified Chinese. OpenAI is selected by default. If you use a different OpenAI-compatible provider, first open **高级配置** (Advanced settings) and enter that provider’s HTTPS base URL and model name. Enter the matching key under **自己的 API Key** (Your API key), select **保存设置** (Save settings), and grant access to that provider when prompted.

Lite requests a name from the model only when a filename matches a local rule, the source page is known, and you have configured a key and granted the required permission. The model receives the original filename and page title. File contents and page text are never sent. If the service times out or returns an error, Lite uses local naming. Incognito downloads always use local rules.

The key is stored in the extension's local storage for your browser profile. Select **清除密钥并停用 AI** (Clear key and turn off AI) to remove it and return to local naming.

## Run the tests

From the repository root, run `node --test` with Node.js 22 or later.

## License

You may use and modify Lite for noncommercial purposes. You may also redistribute the original or a modified version at no charge for noncommercial purposes. Include the full license, copyright notice and project attribution with every copy you distribute. Commercial use requires separate written permission. [Read the full license (Chinese)](../LICENSE)
