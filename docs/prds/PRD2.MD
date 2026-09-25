## Navigation and Browsing Grouping Update

The current live MVP uses a flat top navigation containing pages such as Home, Audio Narratives, Epilogue, Archive, Atlas, Oxford, British Museum, Met Museum, SMB, Restitution, Survival, 1897 Context Images, and Author.

This should be reorganized into grouped browsing modes to make the exhibition easier to navigate and to prevent the header from becoming overcrowded as new atlas and museum pages are added.

### Required top-level navigation groups

1. Home
2. Listen
3. Explore
4. Museums
5. Context
6. About

### Group mappings

Home:
- Home

Listen:
- Audio Narratives

Explore:
- Atlas
- Archive

Museums:
- Oxford
- British Museum
- Met Museum
- SMB

Context:
- Restitution
- Survival
- 1897 Context Images
- Epilogue

About:
- Author

### UX requirements

- Replace the flat header with grouped navigation.
- Keep the existing routes working.
- Do not delete or rename existing pages unless redirects are added.
- The active page should still be visibly highlighted.
- Group labels should be visible in the desktop nav.
- On hover or click, grouped items should reveal their child pages.
- On mobile, groups should expand/collapse inside the mobile menu.
- The navigation must work in the static React deployment.
- Do not add a backend, database, auth, or CMS.

### Recommended desktop nav

Benin Exhibition | Home | Listen | Explore | Museums | Context | About

### Recommended grouped menu behavior

Explore opens:
- Atlas
- Archive

Museums opens:
- Oxford
- British Museum
- Met Museum
- SMB

Context opens:
- Restitution
- Survival
- 1897 Context Images
- Epilogue

About opens:
- Author

### Future-proofing

The Museums group should be designed so more institution pages can be added later without overcrowding the main header.

Potential future museum entries:
- Vienna
- Cambridge
- Hamburg
- Köln
- Dresden / Leipzig
- Stuttgart
- Netherlands
- Stockholm
- Smithsonian
- Field Museum
- Penn Museum