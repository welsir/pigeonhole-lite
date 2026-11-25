<p align="center"><a href="README.md" lang="zh-CN">简体中文</a> · <strong>English</strong></p>

<h1 align="center"><img src="media/en/masthead.png" width="100%" alt="Pigeonhole — rename downloads and file them by project"></h1>

<p align="center">Pigeonhole is a Chrome and Edge extension that gives downloads readable names using clues from the source page while the tab is still open. It files papers, attachments, reports and design assets into project folders using your rules, tab groups or AI suggestions — and lets you find them later by those web clues.</p>

<p align="center"><a href="https://chromewebstore.google.com/detail/pigeonhole/ikjdcjgnlbealhahlogjidahhhlbcdhp?hl=en"><img src="media/en/install-chrome.png" width="206" height="46" alt="Install Pigeonhole from the Chrome Web Store"></a>&nbsp;&nbsp;<a href="https://microsoftedge.microsoft.com/addons/detail/pigeonhole/khbknbmdpigbjgojdodfelfgcnnjnljc?hl=en-US"><img src="media/en/install-edge.png" width="206" height="46" alt="Install Pigeonhole from Microsoft Edge Add-ons"></a><br>
<sub>No account required · Never uploads file contents · Never overwrites or deletes files · Built-in AI trial or free unlimited BYOK</sub></p>

<p align="center"><a href="#features">Features</a> · <a href="#find-downloads-by-web-clues">Find downloads</a> · <a href="#product-tour">Product tour</a> · <a href="#filing-rules">Filing rules</a> · <a href="#your-first-download">Your first download</a> · <a href="#faq">FAQ</a> · <a href="docs/lite.en.md">Lite</a></p>

## Features

| When you download… | What Pigeonhole can do |
| --- | --- |
| Several files all called “Attachment” from one page | Uses the text around each link to tell the requirements, scoring rules and contract template apart, while leaving already-clear filenames untouched. |
| Material for one project from several sites | Tie a project to a browser tab group, set a filing rule, or use an AI suggestion. Unsure items wait safely in your review inbox instead of cluttering directories. |
| Files that must keep a supplier's original reference number | Add the site to **Keep names from**. Its files can still go to the project folder with their original names intact. |
| A file lands in the wrong project | An on-page download card shows progress, the new filename and its destination. Choose **Change folder** or **Undo** right on the page where you downloaded it. |
| A project already has a folder on your computer | Edit the project, select **Use a folder on your computer…**, then pick the existing directory. For example, make the folder you already use for exhibition artwork the destination for that project. |
| Something you need to find days later | Search locally in the popup by page title, link text, or phrases like `last week PDF`, click **Find with AI** to describe what you remember, and open matches right in the browser. |

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="media/en/download-demo-still.png">
  <img src="media/en/download-demo.gif" alt="The library tender’s attachment2.pdf is saved as Library tender_Scoring rules.pdf in the City tenders project.">
</picture>

## Find downloads by web clues

When you forget what a file was named days later, Pigeonhole helps you retrieve it using clues saved from the page where you downloaded it.

To find the scoring sheet from the library tender above, open **Recent** in the toolbar panel and type `scoring`. For a different tender, you might only remember downloading a parking PDF last week. Try `last week PDF parking`. The date and file type become filters, while “parking” matches the filename, source page title or saved link text. Keyword searches run offline on your device, and you can also filter by the file’s last confirmed folder.

<p align="center"><a href="media/en/find-download.png"><img src="media/en/find-download.png" width="440" alt="Searching for scoring in the toolbar panel finds the sample library tender PDF in City tenders. The panel also offers Find with AI."></a></p>

- **Find attachments from a page you revisit.** Open the panel on that page. **Downloaded from this page** lists the downloads Pigeonhole has recorded there.
- **Describe a file with Find with AI.** Select the button and confirm on first use to send your description (including relative dates like “last Wednesday” or “ten days ago”) and up to 30 locally selected summaries. The AI suggests up to three matches and explains its choices. Sensitive sites and sites where you’ve disabled AI are excluded, and requests never include file contents, full URLs or local paths.
- **Open a match in your browser.** Use **Open in browser** to view a PDF, common image, plain text file or supported audio or video file read-only. This also works after a move if Pigeonhole can locate the file and has permission to read its folder.
- **Check where a large file actually landed.** External filing verifies large files via streaming chunks. Each record distinguishes a completed move from a file still staged in Downloads or one whose location needs checking.

