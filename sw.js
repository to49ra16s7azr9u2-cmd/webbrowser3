const CACHE_NAME = "myhome-browser-v6";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./filebox.js",
  "./manifest.json",
  "./fonts/Manrope-latin.woff2",
  "./fonts/Manrope-latin-ext.woff2",
];

// 「わたしの蔵書館」と共有する倉庫(IndexedDB)に、届いた共有をそのまま置く。
importScripts("./filebox.js");

// 他のアプリの共有ボタンから飛んでくる先。manifest.json の share_target.action と揃える。
const SHARE_TARGET_PATH = new URL("./share-target", self.registration.scope).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// ネットワーク優先: 常に最新のファイルを取得しようとし、オフライン時のみ
// キャッシュにフォールバックする。このアプリは頻繁に更新されるため、
// 「キャッシュ優先＋裏で更新」だと更新が1回遅れて反映されてしまうのを避けるため。
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname === SHARE_TARGET_PATH) {
    event.respondWith(receiveShare(event.request));
    return;
  }

  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// 他のアプリの共有シートから届いたものを、待合室の「届いたばかり」の倉庫に置く。
// ここではまだ本棚には入れない。ページ側が開いたときに拾い上げ、60秒の待合室へ回す。
async function receiveShare(request) {
  const home = new URL("./index.html", self.registration.scope);
  try {
    const form = await request.formData();
    const title = (form.get("title") || "").toString().trim();
    const text = (form.get("text") || "").toString().trim();
    const sharedUrl = (form.get("url") || "").toString().trim();
    const files = form.getAll("files").filter((f) => f && typeof f === "object" && f.size > 0);

    let received = 0;

    for (const file of files) {
      const id = FileBox.newId();
      try {
        await FileBox.save({
          id,
          name: file.name || "file",
          mime: file.type || "application/octet-stream",
          bytes: file.size,
          blob: file,
          addedAt: new Date().toISOString(),
        });
        await FileBox.inboxAdd({
          id,
          kind: "file",
          name: file.name || "file",
          mime: file.type || "application/octet-stream",
          bytes: file.size,
          addedAt: new Date().toISOString(),
        });
        received++;
      } catch (e) {
        // 容量不足などで保存できなかった場合は、そのファイルだけ諦める
      }
    }

    // urlが無くても、共有テキストがアドレスそのものならリンクとして扱う
    const linkUrl = sharedUrl || (/^https?:\/\/\S+$/i.test(text) ? text : "");
    if (linkUrl || title || (text && !linkUrl)) {
      await FileBox.inboxAdd({
        id: FileBox.newId(),
        kind: "link",
        title: title || text || linkUrl || "",
        url: linkUrl,
        addedAt: new Date().toISOString(),
      });
      received++;
    }

    if (received) home.searchParams.set("shared", String(received));
    return Response.redirect(home.href, 303);
  } catch (e) {
    return Response.redirect(home.href, 303);
  }
}

// アプリを閉じていても、通知サーバー（push-server/、任意設定）からの予約が
// 届いた瞬間だけここが起きる。中身は文言だけで、利用状況などは含まない。
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    /* 空のpushや壊れたpayloadは無視する */
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "MyHome Browser", {
      body: data.body || "",
      tag: data.tag || undefined,
    })
  );
});

// 通知をタップしたら、開いたままのMyHome Browserへ戻す（無ければ開き直す）。
// 他のアプリを見ている最中に「時間切れ」を受け取った時、そのまま帰ってこられる。
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
      return undefined;
    })
  );
});
