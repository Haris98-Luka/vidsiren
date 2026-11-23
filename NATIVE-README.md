# VidSiren native APK (app band hone par bhi alarm)
1. console.firebase.google.com par free project banayein -> Android app add karein, package name: com.vidsiren.app -> google-services.json download karein.
2. Project settings > Service accounts > "Generate new private key". Us JSON ka poora text Vercel env var FIREBASE_SERVICE_ACCOUNT mein paste karein. Redeploy.
3. capacitor.config.json mein AAPKA-APP.vercel.app ko apne Vercel link se badlein.
4. Terminal: npm install && npx cap add android
5. Copy karein:
   android-overlay/java/AlarmService.kt  -> android/app/src/main/java/com/vidsiren/app/
   android-overlay/res/raw/siren.wav     -> android/app/src/main/res/raw/
   google-services.json                  -> android/app/
6. android-overlay/manifest-additions.txt ke mutabiq AndroidManifest.xml edit karein.
7. Logo: Android Studio > New > Image Asset mein public/icon-512.png dein.
8. npx cap open android -> Android Studio mein Build > Build APK(s). APK mil jayegi.
Phone par pehli baar app khol kar "Alarm on karein" dabayein.
