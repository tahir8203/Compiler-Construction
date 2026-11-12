package com.tahir.compilerconstruction;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.webkit.WebViewAssetLoader;

/**
 * Compiler Construction course app. The whole course site is bundled in assets/site
 * and served from https://appassets.androidplatform.net so it works fully offline
 * (and localStorage progress persists like on the web).
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String HOME = "https://" + HOST + "/assets/site/index.html";

    private FrameLayout root;
    private WebView web;
    private View customView;
    private WebChromeClient.CustomViewCallback customCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        root = new FrameLayout(this);
        web = new WebView(this);
        web.setVisibility(View.INVISIBLE); // the splash (window background) shows until the first page is ready
        web.setBackgroundColor(Color.parseColor("#070b16"));
        root.addView(web, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setUserAgentString(s.getUserAgentString() + " CCCourseApp/2.0");

        web.addJavascriptInterface(new Bridge(), "AndroidApp");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost())) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, u));
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (web.getVisibility() != View.VISIBLE) web.setVisibility(View.VISIBLE);
                // window.print() does nothing in a WebView: route it to Android printing (Save as PDF).
                view.evaluateJavascript(
                        "window.print=function(){AndroidApp.print(document.title||'Compiler Construction')};", null);
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                if (customView != null) {
                    callback.onCustomViewHidden();
                    return;
                }
                customView = view;
                customCallback = callback;
                root.addView(view, new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                setFullScreenBars(true);
            }

            @Override
            public void onHideCustomView() {
                if (customView == null) return;
                root.removeView(customView);
                customView = null;
                if (customCallback != null) customCallback.onCustomViewHidden();
                customCallback = null;
                setFullScreenBars(false);
            }
        });

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(HOME);
    }

    @SuppressWarnings("deprecation")
    private void setFullScreenBars(boolean on) {
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = getWindow().getInsetsController();
            if (c == null) return;
            if (on) {
                c.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            } else {
                c.show(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(on
                    ? View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    : View.SYSTEM_UI_FLAG_VISIBLE);
        }
    }

    @SuppressWarnings("deprecation")
    private void applyBars(boolean light) {
        int c = Color.parseColor(light ? "#f4f7fd" : "#070b16");
        getWindow().setStatusBarColor(c);
        getWindow().setNavigationBarColor(c);
        View d = getWindow().getDecorView();
        int f = d.getSystemUiVisibility();
        int lightFlags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | (Build.VERSION.SDK_INT >= 26 ? View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR : 0);
        d.setSystemUiVisibility(light ? (f | lightFlags) : (f & ~lightFlags));
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (customView != null) {
            web.evaluateJavascript("document.exitFullscreen&&document.exitFullscreen().catch(function(){})", null);
            return;
        }
        // Presentation open -> close it (same as pressing Esc). Otherwise go back through the course pages.
        web.evaluateJavascript(
                "(function(){var w=document.querySelector('.sheetw');if(w){w.click();return 'ov';}var p=document.getElementById('pres');if(p){"
                        + "var o=document.getElementById('pov');if(o&&o.classList.contains('show')){o.classList.remove('show');return 'ov';}"
                        + "document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return 'pres';}"
                        + "return location.pathname.indexOf('index.html')>=0&&(location.hash===''||location.hash==='#/')?'home':'page';})()",
                value -> {
                    if (value == null) value = "";
                    if (value.contains("pres") || value.contains("ov")) return;
                    if (web.canGoBack()) web.goBack();
                    else if (value.contains("page")) web.loadUrl(HOME);
                    else finish();
                });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onPause() {
        super.onPause();
        web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    private class Bridge {
        @JavascriptInterface
        public void print(final String title) {
            runOnUiThread(() -> {
                PrintManager pm = (PrintManager) getSystemService(PRINT_SERVICE);
                if (pm == null) return;
                pm.print(title, web.createPrintDocumentAdapter(title), new PrintAttributes.Builder().build());
            });
        }

        @JavascriptInterface
        public boolean isApp() {
            return true;
        }

        /** Short vibration for taps, right and wrong answers. */
        @JavascriptInterface
        @SuppressWarnings("deprecation")
        public void haptic(final int ms) {
            try {
                Vibrator v = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                if (v == null || !v.hasVibrator()) return;
                int d = Math.max(5, Math.min(ms, 60));
                if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(d, VibrationEffect.DEFAULT_AMPLITUDE));
                else v.vibrate(d);
            } catch (Exception ignored) {
            }
        }

        /** Match the status and navigation bars to the portal's light or dark theme. */
        @JavascriptInterface
        public void setTheme(final boolean light) {
            runOnUiThread(() -> applyBars(light));
        }

        /** Keep the screen on while a presentation or Watch mode is open. */
        @JavascriptInterface
        public void keepAwake(final boolean on) {
            runOnUiThread(() -> {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            });
        }

        /** "landscape" locks slides to landscape; anything else returns to automatic rotation. */
        @JavascriptInterface
        public void orient(final String mode) {
            runOnUiThread(() -> setRequestedOrientation("landscape".equals(mode)
                    ? ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                    : ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED));
        }

        @JavascriptInterface
        public void share(final String text) {
            runOnUiThread(() -> {
                try {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType("text/plain");
                    i.putExtra(Intent.EXTRA_TEXT, text);
                    startActivity(Intent.createChooser(i, "Share"));
                } catch (Exception ignored) {
                }
            });
        }
    }
}
