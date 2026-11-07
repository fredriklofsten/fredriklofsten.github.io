package se.rymdakademin.app;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class ReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context c, Intent i) {
        Reminders.channel(c);
        PendingIntent open = PendingIntent.getActivity(c, 0, new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK), PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, Reminders.CH) : new Notification.Builder(c);
        b.setSmallIcon(R.drawable.ic_stat).setContentTitle("Dags för rymden!").setContentText("Dagens rymduppdrag väntar på dig i Rymdakademin.")
         .setContentIntent(open).setAutoCancel(true);
        try { ((NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE)).notify(1, b.build()); } catch (SecurityException e) { }
    }
}
