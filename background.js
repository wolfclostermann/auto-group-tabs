/** @typedef {import('chrome').tabGroups.Color} TabGroupColor */

/** @type {Record<string, TabGroupColor>} */
const CATEGORY_COLOR = {
  "Google Console": "blue",
  Code: "green",
  Workflow: "purple",
  Documents: "pink",
  Docs: "cyan",
};

/**
 * First matching rule wins. Order matters (e.g. Confluence vs Jira on atlassian.net).
 * @param {string} url
 * @returns {string | null}
 */
function categorizeTab(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  const proto = u.protocol;
  if (
    proto === "edge:" ||
    proto === "chrome:" ||
    proto === "about:" ||
    proto === "chrome-extension:" ||
    proto === "moz-extension:"
  ) {
    return null;
  }

  const host = u.hostname.replace(/^www\./i, "").toLowerCase();
  const path = u.pathname.toLowerCase();

  if (proto === "file:") {
    if (/\.(docx?|docm|dotx?|xlsm?|xlsx?|pptx?|pptm|pdf)$/i.test(u.pathname)) return "Documents";
    return null;
  }

  // Atlassian: Confluence (wiki) vs Jira / Service Management / etc.
  if (host.endsWith("atlassian.net")) {
    if (/\/wiki(\/|$)/i.test(u.pathname)) return "Docs";
    return "Workflow";
  }

  // Google operator / cloud consoles (not end-user Docs)
  if (host === "console.cloud.google.com" || host.endsWith(".console.cloud.google.com"))
    return "Google Console";
  if (host === "admin.google.com") return "Google Console";
  if (host === "console.firebase.google.com") return "Google Console";
  if (host === "partners.cloud.google.com") return "Google Console";
  if (host === "console.actions.google.com") return "Google Console";
  if (host === "play.google.com" && path.includes("/console")) return "Google Console";

  // Azure DevOps: repos vs wiki vs the rest (boards, pipelines, …)
  if (host === "dev.azure.com" || host.endsWith(".visualstudio.com")) {
    if (path.includes("/_git/")) return "Code";
    if (path.includes("/_wiki")) return "Docs";
    return "Workflow";
  }

  // Source control & code review (broad but stable hosts)
  if (host === "github.com" || host === "gist.github.com") return "Code";
  if (host === "github.dev" || host.endsWith(".github.dev")) return "Code";
  if (host === "gitlab.com" || host.endsWith(".gitlab.com")) return "Code";
  if (host === "bitbucket.org") return "Code";
  if (host === "sourcegraph.com" || host.endsWith(".sourcegraph.com")) return "Code";
  if (host === "codeberg.org") return "Code";
  if (host === "sr.ht") return "Code";

  // Issue trackers / PM / delivery (not Confluence — handled above)
  if (host === "linear.app" || host.endsWith(".linear.app")) return "Workflow";
  if (host.endsWith("asana.com")) return "Workflow";
  if (host.endsWith("monday.com")) return "Workflow";
  if (host.endsWith("clickup.com")) return "Workflow";
  if (host === "trello.com" || host.endsWith(".trello.com")) return "Workflow";
  if (host.endsWith("atlassian.com") && path.includes("/jira")) return "Workflow";

  // Authoring & office files in the browser
  if (host === "docs.google.com") return "Documents";
  if (host.endsWith("sharepoint.com")) return "Documents";
  if (host.endsWith("sharepoint.us")) return "Documents";
  if (host.includes("sharepoint-df.com")) return "Documents";
  if (host === "onedrive.live.com" || host.endsWith(".onedrive.com")) return "Documents";
  if (
    host === "word.office.com" ||
    host === "excel.office.com" ||
    host === "powerpoint.office.com" ||
    host === "onenote.office.com" ||
    host === "word.cloud.microsoft" ||
    host === "excel.cloud.microsoft" ||
    host === "powerpoint.cloud.microsoft"
  ) {
    return "Documents";
  }
  if (host === "office.com" || host.endsWith(".office.com")) {
    if (
      /\/word\b|\/excel\b|\/powerpoint\b|\/onenote\b|\/document\b|\/:w:\/|\/:x:\/|\/:p:\//i.test(
        u.pathname + u.hash
      )
    ) {
      return "Documents";
    }
  }

  // Knowledge bases & long-form product docs
  if (host === "notion.so" || host.endsWith(".notion.so")) return "Docs";
  if (host.endsWith("readthedocs.io")) return "Docs";
  if (host === "gitbook.io" || host === "gitbook.com" || host.endsWith(".gitbook.io")) return "Docs";
  if (host === "docs.github.com") return "Docs";
  if (host === "docs.microsoft.com" || host === "learn.microsoft.com") return "Docs";
  if (host === "developer.mozilla.org") return "Docs";

  return null;
}

chrome.action.onClicked.addListener(async () => {
  const windows = await chrome.windows.getAll({ populate: true });
  for (const win of windows) {
    const tabs = win.tabs || [];
    /** @type {Map<string, number[]>} */
    const buckets = new Map();
    for (const tab of tabs) {
      if (tab.id == null) continue;
      const category = categorizeTab(tab.url || "");
      if (category == null) continue;
      let ids = buckets.get(category);
      if (!ids) {
        ids = [];
        buckets.set(category, ids);
      }
      ids.push(tab.id);
    }
    for (const [category, tabIds] of buckets) {
      if (tabIds.length < 2) continue;
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, {
        title: category,
        color: CATEGORY_COLOR[category] ?? "grey",
        collapsed: false,
      });
    }
  }
});
