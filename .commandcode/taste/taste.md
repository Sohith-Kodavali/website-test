# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/


# communication
- When presenting multiple options, wait for confirmation before implementing a choice. Confidence: 0.70
- Use simple, non-technical explanations — the user is not a developer and gets confused by technical jargon; guide step-by-step with clear instructions and avoid assuming technical knowledge. Confidence: 0.75
- When fixing bugs or making changes, flag any change that would alter the current user-facing behavior/UX before implementing it — the user wants to be notified before existing usage patterns are modified. Confidence: 0.65

# backend
- Use Firebase (Firestore) for backend — site data should live in Firestore and load from there on public pages, not just hardcoded defaults. Admin saves must sync to Firestore so changes persist across all devices. Confidence: 0.75

# admin
See [admin/taste.md](admin/taste.md)
# raw-chicken
- Remove the "Show on Home Page" toggle option from all raw chicken items. Confidence: 0.70

# chefs-pick
- Chef's Pick should only be shown on the ordering page, not on the home page. Confidence: 0.70

# frontend
- Preserve scroll-reveal animations and loader — fix observer timing/initialization issues rather than removing them to make content visible. Confidence: 0.75

# naming
- Use "Order Online" instead of "Menu" for the menu page and navigation links. Confidence: 0.60

# scope
- When asked to add specific elements to a page, only add exactly what was requested — do not make any other unrelated changes to that page. Keep everything else as it was. Confidence: 0.80

# workflow
- Push changes to the repository after making them, without needing to be asked. Confidence: 0.90
- When the project is deployed to Vercel, suggest checking the live Vercel URL instead of opening local files for verification. Confidence: 0.90
- When asked to verify changes (especially during migrations or risky operations), do a slow, strict, thorough verification — check every feature, mobile UI rendering, backend loading, and edge cases; prioritize completeness over speed and use as many tokens as needed. Confidence: 0.80
- For the RRK project in OpenCode, the user is logged into a specific GitHub account that should be used for all RRK-related commits — if the terminal is logged into a different account for other projects, switch back before working on RRK. Confidence: 0.70
- After each big change is completed, test it and trace all connected code paths to verify nothing is broken — do not just verify the changed code in isolation, check upstream and downstream dependencies too. Confidence: 0.85

# architecture
- Centralize the WhatsApp number in a single configuration source, designed to support admin portal management in the future. Confidence: 0.70
- When modifying shared backend functions, create isolated targeted solutions rather than changing the generic helper — keep existing functionality untouched. Confidence: 0.65
- The WhatsApp order redirect pattern (setTimeout + anchor click + target=_blank) should be identical across all ordering pages — Craft My Plate, Order Online/Menu, and Raw Chicken should use the same shared function rather than duplicated code with slight variations. Confidence: 0.70

# debugging
- When fixing a bug caused by a pattern (e.g., hardcoded value that should be dynamic), search the entire codebase for all other instances of the same root cause and fix them together. Confidence: 0.70
- Always check for UI errors — verify mobile rendering, footer visibility on all screen sizes, layout issues, and responsive design elements as part of every change. Confidence: 0.85

# firebase-migration
- When migrating Firebase to a new account, ensure no features break — verify all pages, admin functions, and data seeding work after swapping config keys. Confidence: 0.70
- When migrating Firebase projects, build a one-click script to migrate ALL existing data (all collections with full documents, IDs, timestamps, and field values) from old Firestore to new Firestore — do not rely on re-seeding defaults. Confidence: 0.85

# firestore
- Firestore requires a composite index for `orderBy` queries — when using `orderBy('created_at', 'desc')`, Firebase logs an index creation link in the browser console on first query; click it to create the index instantly. Confidence: 0.70
- Avoid client-side caching of Firestore data — do not add in-memory promise caches, localStorage wrappers, or any caching layer between Firestore and the UI. All data should come fresh from the backend on every load. Client-side caching has caused persistent issues in this project. Confidence: 0.75
- Firestore security rules require `if` conditions on `allow` statements — use `allow read, write: if true;` not `allow read, write: true;`. Confidence: 0.70

# ux
- Add haptic feedback (vibration) and sound effects to every interactive action across the site — not just cart and order placement. Confidence: 0.80

# craft-my-plate
- Birthday field in the login popup should be optional, not required. Confidence: 0.75
- Craft My Plate should display an overall budget near the menu (since customers are selecting items for a whole event). The budget should reflect menu pricing, not separate craft pricing. Confidence: 0.70
- Craft My Plate item prices are NOT per-person — each selected item's price should be added once to the overall budget (just sum the selected items), do not multiply by guest count. Confidence: 0.80
- Customers must be able to add the same Craft My Plate item multiple times (allow quantity > 1 for each selected item). Confidence: 0.75
- Minimum budget per person is ₹200. Confidence: 0.70

