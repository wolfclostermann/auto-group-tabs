# Auto-group tabs

Microsoft Edge extension (Manifest V3) that groups open tabs into a small set of **semantic** categories based on URL rules. Click the toolbar icon to run it on **all windows** at once.

Singleton tabs (only one tab in a category) are left ungrouped so you do not get noisy one-tab groups.

## Install (Edge, unpacked)

1. Clone this repository.
2. Open `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and choose the extension folder (the directory that contains `manifest.json`).
5. Optional: pin **Auto-group tabs** to the toolbar for one-click grouping.

After you change `background.js` or `manifest.json`, use **Reload** on the extension card.

## Use

Click the extension icon. Tabs in each window are classified; every category that has **two or more** matching tabs becomes a named, coloured group.

## Categories

Rules are evaluated in order; the first match wins (important for Atlassian and Azure DevOps).

| Group | Intent | Examples |
|--------|--------|----------|
| **Google Console** | Cloud / admin consoles | `console.cloud.google.com`, `admin.google.com`, Firebase / Actions / Partners consoles, Play Console |
| **Code** | Repos and code hosts | GitHub, Gist, `github.dev`, GitLab, Bitbucket, Sourcegraph, Codeberg, sr.ht; Azure DevOps paths containing `/_git/` |
| **Workflow** | Delivery / PM tools | Jira and other `*.atlassian.net` (except wiki); Azure DevOps outside `_git` / `_wiki`; Linear, Asana, Monday, ClickUp, Trello |
| **Documents** | Editing and files | `docs.google.com`, SharePoint / OneDrive, Word/Excel/PowerPoint/OneNote on Office; local `file:` URLs for common office/PDF extensions |
| **Docs** | Wikis and reference docs | Confluence (`/wiki/` on `*.atlassian.net`), Azure DevOps `/_wiki`, Notion, Read the Docs, GitBook, `docs.github.com`, Microsoft Docs / Learn, MDN |

**Colours** (fixed): Google Console — blue; Code — green; Workflow — purple; Documents — pink; Docs — cyan.

Tabs that do not match any rule (and internal pages like `edge://`) are skipped.

## Permissions

- **`tabs`** — read each tab’s URL (and window) to classify and group.
- **`tabGroups`** — create groups and set title / colour.

## Customising rules

Edit `categorizeTab()` in `background.js` and reload the extension. Keep more specific checks (e.g. Confluence vs Jira) **before** broader host matches.

## Roadmap

See `TODO.md` (planned: optional AI pass for tabs that do not match built-in categories).

## Licence

No licence file is included yet; treat as private / all rights reserved unless you add one.