In **Projects & Rules**, you can also **draft a rule in a single sentence** — for example, “File arXiv papers in Thesis/Papers” — and inspect the drafted conditions and destination before saving (available within the built-in AI trial or unlimited with your own API key). When Pigeonhole updates silently in the background, a dismissible summary appears once inside the popup without ever opening unsolicited tabs, and you can review past release notes or turn notices off in Settings.

## Product tour

The screenshots use sample files and projects. Select an image to see it at full size.

### Give each attachment on a page its own name

The Maple City library tender links to two PDFs and a Word document. The second link is called `attachment2.pdf`, but the words around it identify the scoring rules. Pigeonhole keeps that distinction in the filename. When you review the bids, search *City tenders* for “Scoring rules” to find the right PDF.

<details>
<summary>See the three original attachments and their saved names</summary>

[![A library tender with three attachment links and three distinct filenames in the project folder](media/en/store-attachments.png)](media/en/store-attachments.png)

</details>

### Change the destination as the download finishes

When a download finishes, the on-page card shows the saved name and destination. In this example, the scoring sheet went to *City tenders*. Choose **Show in folder** to open its location or **Change folder** to pick another project. The toolbar panel also keeps a record when a restricted browser page cannot show a card.

If your project already has a directory on your computer, select **Change folder → Choose a folder on your computer…**. Your browser asks for access to both the folder Pigeonhole manages in Downloads and the destination folder. The file stays safely in the managed Downloads folder until you grant access.

<details>
<summary>See the on-page download card and its Change folder button</summary>

<p align="center"><a href="media/en/download-controls.png"><img src="media/en/download-controls.png" width="420" alt="A scoring sheet filed in City tenders, with Show in folder, Change folder and Undo on the card."></a></p>

</details>

### Find or undo a file after closing its source tab

Open Pigeonhole from the browser toolbar to see your recent downloads. All three tender documents went to *City tenders*. Use **Undo** on an individual entry when available, or **Undo all** for the batch. Your browser asks for folder access only when a file needs to move.

<p align="center"><a href="media/en/recent-history.png"><img src="media/en/recent-history.png" width="440" alt="Recent downloads with individual and batch undo actions"></a></p>

### Turn a good filing decision into a rule

A procurement project can run for weeks. On a download that went to the right folder, choose **More → Always do this**. Pigeonhole pre-fills the source, file type and project. In this example, PDFs from the procurement site will go to *City tenders*. Other file types can follow their own rules. Check the conditions, then select **Save**.

<details>
<summary>See the source, file type and project in the rule editor</summary>

<p align="center"><a href="media/en/filing-controls.png"><img src="media/en/filing-controls.png" width="420" alt="A rule drafted from a download, with a source website, a PDF condition and a destination project"></a></p>

</details>

## Filing rules

Start in **Projects & Rules**. Create a project such as *Research papers*. You can enter a project folder up to two levels deep, such as `Thesis/Papers`. You can associate sites and tab groups with the project and add a short description for the AI.

Choose **New rule** to combine conditions manually, or describe a rule in plain language for AI to draft. Rules are checked from top to bottom. Use **Move up** or **Move down** to give a more specific rule priority.

| What you're working on | A rule to try |
| --- | --- |
| **A literature review.** Collect papers without filing every download from the same site. | Set **Site is** to `arxiv.org` and **File type is** to `pdf`. Choose your research project under **File in**. |
| **An exhibition or design project.** Reference images, floor plans and print specs come from different sites. | Put those pages in a *Spring exhibition* tab group, then use **Tab group is** to send downloads from the group to one project. |
| **Monthly reports.** You want to find a CSV by its subject and date. | Match pages whose title or URL contains *monthly ridership*. Choose your reporting project and select **Date first** under **File name** for that rule. |
| **A bid or client delivery.** The recipient expects the original document numbers. | Match the source site, choose the destination project, then select **Keep name**. This also works for application forms that must be returned with their original identifiers. |

