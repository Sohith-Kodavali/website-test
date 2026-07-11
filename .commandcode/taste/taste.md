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

# architecture
- Centralize the WhatsApp number in a single configuration source, designed to support admin portal management in the future. Confidence: 0.70

