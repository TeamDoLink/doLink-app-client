package {{PACKAGE_NAME}}

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * ShareActivity만 finish() 하기 위한 네이티브 모듈.
 * 현재 Activity가 ShareActivity일 때만 finish()를 호출하여 프로세스는 유지한다.
 */
class ShareActivityModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ShareActivityModule"

    @ReactMethod
    fun finishShareActivity() {
        val activity = getReactApplicationContext().getCurrentActivity() ?: return
        (activity as? ShareActivity)?.finish()
    }
}
