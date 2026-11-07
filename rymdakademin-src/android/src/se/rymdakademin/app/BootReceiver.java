package se.rymdakademin.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/* Larm försvinner när telefonen startas om, så de läggs in igen här. */
public class BootReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context c, Intent i) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(i.getAction())) Reminders.schedule(c);
    }
}
