# dane

Shade of Grey Great Danes website. The static site includes a searchable Great Dane photo gallery and same-site puppy product profiles. Puppy inventory is stored locally in `data/great-dane-puppies.js`; it begins empty until real puppy details, approved photos, and actual prices are supplied.

## Run locally

Serve this folder with any static web server so the site can load `data/great-dane-photos.json`.

## Refresh the photo collection

Run `scripts/fetch-great-dane-photos.ps1` from PowerShell to refresh the open-license photo gallery. See [PHOTO-GALLERY-SETUP.md](PHOTO-GALLERY-SETUP.md) for collection licensing and the puppy listing data format.
