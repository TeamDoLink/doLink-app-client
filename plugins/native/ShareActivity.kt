package {{PACKAGE_NAME}}

import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import java.util.regex.Pattern

/**
 * ShareActivity - 메인 앱과 분리된 프로세스에서 실행되는 공유 전용 액티비티
 *
 * 다른 앱에서 공유하기(Intent.ACTION_SEND)를 통해 호출되며,
 * 네이티브 BottomSheet UI를 즉시 표시합니다.
 */
class ShareActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "ShareActivity"
        private const val PREFS_NAME = "DoLinkSharePrefs"
        private const val KEY_PENDING_SHARE = "pending_share_data"
    }

    private var sharedTitle: String = ""
    private var sharedUrl: String = ""
    private var rootLayout: FrameLayout? = null
    private var bottomSheet: LinearLayout? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 투명 배경 및 상태바 설정
        setupWindow()

        // 루트 레이아웃 생성
        setupRootLayout()

        // 공유 데이터 처리
        val shareHandled = handleShareIntent()

        if (!shareHandled) {
            // 공유 데이터가 없거나 유효하지 않은 경우 종료
            showErrorAndFinish("공유할 수 없는 형식입니다")
            return
        }

        // BottomSheet UI 표시
        showBottomSheet()
    }

    /**
     * 윈도우 설정 - 투명 배경 및 상태바 스타일 적용
     */
    private fun setupWindow() {
        window.apply {
            // 배경을 반투명하게 설정
            setBackgroundDrawableResource(android.R.color.transparent)

            // 상태바, 네비게이션바 투명 처리
            addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
            statusBarColor = android.graphics.Color.TRANSPARENT
            navigationBarColor = android.graphics.Color.TRANSPARENT

            // 레이아웃이 시스템 바 영역까지 확장되도록 설정
            decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            )
        }
    }

    /**
     * 루트 레이아웃 설정 - 배경 터치 시 종료되도록 구성
     */
    private fun setupRootLayout() {
        rootLayout = FrameLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            // 반투명 배경 (딤 효과)
            setBackgroundColor(0x80000000.toInt())

            // 배경 터치 시 액티비티 종료
            setOnClickListener {
                finishWithAnimation()
            }
        }
        setContentView(rootLayout)
    }

    /**
     * 공유 인텐트 처리 - 텍스트 데이터에서 제목과 URL 추출
     */
    private fun handleShareIntent(): Boolean {
        val intent = intent ?: return false
        val action = intent.action
        val type = intent.type

        Log.d(TAG, "Received intent - action: $action, type: $type")

        // ACTION_SEND가 아니면 처리 불가
        if (action != Intent.ACTION_SEND) {
            Log.w(TAG, "Unsupported action: $action")
            return false
        }

        // 텍스트 타입만 처리
        if (type == null || !type.startsWith("text/")) {
            Log.w(TAG, "Unsupported type: $type")
            return false
        }

        // 텍스트 데이터 추출
        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
        if (sharedText.isNullOrBlank()) {
            Log.w(TAG, "No text data in intent")
            return false
        }

        Log.d(TAG, "Shared text: $sharedText")

        // 제목 추출 (EXTRA_SUBJECT가 있으면 사용)
        sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT) ?: ""

        // URL 추출
        sharedUrl = extractUrl(sharedText) ?: ""

        // URL이 없으면 전체 텍스트를 URL로 사용 (유효한 URL인지 확인)
        if (sharedUrl.isEmpty()) {
            if (isValidUrl(sharedText.trim())) {
                sharedUrl = sharedText.trim()
            } else {
                // URL이 아닌 일반 텍스트인 경우
                sharedUrl = sharedText.trim()
                if (sharedTitle.isEmpty()) {
                    sharedTitle = "공유된 텍스트"
                }
            }
        }

        // 제목이 없으면 URL에서 도메인 추출하여 사용
        if (sharedTitle.isEmpty()) {
            sharedTitle = extractDomain(sharedUrl) ?: "공유된 링크"
        }

        Log.d(TAG, "Parsed - title: $sharedTitle, url: $sharedUrl")
        return true
    }

    /**
     * 텍스트에서 URL 추출
     */
    private fun extractUrl(text: String): String? {
        val urlPattern = Pattern.compile(
            "(https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+)",
            Pattern.CASE_INSENSITIVE
        )
        val matcher = urlPattern.matcher(text)
        return if (matcher.find()) matcher.group(1) else null
    }

    /**
     * URL 유효성 검사
     */
    private fun isValidUrl(text: String): Boolean {
        return try {
            val uri = Uri.parse(text)
            uri.scheme?.lowercase() in listOf("http", "https")
        } catch (e: Exception) {
            false
        }
    }

    /**
     * URL에서 도메인 추출
     */
    private fun extractDomain(url: String): String? {
        return try {
            val uri = Uri.parse(url)
            uri.host?.removePrefix("www.")
        } catch (e: Exception) {
            null
        }
    }

    /**
     * BottomSheet UI 표시
     */
    private fun showBottomSheet() {
        // XML 레이아웃 inflate
        bottomSheet = layoutInflater.inflate(
            resources.getIdentifier("share_layout", "layout", packageName),
            rootLayout,
            false
        ) as LinearLayout

        // FrameLayout.LayoutParams로 하단에 배치
        val params = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = Gravity.BOTTOM
        }
        bottomSheet?.layoutParams = params

        // 터치 이벤트가 배경으로 전파되지 않도록 설정
        bottomSheet?.setOnClickListener { /* consume click */ }

        // 제목 설정
        bottomSheet?.findViewById<TextView>(
            resources.getIdentifier("share_title", "id", packageName)
        )?.text = sharedTitle

        // URL 설정
        bottomSheet?.findViewById<TextView>(
            resources.getIdentifier("share_url", "id", packageName)
        )?.text = sharedUrl

        // 취소 버튼 클릭 리스너
        bottomSheet?.findViewById<TextView>(
            resources.getIdentifier("btn_cancel", "id", packageName)
        )?.setOnClickListener {
            finishWithAnimation()
        }

        // 저장 버튼 클릭 리스너
        bottomSheet?.findViewById<TextView>(
            resources.getIdentifier("btn_save", "id", packageName)
        )?.setOnClickListener {
            saveShareData()
        }

        // 루트 레이아웃에 추가
        rootLayout?.addView(bottomSheet)

        // 애니메이션으로 표시
        bottomSheet?.apply {
            translationY = 500f
            alpha = 0f
            animate()
                .translationY(0f)
                .alpha(1f)
                .setDuration(250)
                .start()
        }
    }

    /**
     * 공유 데이터 저장 및 메인 앱 열기
     */
    private fun saveShareData() {
        // SharedPreferences에 데이터 저장 (메인 앱에서 읽을 수 있도록)
        val prefs: SharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val shareData = """{"title":"${escapeJson(sharedTitle)}","url":"${escapeJson(sharedUrl)}","timestamp":${System.currentTimeMillis()}}"""

        prefs.edit().putString(KEY_PENDING_SHARE, shareData).apply()

        Log.d(TAG, "Saved share data: $shareData")

        // Toast 메시지 표시
        Toast.makeText(this, "저장되었습니다", Toast.LENGTH_SHORT).show()

        // 메인 앱 열기 (선택적)
        openMainApp()

        // 액티비티 종료
        finishWithAnimation()
    }

    /**
     * JSON 문자열 이스케이프
     */
    private fun escapeJson(text: String): String {
        return text
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")
    }

    /**
     * 메인 앱 열기
     */
    private fun openMainApp() {
        try {
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
            launchIntent?.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                putExtra("fromShare", true)
                putExtra("shareTitle", sharedTitle)
                putExtra("shareUrl", sharedUrl)
            }
            launchIntent?.let { startActivity(it) }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open main app", e)
        }
    }

    /**
     * 에러 메시지 표시 후 종료
     */
    private fun showErrorAndFinish(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        finish()
    }

    /**
     * 애니메이션과 함께 액티비티 종료
     */
    private fun finishWithAnimation() {
        bottomSheet?.animate()
            ?.translationY(500f)
            ?.alpha(0f)
            ?.setDuration(200)
            ?.withEndAction {
                finish()
                overridePendingTransition(0, 0)
            }
            ?.start() ?: run {
                finish()
                overridePendingTransition(0, 0)
            }
    }

    /**
     * 뒤로가기 버튼 처리
     */
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        finishWithAnimation()
    }
}
