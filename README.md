# VidSiren – setup (Urdu/Roman)
1. `npx web-push generate-vapid-keys` chalayen -> public/private key milengi.
2. Vercel par project deploy karein (is folder ko GitHub par daal kar Import karein).
3. Vercel > Storage se Upstash Redis add karein (free) – env vars khud lag jati hain.
4. Vercel > Settings > Environment Variables: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL, CRON_SECRET (koi bhi lamba password). Redeploy karein.
5. cron-job.org (free) par har 5 minute: https://AAPKA-APP.vercel.app/api/check?key=CRON_SECRET
6. APK: https://www.pwabuilder.com par app ka link dalein -> Android -> Download.
