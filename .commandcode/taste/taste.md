# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/


# communication
- When presenting multiple options, wait for confirmation before implementing a choice. Confidence: 0.70

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

# workflow
- Push changes to the repository after making them, without needing to be asked. Confidence: 0.85
- When asked to verify changes (especially during migrations or risky operations), do a slow, strict, thorough verification — check every feature, mobile UI rendering, backend loading, and edge cases; prioritize completeness over speed and use as many tokens as needed. Confidence: 0.70

# architecture
- Centralize the WhatsApp number in a single configuration source, designed to support admin portal management in the future. Confidence: 0.70
- When modifying shared backend functions, create isolated targeted solutions rather than changing the generic helper — keep existing functionality untouched. Confidence: 0.65

# debugging
- When fixing a bug caused by a pattern (e.g., hardcoded value that should be dynamic), search the entire codebase for all other instances of the same root cause and fix them together. Confidence: 0.70
- Always check for UI errors — verify mobile rendering, footer visibility on all screen sizes, layout issues, and responsive design elements as part of every change. Confidence: 0.85

# firebase-migration
- When migrating Firebase to a new account, ensure no features break — verify all pages, admin functions, and data seeding work after swapping config keys. Confidence: 0.70
- When migrating Firebase projects, build a one-click script to migrate ALL existing data (all collections with full documents, IDs, timestamps, and field values) from old Firestore to new Firestore — do not rely on re-seeding defaults. Confidence: 0.85

# firestore
- Firestore requires a composite index for `orderBy` queries — when using `orderBy('created_at', 'desc')`, Firebase logs an index creation link in the browser console on first query; click it to create the index instantly. Confidence: 0.70

# ux
- Add haptic feedback (vibration) and sound effects to every interactive action across the site — not just cart and order placement. Confidence: 0.80

