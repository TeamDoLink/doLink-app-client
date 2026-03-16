package {{PACKAGE_NAME}}

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * ShareActivity 관련 제어를 위한 네이티브 모듈.
 * - ShareActivity만 finish() 하거나
 * - MainActivity를 Intent로 띄우는 기능을 제공한다.
 */
class ShareActivityModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ShareActivityModule"

    @ReactMethod
    fun finishShareActivity() {
        val activity = reactApplicationContext.currentActivity ?: return
        (activity as? ShareActivity)?.finish()
    }

    @ReactMethod
    fun openMainApp() {
        val activity = reactApplicationContext.currentActivity ?: return

        val intent = Intent(activity, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        activity.startActivity(intent)

        if (activity is ShareActivity) {
            activity.finish()
        }
    }
}