### Test a rule before downloading

Open **Projects & Rules → Try it**. Pick a recent download or enter a URL and filename, then select **Test**. In the screenshot, `paper-demo.pdf` matches the *arXiv papers* rule and would land in `Downloads/Pigeonhole/Research papers`. You can adjust the conditions or rule order and try again without downloading anything.

[![Testing a PDF from arXiv and previewing the matching rule and destination folder](media/en/rule-preview.png)](media/en/rule-preview.png)

<details>
<summary>What if two projects use the same website?</summary>

Suppose you download readings for both Statistics and Urban Planning from one university site. Make a tab group and a matching rule for each course. If you also have a rule for the entire site, move the course rules above it. Download one file from each tab group and check the destinations in the toolbar panel.

</details>

## Your first download

1. Install Pigeonhole from the [Chrome Web Store](https://chromewebstore.google.com/detail/pigeonhole/ikjdcjgnlbealhahlogjidahhhlbcdhp?hl=en) or [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pigeonhole/khbknbmdpigbjgojdodfelfgcnnjnljc?hl=en-US), and click **Get started** on the welcome screen to allow page reading so multiple attachments on one page get distinct names.
2. Click any download link with a generic name such as `attachment1.pdf` — check the new filename and destination on the top-right page card or toolbar panel, or click **Undo** anytime to revert.
3. To keep routing similar downloads the same way, select **More → Always do this** on that entry or draft a rule in a sentence.

## FAQ

<details>
<summary><strong>Can I preview names for papers, notices and images?</strong></summary>

Yes. In **Naming & AI**, switch between the **Paper**, **Notice** and **Image** samples to compare the original name with the result. A paper's title can give an identifier-only PDF a readable name. A work's title can do the same for a camera filename or an image called `image.png`.

</details>

<details>
<summary><strong>What does the AI see? Does it receive my files?</strong></summary>

File contents are never uploaded, Pigeonhole never overwrites or deletes your local files, and it never requests `history` permission. Naming and filing use only the page title, stripped URL, original filename, and optional nearby link text when permitted; clicking **Find with AI** sends only your query and up to 30 locally selected candidate summaries (never file contents, full URLs or local paths). Banking, payment and health sites skip AI automatically. Settings, history and saved page clues stay in your browser, and anonymous usage counts can be turned off anytime in Settings. [Pigeonhole privacy policy](https://pigeonhole.tmlab.top/privacy?lang=en)

</details>

<details>
<summary><strong>Can I pause the extension or get fewer notifications?</strong></summary>

In **General**, set **Notifications** to **Only to review**. If you're downloading a batch that needs no organizing, choose **Pause 1 hour** or **Pause for today**.

</details>

<details>
<summary><strong>Do I need an account or an API key? Can I use my own provider?</strong></summary>

No account or API key is needed to try the built-in AI (subject to trial and daily caps). If you enter your own OpenAI-compatible API key (such as DeepSeek, OpenAI, or SiliconFlow) or use a local model in Settings, AI naming, Find with AI, and one-sentence rule drafting are all free with no usage limits — requests go directly to your chosen provider without passing through Pigeonhole's servers.

</details>

---

This repository contains the source for [Pigeonhole Lite](docs/lite.en.md); the full extension is free on the [Chrome Web Store](https://chromewebstore.google.com/detail/pigeonhole/ikjdcjgnlbealhahlogjidahhhlbcdhp?hl=en) and [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pigeonhole/khbknbmdpigbjgojdodfelfgcnnjnljc?hl=en-US).<br>
Feedback & community: [Join the community / Discord](https://pigeonhole.tmlab.top/community?l=en) · [Send feedback](https://pigeonhole.tmlab.top/feedback?l=en) · [GitHub Issues](https://github.com/welsir/pigeonhole-lite/issues)
