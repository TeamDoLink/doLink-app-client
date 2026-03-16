package {{PACKAGE_NAME}}

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.ReactActivityDelegateWrapper

/**
 * ShareActivity - 외부 앱 공유를 위한 투명 ReactActivity
 *
 * MainActivity와 완전히 분리되어 독립적으로 실행됩니다.
 * 'share-intent' 컴포넌트를 렌더링하여 ShareIntentModal만 표시합니다.
 * 투명 테마가 적용되어 외부 앱이 배경에 보입니다.
 */
class ShareActivity : ReactActivity() {

    // MainActivity의 'main' 대신 'share-intent' 컴포넌트 사용
    override fun getMainComponentName(): String = "share-intent"

  /**
   * ReactActivityDelegate.onUserLeaveHint() 내부 NPE를 피하기 위해 오버라이드.
   *
   * 공유 전용 투명 액티비티에서는 사용자 이탈(onUserLeaveHint) 이벤트를
   * RN 쪽에 전달할 필요가 없고, ShareActivity를 finish() 하는 타이밍에
   * ReactActivityDelegate가 아직 완전히 초기화되지 않아 NPE가 발생하는
   * RN 버그가 존재하여 super 호출을 의도적으로 생략한다.
   */
  override fun onUserLeaveHint() {
    // no-op: super.onUserLeaveHint()를 호출하지 않는다.
  }

    override fun onCreate(savedInstanceState: Bundle?) {
        // 투명 배경 설정
        window.setBackgroundDrawableResource(android.R.color.transparent)
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)

        super.onCreate(savedInstanceState)
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            object : DefaultReactActivityDelegate(
                this,
                mainComponentName,
                fabricEnabled
            ) {
                override fun getLaunchOptions(): Bundle {
                    return getShareIntentBundle()
                }
            }
        )
    }

    private fun getShareIntentBundle(): Bundle {
        val bundle = Bundle()
        val action = intent?.action
        val type = intent?.type

        if (Intent.ACTION_SEND == action && type != null) {
            when {
                type.startsWith("text/") -> {
                    val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
                    val sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT)
                    val url = sharedText?.let { extractUrl(it) }
                    val imageUri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)

                    bundle.putString("text", sharedText)
                    bundle.putString("title", sharedTitle)
                    bundle.putString("url", url)
                    bundle.putString("thumbnailUrl", imageUri?.toString())
                    bundle.putString("type", if (url != null) "weburl" else "text")
                }
                type.startsWith("image/") -> {
                    val imageUri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                    val sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT)
                    val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)

                    bundle.putString("text", sharedText)
                    bundle.putString("title", sharedTitle)
                    bundle.putString("thumbnailUrl", imageUri?.toString())
                    bundle.putString("type", "file")
                }
            }
        }

        return bundle
    }

    private fun extractUrl(text: String): String? {
        val urlPattern = Regex("https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+")
        return urlPattern.find(text)?.value
    }
}
