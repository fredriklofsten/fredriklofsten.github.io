package se.rymdakademin.app;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Build;
import android.webkit.JavascriptInterface;

/* Det här objektet heter window.AndroidApp i JavaScript. */
public class AppBridge {
    private final Activity a;
    AppBridge(Activity a) { this.a = a; }

    @JavascriptInterface public void setReminder(int hour, int minute) {
        if (Build.VERSION.SDK_INT >= 33 && a.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            a.runOnUiThread(new Asker(a));
        Reminders.save(a, hour, minute);
        Reminders.schedule(a);
    }
    @JavascriptInterface public void cancelReminder() { Reminders.save(a, -1, 0); Reminders.cancel(a); }
    @JavascriptInterface public String version() { return BuildInfo.VERSION; }
}

class Asker implements Runnable {
    private final Activity a;
    Asker(Activity a) { this.a = a; }
    public void run() { if (Build.VERSION.SDK_INT >= 23) a.requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1); }
}
