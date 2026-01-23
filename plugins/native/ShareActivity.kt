package {{PACKAGE_NAME}}

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle

/**
 * ShareActivity - 외부 앱 공유를 위한 투명 Activity
 *
 * React Native를 띄우지 않고, Intent 데이터만 파싱해서
 * deeplink로 MainActivity에 전달합니다.
 *
 * 전달 데이터:
 * - text: 공유된 텍스트 (URL 포함)
 * - title: 링크 제목 (EXTRA_SUBJECT)
 * - url: 텍스트에서 추출한 URL
 * - thumbnailUrl: 공유된 이미지 URI (있는 경우)
 */
class ShareActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleShareIntent()
    }

    private fun handleShareIntent() {
        val action = intent?.action
        val type = intent?.type

        if (Intent.ACTION_SEND == action && type != null) {
            when {
                type.startsWith("text/") -> handleSendText(intent)
                type.startsWith("image/") -> handleSendImage(intent)
            }
        }

        finish()
    }

    private fun handleSendText(intent: Intent) {
        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT) ?: return
        val sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT)

        // 텍스트에서 URL 추출
        val url = extractUrl(sharedText)

        // 이미지가 함께 공유된 경우 (일부 앱에서 썸네일과 함께 공유)
        val imageUri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)

        sendDeeplink(
            text = sharedText,
            title = sharedTitle,
            url = url,
            thumbnailUrl = imageUri?.toString()
        )
    }

    private fun handleSendImage(intent: Intent) {
        val imageUri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM) ?: return
        val sharedTitle = intent.getStringExtra(Intent.EXTRA_SUBJECT)
        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)

        sendDeeplink(
            text = sharedText,
            title = sharedTitle,
            url = null,
            thumbnailUrl = imageUri.toString()
        )
    }

    private fun extractUrl(text: String): String? {
        // URL 패턴 매칭 (http/https)
        val urlPattern = Regex("https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+")
        return urlPattern.find(text)?.value
    }

    private fun sendDeeplink(
        text: String?,
        title: String?,
        url: String?,
        thumbnailUrl: String?
    ) {
        val params = mutableListOf<String>()

        text?.let { params.add("text=${Uri.encode(it)}") }
        title?.let { params.add("title=${Uri.encode(it)}") }
        url?.let { params.add("url=${Uri.encode(it)}") }
        thumbnailUrl?.let { params.add("thumbnailUrl=${Uri.encode(it)}") }

        if (params.isEmpty()) return

        val deeplink = "dolink://share?${params.joinToString("&")}"
        val deeplinkIntent = Intent(Intent.ACTION_VIEW, Uri.parse(deeplink))
        deeplinkIntent.setPackage(packageName)
        deeplinkIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)

        startActivity(deeplinkIntent)
    }
}
