#!/usr/bin/env bash
# Build the signed APK on this PC (same tools as the DEA app: C:\dev\jdk21, C:\dev\android-sdk, cached Gradle 9.3.1).
# Usage (Git Bash, from the repo root):  bash android/build-local.sh 2.0.1 3
set -euo pipefail
VER="${1:-1.0.0}"; CODE="${2:-1}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
B=/c/dev/cc_build                       # build mirror without spaces in the path
KEYDIR="/d/Fall 2026/Compiler/android-signing"
mkdir -p "$B" /c/dev/cc_signing
cp -r "$REPO/android/." "$B/"
echo 'sdk.dir=C:/dev/android-sdk' > "$B/local.properties"
cp "$KEYDIR/cc-course-release.p12" /c/dev/cc_signing/
D="$B/app/src/main/assets/site"; rm -rf "$D"; mkdir -p "$D/vendor/fonts"
cp "$REPO/index.html" "$REPO/lectures-1-3.html" "$D/"; cp -r "$REPO/assets" "$D/assets"
cd "$D/vendor"
curl -fsSL -o bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
curl -fsSL -o bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
curl -fsSL -o chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
curl -fsSL -o highlight.min.js https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
curl -fsSL -o atom-one-dark.min.css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
curl -fsSL -o bootstrap-icons.min.css https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css
curl -fsSL -o fonts/bootstrap-icons.woff2 https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2
curl -fsSL -o fonts/bootstrap-icons.woff https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff
cd "$D"
sed -i -e 's#https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css#vendor/bootstrap.min.css#g' \
 -e 's#https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js#vendor/bootstrap.bundle.min.js#g' \
 -e 's#https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js#vendor/chart.umd.min.js#g' \
 -e 's#https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js#vendor/highlight.min.js#g' \
 -e 's#https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css#vendor/atom-one-dark.min.css#g' \
 -e 's#https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css#vendor/bootstrap-icons.min.css#g' lectures-1-3.html
export JAVA_HOME=/c/dev/jdk21 ANDROID_HOME='C:\dev\android-sdk' PATH=/c/dev/jdk21/bin:$PATH
export KEYSTORE_FILE='C:\dev\cc_signing\cc-course-release.p12' KEY_ALIAS=cc-course VERSION_CODE="$CODE" VERSION_NAME="$VER"
export KEYSTORE_PASSWORD="$(sed -n 's/^Password (store and key): //p' "$KEYDIR/KEYSTORE-PASSWORD.txt" | tr -d '\r\n')"
G="$(ls -d ~/.gradle/wrapper/dists/gradle-9.3.1-all/*/gradle-9.3.1)/bin/gradle"
cd "$B" && "$G" --no-daemon assembleRelease
cp "$B/app/build/outputs/apk/release/app-release.apk" "/d/Fall 2026/Compiler/CompilerConstruction.apk"
echo "APK: D:\Fall 2026\Compiler\CompilerConstruction.apk"
