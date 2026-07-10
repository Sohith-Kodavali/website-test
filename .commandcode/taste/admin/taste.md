# admin
- Admin dashboard CMS should show only four tabs: Menu, Raw Chicken, Combos, and Occasions. Exclude everything else (hero, badge, stats, testimonials, instagram, about, why cards, contact, social, settings). Confidence: 0.90
- Admin authentication should use password-only login (no username field) — there is only a single admin user. Confidence: 0.85
- Keep the "Add Category" section inline within the Menu tab, not as a separate section. Confidence: 0.70
- Craft My Plate items should mirror Menu items — they share the same items but have separate pricing. No "add item" option for craft (only disable/enable existing items). Confidence: 0.70
- When a new menu category is added via the inline category manager, it must immediately appear as a filter tab in the Menu panel (the category filter buttons like chicken, biryani, etc.). Adding the category to Firestore is not enough — the filter tabs must refresh to include the new category. Confidence: 0.70
- Craft My Plate should use the same categories as the Menu for filtering — do not maintain separate craft-specific categories. The category tabs shown in Craft My Plate should mirror the menu category tabs. Confidence: 0.70
