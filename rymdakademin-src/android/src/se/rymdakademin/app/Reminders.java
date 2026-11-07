package se.rymdakademin.app;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import java.util.Calendar;

/* Daglig påminnelse om dagens rymduppdrag. */
final class Reminders {
    static final String CH = "daily";

    static SharedPreferences prefs(Context c) { return c.getSharedPreferences("reminder", Context.MODE_PRIVATE); }

    static void save(Context c, int h, int m) { prefs(c).edit().putInt("h", h).putInt("m", m).apply(); }

    static void channel(Context c) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(CH, "Dagens rymduppdrag", NotificationManager.IMPORTANCE_DEFAULT);
            ch.setDescription("En påminnelse varje dag om dagens uppdrag i Rymdakademin");
            ((NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(ch);
        }
    }

    static PendingIntent pi(Context c) {
        return PendingIntent.getBroadcast(c, 7, new Intent(c, ReminderReceiver.class), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void schedule(Context c) {
        int h = prefs(c).getInt("h", -1), m = prefs(c).getInt("m", 0);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        am.cancel(pi(c));
        if (h < 0) return;
        Calendar t = Calendar.getInstance();
        t.set(Calendar.HOUR_OF_DAY, h); t.set(Calendar.MINUTE, m); t.set(Calendar.SECOND, 0); t.set(Calendar.MILLISECOND, 0);
        if (t.getTimeInMillis() <= System.currentTimeMillis()) t.add(Calendar.DAY_OF_YEAR, 1);
        am.setInexactRepeating(AlarmManager.RTC_WAKEUP, t.getTimeInMillis(), AlarmManager.INTERVAL_DAY, pi(c));
    }

    static void cancel(Context c) { ((AlarmManager) c.getSystemService(Context.ALARM_SERVICE)).cancel(pi(c)); }
}
