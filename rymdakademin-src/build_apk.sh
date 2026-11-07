#!/usr/bin/env bash
# Bygger Android-appen av out/www utan Gradle.
# Behöver: ANDROID_HOME med platforms;android-34 och build-tools;34.0.0, en JDK,
# samt nyckeln i KEYSTORE (sökväg) eller KEYSTORE_B64 (base64). Lösenord i KEYSTORE_PASS.
set -euo pipefail
cd "$(dirname "$0")"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
BT="$SDK/build-tools/34.0.0"; JAR="$SDK/platforms/android-34/android.jar"
VCODE="${VERSION_CODE:-2}"; VNAME="${VERSION_NAME:-$(date +%Y.%m.%d)}"
PASS="${KEYSTORE_PASS:-rymdakademin}"
B=out/apk; rm -rf "$B"; mkdir -p "$B/gen" "$B/classes" "$B/res" "$B/assets"
cp -r out/www "$B/assets/www"
sed -e "s/VERSION_CODE/$VCODE/" -e "s/VERSION_NAME/$VNAME/" android/AndroidManifest.xml > "$B/AndroidManifest.xml"
mkdir -p "$B/gen/se/rymdakademin/app"
printf 'package se.rymdakademin.app;\nfinal class BuildInfo { static final String VERSION = "%s"; }\n' "$VNAME" > "$B/gen/se/rymdakademin/app/BuildInfo.java"
"$BT/aapt2" compile --dir android/res -o "$B/res/res.zip"
"$BT/aapt2" link -o "$B/base.apk" -I "$JAR" --manifest "$B/AndroidManifest.xml" -A "$B/assets" --java "$B/gen" "$B/res/res.zip" \
  --min-sdk-version 24 --target-sdk-version 34 -0 woff2 -0 jpg
javac -source 8 -target 8 -nowarn -encoding UTF-8 -bootclasspath "$JAR" -classpath "$JAR" -d "$B/classes" \
  $(find android/src "$B/gen" -name '*.java')
"$BT/d8" --lib "$JAR" --min-api 24 --output "$B" $(find "$B/classes" -name '*.class')
(cd "$B" && zip -q base.apk classes.dex)
"$BT/zipalign" -f -p 4 "$B/base.apk" "$B/aligned.apk"
KS="${KEYSTORE:-}"
if [ -z "$KS" ] && [ -n "${KEYSTORE_B64:-}" ]; then KS="$B/key.jks"; echo "$KEYSTORE_B64" | base64 -d > "$KS"; fi
[ -n "$KS" ] || { echo "Ingen nyckel (KEYSTORE eller KEYSTORE_B64) - hoppar över signering"; exit 2; }
"$BT/apksigner" sign --ks "$KS" --ks-pass "pass:$PASS" --key-pass "pass:$PASS" --out out/Rymdakademin.apk "$B/aligned.apk"
"$BT/apksigner" verify out/Rymdakademin.apk
rm -f "$B/key.jks"
echo "Klar: out/Rymdakademin.apk ($VNAME, versionCode $VCODE)"
