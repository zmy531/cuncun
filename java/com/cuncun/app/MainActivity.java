package com.cuncun.app;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class MainActivity extends Activity {

    private static final String HOST = "cuncun.local";
    private static final String BASE = "https://" + HOST + "/";
    private static final int REQ_GALLERY = 1001;
    private static final int REQ_CAMERA = 1002;
    private static final int REQ_FILE = 1003;
    private static final String TAG = "CunCun";

    private WebView web;
    private FrameLayout root;
    private Uri pendingCameraUri;
    private android.webkit.ValueCallback<Uri[]> pendingFileCallback;
    private float density = 1f;
    private int insTop = 0, insBottom = 0, insIme = 0;
    private boolean ampsOff = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        density = getResources().getDisplayMetrics().density;

        Window w = getWindow();
        w.setStatusBarColor(Color.TRANSPARENT);
        w.setNavigationBarColor(Color.TRANSPARENT);
        // 键盘弹出时不再压缩窗口：页面布局完全不重排，面板只靠 --kb 抬到键盘上沿，
        // 从根上断掉「一开键盘就有别的页面串出来」的问题
        if (Build.VERSION.SDK_INT >= 30) {
            w.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
        } else {
            w.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
            w.getAttributes().layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        } else {
            w.getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }

        root = new FrameLayout(this);
        root.setBackgroundColor(0xFF000000);

        web = new WebView(this);
        web.setBackgroundColor(0xFF000000);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setTextZoom(100);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        web.addJavascriptInterface(new Bridge(), "Native");
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage cm) {
                Log.d(TAG, cm.message() + " @" + cm.lineNumber());
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView view,
                                             android.webkit.ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams params) {
                if (pendingFileCallback != null) {
                    pendingFileCallback.onReceiveValue(null);
                }
                pendingFileCallback = filePathCallback;
                try {
                    Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("*/*");
                    startActivityForResult(Intent.createChooser(i, "选择备份文件"), REQ_FILE);
                    return true;
                } catch (Exception e) {
                    pendingFileCallback = null;
                    return false;
                }
            }
        });

        root.addView(web, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                int top = 0, bottom = 0, ime = 0;
                if (Build.VERSION.SDK_INT >= 30) {
                    android.graphics.Insets bars = insets.getInsets(
                            WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                    top = bars.top;
                    bottom = bars.bottom;
                    ime = insets.getInsets(WindowInsets.Type.ime()).bottom;
                } else {
                    top = insets.getSystemWindowInsetTop();
                    bottom = insets.getSystemWindowInsetBottom();
                }
                pushInsets(top, bottom, ime);
                return insets;
            }
        });

        web.loadUrl(BASE + "index.html");

        // 兜底：某些机型（HyperOS 等）在 ADJUST_NOTHING + edge-to-edge 下不上报 ime inset，
        // 这里用「可见区域底边」反推键盘高度，保证 --kb 永远有值
        root.getViewTreeObserver().addOnGlobalLayoutListener(new android.view.ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                if (Build.VERSION.SDK_INT < 30 || root == null) return;
                android.graphics.Rect r = new android.graphics.Rect();
                root.getWindowVisibleDisplayFrame(r);
                int[] loc = new int[2];
                root.getLocationOnScreen(loc);
                int rootBottom = loc[1] + root.getHeight();
                int overlap = rootBottom - r.bottom - insBottom;
                int kb = Math.max(0, overlap);
                if (kb > dp(90) && Math.abs(kb - insIme) > dp(40)) {
                    pushInsets(insTop, insBottom, kb);
                }
            }
        });
    }

    private int dp(int v) {
        return Math.round(v * density);
    }

    private void pushInsets(int topPx, int bottomPx, int imePx) {
        insTop = topPx;
        insBottom = bottomPx;
        insIme = imePx;
        if (web == null) return;
        final int t = Math.round(topPx / density);
        final int b = Math.round(bottomPx / density);
        final int k = Math.round(imePx / density);
        web.post(new Runnable() {
            @Override
            public void run() {
                try {
                    web.evaluateJavascript(
                            "window.__insets&&__insets(" + t + "," + b + "," + k + ");", null);
                } catch (Throwable ignored) {
                }
            }
        });
    }

    private static String mimeOf(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".js")) return "application/javascript";
        if (p.endsWith(".json")) return "application/json";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".ttf")) return "font/ttf";
        return "application/octet-stream";
    }

    private class Client extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri u = request.getUrl();
            if (u == null || !"https".equals(u.getScheme()) || !HOST.equals(u.getHost())) {
                return new WebResourceResponse("text/plain", "UTF-8", null);
            }
            String path = u.getPath();
            if (path == null || "/".equals(path)) path = "/index.html";
            if (path.contains("..")) {
                return new WebResourceResponse("text/plain", "UTF-8", null);
            }
            try {
                InputStream in = getAssets().open("www" + path);
                Log.d(TAG, "asset ok: " + path);
                WebResourceResponse r = new WebResourceResponse(mimeOf(path), "UTF-8", in);
                java.util.Map<String, String> h = new java.util.HashMap<>();
                h.put("Cache-Control", "no-store");
                r.setResponseHeaders(h);
                return r;
            } catch (IOException e) {
                Log.e(TAG, "asset missing: " + path);
                return new WebResourceResponse("text/plain", "UTF-8", null);
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            Log.d(TAG, "page finished: " + url);
            // 首帧时 insets 早已分发完毕，页面加载完要重新灌一次
            pushInsets(insTop, insBottom, insIme);
            view.postDelayed(new Runnable() {
                @Override
                public void run() {
                    pushInsets(insTop, insBottom, insIme);
                }
            }, 350);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
            Log.e(TAG, "load error " + error.getErrorCode() + " " + error.getDescription() + " @ " + request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return true;
        }
    }

    @Override
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        web.evaluateJavascript("(window.__back&&window.__back())?'1':'0'",
                new android.webkit.ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (!"\"1\"".equals(value) && !"1".equals(value)) {
                            finish();
                        }
                    }
                });
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            try {
                root.removeView(web);
                web.destroy();
            } catch (Throwable ignored) {
            }
            web = null;
        }
        super.onDestroy();
    }

    /* ===================== 原生能力桥 ===================== */

    public class Bridge {

        @JavascriptInterface
        public String info() {
            try {
                JSONObject o = new JSONObject();
                o.put("version", "1.5.1");
                o.put("sdk", Build.VERSION.SDK_INT);
                o.put("android", Build.VERSION.RELEASE);
                o.put("model", Build.MANUFACTURER + " " + Build.MODEL);
                o.put("pkg", getPackageName());
                return o.toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        @JavascriptInterface
        public void toast(final String msg) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public String copy(String text) {
            if (text == null) return "0";
            try {
                ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                cm.setPrimaryClip(ClipData.newPlainText("存存", text));
                return "1";
            } catch (Exception e) {
                return "0";
            }
        }

        /** 用系统浏览器打开外部链接（GitHub 等） */
        @JavascriptInterface
        public void openUrl(final String url) {
            if (url == null || url.length() == 0) return;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(i);
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "没有可打开链接的应用", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            vibrateAmp(ms, 80);
        }

        /** amp 0-255：强度越大越"实" */
        @JavascriptInterface
        public void vibrateAmp(int ms, int amp) {
            try {
                if (ampsOff) return;
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v == null || !v.hasVibrator()) return;
                int a = Math.max(1, Math.min(255, amp));
                if (Build.VERSION.SDK_INT >= 26) {
                    v.vibrate(VibrationEffect.createOneShot(Math.max(1, ms), a));
                } else {
                    v.vibrate(Math.max(1, ms));
                }
            } catch (Exception ignored) {
            }
        }

        /** 触感总开关：0=关，其余=开 */
        @JavascriptInterface
        public void setHaptics(int level) {
            ampsOff = level <= 0;
        }

        /**
         * 代发 HTTP 请求（避开 WebView 的跨域限制）。
         * 结果回传 window.__httpCb(id, statusCode, bodyText)
         */
        @JavascriptInterface
        public void httpRequest(final String id, final String method, final String url,
                                final String headersJson, final String body) {
            final Thread t = new Thread(new Runnable() {
                @Override
                public void run() {
                    int code = -1;
                    String text = "";
                    java.net.HttpURLConnection conn = null;
                    try {
                        java.net.URL u = new java.net.URL(url);
                        conn = (java.net.HttpURLConnection) u.openConnection();
                        conn.setRequestMethod(("POST".equalsIgnoreCase(method) ? "POST" : "GET"));
                        conn.setConnectTimeout(15000);
                        conn.setReadTimeout(45000);
                        conn.setRequestProperty("Accept", "application/json, text/plain, */*");
                        if (headersJson != null && headersJson.length() > 2) {
                            JSONObject h = new JSONObject(headersJson);
                            java.util.Iterator<String> it = h.keys();
                            while (it.hasNext()) {
                                String k = it.next();
                                conn.setRequestProperty(k, h.optString(k, ""));
                            }
                        }
                        if (body != null && !"GET".equalsIgnoreCase(method)) {
                            conn.setDoOutput(true);
                            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                            java.io.OutputStream os = conn.getOutputStream();
                            os.write(body.getBytes("UTF-8"));
                            os.flush();
                            os.close();
                        }
                        code = conn.getResponseCode();
                        java.io.InputStream in = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
                        if (in != null) {
                            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                            byte[] buf = new byte[4096];
                            int n;
                            while ((n = in.read(buf)) > 0) baos.write(buf, 0, n);
                            in.close();
                            text = new String(baos.toByteArray(), "UTF-8");
                        }
                    } catch (Throwable e) {
                        text = String.valueOf(e.getMessage());
                    } finally {
                        if (conn != null) try { conn.disconnect(); } catch (Throwable ignored) { }
                    }
                    final int fc = code;
                    final String ft = text;
                    if (web == null) return;
                    web.post(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                web.evaluateJavascript("window.__httpCb&&__httpCb(" + JSONObject.quote(id)
                                        + "," + fc + "," + JSONObject.quote(ft) + ")", null);
                            } catch (Throwable ignored) {
                            }
                        }
                    });
                }
            });
            t.setDaemon(true);
            t.start();
        }

        @JavascriptInterface
        public void setSecure(final boolean on) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (on) {
                        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                    } else {
                        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                    }
                }
            });
        }

        /** 把文本写入「下载/存存」目录，返回 JSON {ok,path,msg} */
        @JavascriptInterface
        public String saveText(String fileName, String content, String mime) {
            try {
                if (content == null) content = "";
                byte[] bytes = content.getBytes("UTF-8");
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues cv = new ContentValues();
                    cv.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
                    cv.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    cv.put(MediaStore.MediaColumns.RELATIVE_PATH,
                            Environment.DIRECTORY_DOWNLOADS + "/存存");
                    cv.put(MediaStore.MediaColumns.IS_PENDING, 1);
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                    if (uri == null) throw new IOException("无法创建下载文件");
                    OutputStream os = getContentResolver().openOutputStream(uri);
                    os.write(bytes);
                    os.flush();
                    os.close();
                    cv.clear();
                    cv.put(MediaStore.MediaColumns.IS_PENDING, 0);
                    getContentResolver().update(uri, cv, null, null);
                    return ok("下载/存存/" + fileName);
                }
                File dir = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "存存");
                if (!dir.exists()) dir.mkdirs();
                File f = new File(dir, fileName);
                FileOutputStream fos = new FileOutputStream(f);
                fos.write(bytes);
                fos.flush();
                fos.close();
                return ok(f.getAbsolutePath());
            } catch (Exception e) {
                return err("保存失败：" + e.getMessage());
            }
        }

        private String ok(String path) {
            try {
                JSONObject o = new JSONObject();
                o.put("ok", true);
                o.put("path", path);
                return o.toString();
            } catch (Exception e) {
                return "{\"ok\":true}";
            }
        }

        private String err(String msg) {
            try {
                JSONObject o = new JSONObject();
                o.put("ok", false);
                o.put("msg", msg);
                return o.toString();
            } catch (Exception e) {
                return "{\"ok\":false}";
            }
        }

        /** mode: camera | gallery —— 结果通过 window.__onPick(dataUrl) 回传 */
        @JavascriptInterface
        public void pickImage(final String mode) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if ("camera".equals(mode)) {
                            ContentValues cv = new ContentValues();
                            cv.put(MediaStore.Images.Media.DISPLAY_NAME,
                                    "cuncun_" + System.currentTimeMillis() + ".jpg");
                            cv.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                            cv.put(MediaStore.Images.Media.RELATIVE_PATH,
                                    Environment.DIRECTORY_PICTURES + "/存存");
                            pendingCameraUri = getContentResolver()
                                    .insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv);
                            if (pendingCameraUri == null) {
                                toast("无法创建照片文件");
                                return;
                            }
                            Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                            i.putExtra(MediaStore.EXTRA_OUTPUT, pendingCameraUri);
                            i.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                                    | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                            startActivityForResult(i, REQ_CAMERA);
                        } else {
                            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                            i.setType("image/*");
                            i.addCategory(Intent.CATEGORY_OPENABLE);
                            startActivityForResult(Intent.createChooser(i, "选择照片"), REQ_GALLERY);
                        }
                    } catch (Exception e) {
                        toast("无法打开：" + e.getMessage());
                    }
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_FILE) {
            if (pendingFileCallback != null) {
                Uri[] uris = null;
                if (resultCode == RESULT_OK && data != null) {
                    Uri u = data.getData();
                    if (u != null) uris = new Uri[]{u};
                    if (data.getClipData() != null) {
                        ClipData cd = data.getClipData();
                        uris = new Uri[cd.getItemCount()];
                        for (int i = 0; i < cd.getItemCount(); i++) {
                            uris[i] = cd.getItemAt(i).getUri();
                        }
                    }
                }
                pendingFileCallback.onReceiveValue(uris);
                pendingFileCallback = null;
            }
            return;
        }
        Uri uri = null;
        if (requestCode == REQ_CAMERA) {
            if (resultCode == RESULT_OK) uri = pendingCameraUri;
        } else if (requestCode == REQ_GALLERY) {
            if (resultCode == RESULT_OK && data != null) uri = data.getData();
        }
        if (uri == null) {
            sendPick(null);
            return;
        }
        final Uri fUri = uri;
        new Thread(new Runnable() {
            @Override
            public void run() {
                String dataUrl = null;
                try {
                    dataUrl = readImageAsDataUrl(fUri);
                } catch (Throwable t) {
                    Log.w(TAG, "read image failed", t);
                }
                sendPick(dataUrl);
            }
        }).start();
    }

    private void sendPick(final String dataUrl) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (web == null) return;
                String js;
                if (dataUrl == null) {
                    js = "window.__onPick&&__onPick(null)";
                } else {
                    js = "window.__onPick&&__onPick('" + dataUrl + "')";
                }
                web.evaluateJavascript(js, null);
            }
        });
    }

    /** 解码后按最长边压缩到 1600px、JPEG 78%，转成 dataURL，避免跨桥传输过大 */
    private String readImageAsDataUrl(Uri uri) throws Exception {
        BitmapFactory.Options o = new BitmapFactory.Options();
        o.inJustDecodeBounds = true;
        InputStream in = getContentResolver().openInputStream(uri);
        BitmapFactory.decodeStream(in, null, o);
        in.close();

        int maxSide = 1600;
        int sample = 1;
        int longest = Math.max(o.outWidth, o.outHeight);
        while (longest / (sample * 2) >= maxSide) sample *= 2;

        BitmapFactory.Options d = new BitmapFactory.Options();
        d.inSampleSize = sample;
        InputStream in2 = getContentResolver().openInputStream(uri);
        Bitmap bmp = BitmapFactory.decodeStream(in2, null, d);
        in2.close();
        if (bmp == null) return null;

        int w = bmp.getWidth(), h = bmp.getHeight();
        if (Math.max(w, h) > maxSide) {
            float scale = maxSide / (float) Math.max(w, h);
            Bitmap scaled = Bitmap.createScaledBitmap(bmp, Math.round(w * scale),
                    Math.round(h * scale), true);
            if (scaled != bmp) bmp.recycle();
            bmp = scaled;
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, 78, bos);
        int ow = bmp.getWidth(), oh = bmp.getHeight();
        bmp.recycle();
        byte[] bytes = bos.toByteArray();
        String b64 = Base64.encodeToString(bytes, Base64.NO_WRAP);
        return "data:image/jpeg;base64," + b64;
    }
}
