# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/


# communication
- When presenting multiple options, wait for confirmation before implementing a choice. Confidence: 0.75
- Use simple, non-technical explanations — the user is not a developer and gets confused by technical jargon; guide step-by-step with clear instructions and avoid assuming technical knowledge. Confidence: 0.80
- When fixing bugs or making changes, flag any change that would alter the current user-facing behavior/UX before implementing it — the user wants to be notified before existing usage patterns are modified. Confidence: 0.85
- When the user asks for limits/numbers to share with the restaurant owner, present them in business terms (customers/day, orders/day, visits/day) — not technical metrics like Firestore reads/writes/quota percentages. The owner doesn't understand or care about database operations. Confidence: 0.75

# backend
- Use MySQL on Hostinger for backend — migrate away from Firebase Firestore to a PHP API + MySQL setup hosted on Hostinger. The website should work exactly the same, all features preserved, with the only change being a slightly longer data refresh interval. The PHP API should be a single api.php endpoint handling all CRUD via fetch() from the frontend. Confidence: 0.65
- Rewrite the entire codebase (backend AND frontend/public_html) from scratch rather than incrementally patching — user has dropped the whole database and all files, wants a clean-slate rebuild with no Firebase references anywhere. Confidence: 0.85
- Shift back to Firebase — user has reversed the MySQL/Hostinger migration decision and wants to use Firebase instead. Use the optimized Firebase setup (listRecent polling, 60s interval, caching) that keeps reads well under limits. Confidence: 0.80

# workflow
See [workflow/taste.md](workflow/taste.md)

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
- When asked to add specific elements to a page, only add exactly what was requested — do not make any other unrelated changes to that page. Keep everything else as it was. Confidence: 0.85

# workflow
See [workflow/taste.md](workflow/taste.md)
# architecture
- Centralize the WhatsApp number in a single configuration source, designed to support admin portal management in the future. Confidence: 0.70
- When modifying shared backend functions, create isolated targeted solutions rather than changing the generic helper — keep existing functionality untouched. Confidence: 0.65
- The WhatsApp order redirect pattern (setTimeout + anchor click + target=_blank) should be identical across all ordering pages — Craft My Plate, Order Online/Menu, and Raw Chicken should use the same shared function rather than duplicated code with slight variations. Confidence: 0.70

# debugging
- When fixing a bug caused by a pattern (e.g., hardcoded value that should be dynamic), search the entire codebase for all other instances of the same root cause and fix them together. Confidence: 0.80
- Always check for UI errors — verify mobile rendering, footer visibility on all screen sizes, layout issues, and responsive design elements as part of every change. Confidence: 0.85

# firebase-migration
- Rename firebase.js and all firebase-related naming to reflect the MySQL backend (e.g., api-bridge.js) — don't keep "firebase" in filenames, variable names, or comments now that Firebase is fully removed. Confidence: 0.75
- When migrating Firebase to a new account, ensure no features break — verify all pages, admin functions, and data seeding work after swapping config keys. Confidence: 0.70
- When migrating Firebase projects, build a one-click script to migrate ALL existing data (all collections with full documents, IDs, timestamps, and field values) from old Firestore to new Firestore — do not rely on re-seeding defaults. Confidence: 0.85
- When exporting Firestore data to MySQL SQL, handle schema mismatches — Firestore documents may have fields that don't exist in the MySQL table schema; either skip unknown columns or auto-generate ALTER TABLE statements to add them before the INSERTs. Confidence: 0.70

# firestore
- Firestore requires a composite index for `orderBy` queries — when using `orderBy('created_at', 'desc')`, Firebase logs an index creation link in the browser console on first query; click it to create the index instantly. Confidence: 0.70
- Avoid client-side caching of Firestore data — do not add in-memory promise caches, localStorage wrappers, or any caching layer between Firestore and the UI. All data should come fresh from the backend on every load. Client-side caching has caused persistent issues in this project. Confidence: 0.75
- Firestore security rules require `if` conditions on `allow` statements — use `allow read, write: if true;` not `allow read, write: true;`. Confidence: 0.70

# ux
- Add haptic feedback (vibration) and sound effects to every interactive action across the site — not just cart and order placement. Confidence: 0.80

# walkthrough
- The walkthrough/tour feature has been removed — do not add it back. The user decided against it after seeing it in action. Confidence: 0.85

# formatting
- Use 24-hour format (HH:MM) internally throughout admin and data storage; display times in 12-hour format to customers on public-facing pages. Confidence: 0.70

# craft-my-plate
See [craft-my-plate/taste.md](craft-my-plate/taste.md)
