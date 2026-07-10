# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/


# communication
- When presenting multiple options, wait for confirmation before implementing a choice. Confidence: 0.70

# backend
- Use Firebase (Firestore) for backend — site data should live in Firestore and load from there on public pages, not just hardcoded defaults. Admin saves must sync to Firestore so changes persist across all devices. Confidence: 0.75

# admin
- Admin dashboard CMS should show only four tabs: Menu, Raw Chicken, Combos, and Occasions. Exclude everything else (hero, badge, stats, testimonials, instagram, about, why cards, contact, social, settings). Confidence: 0.90
- Admin authentication should use password-only login (no username field) — there is only a single admin user. Confidence: 0.85
- Keep the "Add Category" section inline within the Menu tab, not as a separate section. Confidence: 0.70
- Craft My Plate items should mirror Menu items — they share the same items but have separate pricing. No "add item" option for craft (only disable/enable existing items). Confidence: 0.70

# raw-chicken
- Remove the "Show on Home Page" toggle option from all raw chicken items. Confidence: 0.70

# frontend
- Preserve scroll-reveal animations and loader — fix observer timing/initialization issues rather than removing them to make content visible. Confidence: 0.75

# naming
- Use "Order Online" instead of "Menu" for the menu page and navigation links. Confidence: 0.60

# workflow
- Push changes to the repository after making them, without needing to be asked. Confidence: 0.85

# architecture
- Centralize the WhatsApp number in a single configuration source, designed to support admin portal management in the future. Confidence: 0.70

