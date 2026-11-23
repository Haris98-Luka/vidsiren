package com.vidsiren.app

import android.app.*
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class AlarmService : FirebaseMessagingService() {
    override fun onMessageReceived(m: RemoteMessage) {
        val ch = "alarm_v1"
        val nm = getSystemService(NotificationManager::class.java)
        if (nm.getNotificationChannel(ch) == null) {
            val c = NotificationChannel(ch, "Video alarm", NotificationManager.IMPORTANCE_HIGH)
            c.setSound(Uri.parse("android.resource://$packageName/raw/siren"),
                AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
            c.enableVibration(true)
            c.vibrationPattern = longArrayOf(0, 600, 200, 600, 200, 600)
            c.lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            nm.createNotificationChannel(c)
        }
        val i = Intent(Intent.ACTION_VIEW, Uri.parse(m.data["url"] ?: "https://www.youtube.com"))
        val pi = PendingIntent.getActivity(this, 0, i, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val n = NotificationCompat.Builder(this, ch)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("🚨 " + (m.data["channel"] ?: "New video"))
            .setContentText(m.data["title"] ?: "")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setContentIntent(pi).setFullScreenIntent(pi, true).setAutoCancel(true).build()
        n.flags = n.flags or Notification.FLAG_INSISTENT   // siren tab tak repeat hoti hai jab tak aap dismiss na karein
        nm.notify(System.currentTimeMillis().toInt(), n)
    }
}
