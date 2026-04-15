# Bugs

Open issues observed while dogfooding. Screenshots live under `bugs/`.

---

## 1. Duplicate “Code” groups in one window

**Screenshot:** [bugs/2026-04-15-vertical-tabs.png](bugs/2026-04-15-vertical-tabs.png) (from `Screenshot 2026-04-15 at 16.43.04.png`)

After grouping, Edge’s vertical tab sidebar shows **two separate tab groups** both titled **Code** (same colour). One holds general GitHub repo tabs; the other holds GFS-related GitHub / org access tabs. Expected: a **single** Code group per window (all tabs classified as Code should land in one `chrome.tabs.group`).

**Hypothesis:** Some GitHub-related tabs use a **different hostname** (e.g. enterprise / EMU login) that is not matched by the current `github.com` rules, so they were grouped in a second pass or by a different code path—or a second click grouped subsets. Needs repro with full URLs.

---

## 2. Word document tab not placed in “Documents”

**Screenshot:** same as above.

**Southampton Buffet Lunch.docx** remains ungrouped despite the Documents category. Likely the tab’s URL does not match current rules (e.g. not `word.office.com` / SharePoint / `docs.google.com`).

---

## 3. Jira Kanban tab ungrouped while “Workflow” exists

**Screenshot:** same as above.

**Site Reliability Engineering - Kanban** stays ungrouped at the top, while another Jira tab sits inside **Workflow**. Likely a different Jira host or path (e.g. custom domain, `jira.company.com` not `*.atlassian.net`).

---

## 4. Ungrouped “Authorization | Employee | Access” tab

**Screenshot:** same as above.

Unclear category (internal auth / HR). No rule matches; acceptable until AI / custom rules exist, or add explicit patterns if URL is stable.

---

## 5. Ungrouped what3words marketing tab

**Screenshot:** same as above.

General web; correctly uncategorized by design. Listed only if we later want a catch-all “Web” / “Other” group.
