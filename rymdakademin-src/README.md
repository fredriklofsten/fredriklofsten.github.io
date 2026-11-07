# Rymdakademin – källkod

Allt i appen byggs från den här mappen. Ändra i `src/`, så bygger GitHub automatiskt om
webbappen och Android-appen och lägger dem i `rymdakademin/` (som GitHub Pages visar).

| Mapp/fil | Innehåll |
|---|---|
| `src/head.html` | Sidans HTML och CSS |
| `src/*.js` | Appens kod. `data.js` och `topics.js` innehåller all fakta |
| `src/img/` | Riktiga foton från NASA (fria att använda) och `credits.json` med källor |
| `vendor/` | three.js r128, typsnitt och uppläsningsrösten (eSpeak) |
| `android/` | Android-skalet (WebView + daglig påminnelse) |
| `build.py` | Bygger `out/web` (artefaktversionen) och `out/www` (fristående) |
| `build_apk.sh` | Gör APK-filen av `out/www` |

## Bygga själv

    python3 rymdakademin-src/build.py
    KEYSTORE=min.jks ./rymdakademin-src/build_apk.sh   # kräver Android SDK 34

## Signeringsnyckeln

APK-filen måste alltid signeras med samma nyckel, annars går den inte att uppdatera.
Nyckeln ligger **inte** i repot. Lägg den som hemlighet i GitHub:
Settings → Secrets and variables → Actions → New repository secret,
namn `ANDROID_KEYSTORE_B64`, värde = innehållet i filen `nyckel-base64.txt`.
Utan hemligheten uppdateras bara webbappen.
