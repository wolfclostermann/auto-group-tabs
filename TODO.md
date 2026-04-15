# TODO

- [ ] **AI integration for uncategorised tabs** — Send a request to a user-configured AI agent (base URL / API key in extension options) with the list of open tabs that did not match any built-in category (title, URL, optional favicon hint). Parse the response to assign **new dynamic category names** (and tab → category mappings), then create additional tab groups for those buckets. Fall back gracefully if the request fails or returns invalid data.
