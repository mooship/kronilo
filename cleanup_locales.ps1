# Script to clean up natural language translation references from locale files

$locales = @('af', 'cs', 'da', 'fi', 'nb', 'pl', 'pt-PT', 'ro', 'sv', 'tr', 'uk')

foreach ($locale in $locales) {
    $filePath = "c:\Users\TimothyBrits\GitHub\kronilo\public\locales\$locale\translation.json"

    if (Test-Path $filePath) {
        Write-Host "Processing $locale..."

        # Read the file content
        $content = Get-Content $filePath -Raw -Encoding UTF8

        # Update app subtitle and description patterns
        $content = $content -replace '"subtitle": "([^"]+)Cron[^"]*Translator"', '"subtitle": "$1Cron Validator"'
        $content = $content -replace '"subtitle": "([^"]+)Cron[^"]*Vertaler"', '"subtitle": "$1Cron Validator"'
        $content = $content -replace '"subtitle": "([^"]+)Cron[^"]*oversætter"', '"subtitle": "$1Cron Validator"'
        $content = $content -replace '"subtitle": "([^"]+)Cron[^"]*překladač"', '"subtitle": "$1Cron Validator"'

        # Generic app description updates
        $content = $content -replace '"description": "[^"]*between cron[^"]*natural language[^"]*"', '"description": "Instantly validate and inspect cron expressions."'
        $content = $content -replace '"description": "[^"]*tussen cron[^"]*natuurlijke taal[^"]*"', '"description": "Valideer en inspecteer direct cron-expressies."'
        $content = $content -replace '"description": "[^"]*mellem cron[^"]*naturligt sprog[^"]*"', '"description": "Valider og inspicér cron-udtryk øjeblikkeligt."'
        $content = $content -replace '"description": "[^"]*mezi cron[^"]*přirozeným jazykem[^"]*"', '"description": "Okamžitě ověřte a zkontrolujte cron výrazy."'

        # Remove entire translation block
        $content = $content -replace ',\s*"translation":\s*\{[^}]*\}', ''

        # Clean up actions block - remove generateCron, translating, rateLimited
        $content = $content -replace ',\s*"generateCron":[^,]*', ''
        $content = $content -replace ',\s*"translating":[^,]*', ''
        $content = $content -replace ',\s*"rateLimited":[^}]*', ''

        # Clean up errors block - remove translation-related errors
        $content = $content -replace ',\s*"rateLimitExceeded":[^,]*', ''
        $content = $content -replace ',\s*"inputTooLong":[^,]*', ''
        $content = $content -replace ',\s*"inputEmpty":[^,]*', ''
        $content = $content -replace ',\s*"translationFailed":[^}]*', ''

        # Write the cleaned content back
        $content | Set-Content $filePath -Encoding UTF8 -NoNewline

        Write-Host "Completed $locale"
    }
}

Write-Host "Locale cleanup completed!"
