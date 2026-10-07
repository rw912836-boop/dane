$ErrorActionPreference = 'Stop'
$scriptDirectory = if ($PSScriptRoot) { $PSScriptRoot } else { Join-Path (Get-Location).Path 'scripts' }
$root = Split-Path -Parent $scriptDirectory
$output = Join-Path $root 'data\great-dane-photos.json'
$javascriptOutput = Join-Path $root 'data\great-dane-photos.js'
$userAgent = 'GreatDanePhotoGallery/1.0 (Openverse public image search)'
$searches = @(
  @{ age = 'puppy'; q = 'great dane puppy' }, @{ age = 'puppy'; q = 'great dane pup' },
  @{ age = 'puppy'; q = 'young great dane puppy' }, @{ age = 'puppy'; q = 'baby great dane' },
  @{ age = 'puppy'; q = 'great dane puppy playing' }, @{ age = 'puppy'; q = 'great dane sleeping puppy' },
  @{ age = 'puppy'; q = 'harlequin great dane puppy' }, @{ age = 'puppy'; q = 'blue great dane puppy' },
  @{ age = 'puppy'; q = 'brindle great dane puppy' }, @{ age = 'puppy'; q = 'great dane 8 weeks' },
  @{ age = 'adult'; q = 'great dane adult' }, @{ age = 'adult'; q = 'large great dane' },
  @{ age = 'adult'; q = 'great dane dog' }, @{ age = 'adult'; q = 'great dane portrait' },
  @{ age = 'adult'; q = 'great dane outdoors' }, @{ age = 'adult'; q = 'great dane harlequin' },
  @{ age = 'adult'; q = 'great dane fawn' }, @{ age = 'adult'; q = 'great dane blue' }
)
$photos = [System.Collections.Generic.List[object]]::new()
$seenIds = [System.Collections.Generic.HashSet[string]]::new()
$seenUrls = [System.Collections.Generic.HashSet[string]]::new()
$pageSize = 20
$puppyLimit = 400
$adultLimit = 150

foreach ($search in $searches) {
  $puppyCount = @($photos | Where-Object category -eq 'puppy').Count
  $adultCount = @($photos | Where-Object category -eq 'adult').Count
  if ($photos.Count -ge 500 -or ($search.age -eq 'puppy' -and $puppyCount -ge $puppyLimit) -or ($search.age -eq 'adult' -and $adultCount -ge $adultLimit)) { continue }

  $page = 1
  do {
    $q = [uri]::EscapeDataString($search.q)
    $uri = "https://api.openverse.org/v1/images/?q=$q&page_size=$pageSize&page=$page&license=cc0%2Cby%2Cby-sa%2Cby-nd"
    try {
      $result = Invoke-RestMethod -Uri $uri -Headers @{ 'User-Agent' = $userAgent } -TimeoutSec 30
    } catch {
      Write-Warning "Openverse search failed for '$($search.q)' on page ${page}: $($_.Exception.Message)"
      break
    }

    foreach ($image in $result.results) {
      $id = [string]$image.id
      $imageUrl = [string]$image.url
      if (-not $id -or -not $imageUrl -or $seenIds.Contains($id) -or $seenUrls.Contains($imageUrl)) { continue }
      if ($image.license -notin @('cc0','by','by-sa','by-nd')) { continue }

      $tagNames = @($image.tags | ForEach-Object { [string]$_.name })
      $description = [string]$image.description
      $title = [string]$image.title
      $searchText = (($title,$description,$tagNames) -join ' ').ToLowerInvariant()
      if ($searchText -notmatch 'great[\s-]?dane|greatdane') { continue }

      $young = $searchText -match 'pupp(y|ies)|\bpup\b|young|baby|litter|\b\d+\s*(weeks?|months?)\b'
      $category = if ($young) { 'puppy' } else { 'adult' }
      $puppyCount = @($photos | Where-Object category -eq 'puppy').Count
      $adultCount = @($photos | Where-Object category -eq 'adult').Count
      if ($photos.Count -ge 500 -or ($category -eq 'puppy' -and $puppyCount -ge $puppyLimit) -or ($category -eq 'adult' -and $adultCount -ge $adultLimit)) { continue }

      $tagText = "$searchText $($search.q)"
      $tags = [System.Collections.Generic.List[string]]::new()
      $tags.Add($category)
      $tags.Add($(if ($category -eq 'puppy') { 'small' } else { 'large' }))
      foreach ($term in @('harlequin','black','blue','mantle','merle','fawn','brindle','playing','sleeping','portrait','outdoor','indoor','group','running','walking','sitting','standing','lying')) {
        if ($tagText.Contains($term)) { $tags.Add($(if ($term -eq 'lying') { 'lying down' } else { $term })) }
      }
      $color = @('harlequin','black','blue','mantle','merle','fawn','brindle') | Where-Object { $tagText.Contains($_) } | Select-Object -First 1
      $licenseLabel = switch ($image.license) {
        'cc0' { 'CC0' }
        'by' { "CC BY $($image.license_version)" }
        'by-sa' { "CC BY-SA $($image.license_version)" }
        'by-nd' { "CC BY-ND $($image.license_version)" }
      }
      $photos.Add([pscustomobject]@{
        id = $id; url = $image.url; thumbnail = $image.thumbnail
        source = [string]$image.provider; sourceUrl = [string]$image.foreign_landing_url
        title = $title; alt = $(if ($title) { $title } elseif ($description) { $description } else { 'Great Dane photo' })
        description = $description; photographer = [string]$image.creator
        photographerUrl = [string]$image.creator_url; attribution = [string]$image.attribution
        license = $licenseLabel; licenseUrl = [string]$image.license_url
        category = $category; categories = @($tags | Select-Object -Unique)
        color = $(if ($color) { $color } else { 'unspecified' })
        ageGroup = $(if ($category -eq 'puppy') { 'young' } else { 'adult' })
      })
      [void]$seenIds.Add($id)
      [void]$seenUrls.Add($imageUrl)
    }

    $page++
    Start-Sleep -Milliseconds 1100
  } while ($result.results.Count -ge $pageSize -and ($page - 1) * $pageSize -lt $result.result_count -and $page -le 12)
}

# Check actual source image URLs and drop any that no longer respond.
$reachablePhotos = [System.Collections.Generic.List[object]]::new()
$unavailable = 0
foreach ($photo in $photos) {
  try {
    $response = Invoke-WebRequest -Uri $photo.url -Method Head -TimeoutSec 12 -MaximumRedirection 5
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) { $reachablePhotos.Add($photo) } else { $unavailable++ }
  } catch {
    $unavailable++
  }
}

$manifest = if ($reachablePhotos.Count) { ConvertTo-Json -InputObject @($reachablePhotos) -Depth 8 } else { '[]' }
[System.IO.File]::WriteAllText($output, $manifest, [System.Text.UTF8Encoding]::new($false))
$javascriptManifest = "window.greatDanePhotos = $manifest;`n"
[System.IO.File]::WriteAllText($javascriptOutput, $javascriptManifest, [System.Text.UTF8Encoding]::new($false))
$puppyCount = @($reachablePhotos | Where-Object category -eq 'puppy').Count
$adultCount = $reachablePhotos.Count - $puppyCount
Write-Host "Saved $($reachablePhotos.Count) unique, link-checked Openverse photos: $puppyCount puppy/small and $adultCount adult/large."
Write-Host "Removed $unavailable unreachable image URLs."
if ($reachablePhotos.Count -lt 500) { Write-Host 'Openverse has fewer qualifying images than the 500-photo target; the collection is not padded with duplicates or invented URLs.' }
