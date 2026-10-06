# Great Dane photo collection

The Available Puppies page has an inventory area plus a searchable reference gallery backed by `data/great-dane-photos.json`. The home page also uses photos from this collection. Photos are found through Openverse, a search service for openly licensed media. Building the gallery manifest needs no API key, paid account, Node.js, or downloaded image files.

## Add real puppy listings

Puppy cards and full same-site puppy profiles use `data/great-dane-puppies.js`. The file starts empty so the site does not invent puppies, photos, health details, or sale prices. When you have real listings, add entries with a unique `slug`, `name`, `gender`, `color_pattern`, the actual numeric `price`, `adoption_status` (`available`, `reserved`, or `adopted`), and one or more approved puppy photos (`{ url, alt }`). Optional fields include `date_of_birth` or confirmed `age_label`, `location`, `description`, `personality`, `health_info`, `health_guarantee`, `vaccination_info`, `registration_info`, `adoption_info`, and `availability_date`. Profile clicks change content inside this site; they do not send visitors to a separate listing website. Keep individual prices accurate. The available puppies page also displays a general U.S. market range of $1,000–$3,500+ from [CareCredit's Great Dane price guide](https://www.carecredit.com/well-u/pet-care/great-dane-dog-breed/); that estimate is not a quote for your puppies.

## Build or refresh the collection

Open PowerShell in the project folder and run:

```powershell
.\scripts\fetch-great-dane-photos.ps1
```

If this computer's PowerShell execution policy blocks local scripts, use this one-time invocation instead. It runs the project script without changing the computer's policy:

```powershell
& ([scriptblock]::Create((Get-Content -LiteralPath '.\scripts\fetch-great-dane-photos.ps1' -Raw)))
```

The collector searches Great Dane puppies and adults, keeps results only when their title, description, or tags identify a Great Dane, excludes noncommercial licenses, removes duplicate Openverse IDs and image URLs, then checks each image URL before saving it. The target is up to 500 photos, with up to 400 puppy results. Openverse may provide fewer qualifying photos; the script reports its actual puppy/adult counts and never pads the gallery with duplicates or invented URLs. Search metadata is not perfect, so review the source page before publishing.

## Licensing and attribution

Each saved item includes its source page, creator, and license URL. Each gallery card links to that source and license. The collector accepts CC0, CC BY, CC BY-SA, and CC BY-ND items, all of which permit commercial reuse subject to their terms. Keep the linked credits with the photos, and review license details on the source page before using an image. The gallery displays the original image without cropping and does not download or rehost the files.

The manifest is `data/great-dane-photos.json`; the site loads it as a static file, so include it when deploying the site. The refresh script requires an internet connection to Openverse and image hosts. This site keeps its existing contact information; replace the legacy email address only if you have a new address for the Great Dane business.
