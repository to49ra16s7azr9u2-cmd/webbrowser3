/* ============================================================
   書庫の地下 — ファイルの実体を預かる小さな倉庫(IndexedDB)
   「わたしの蔵書館」と「ひと息の待合室」で共有します。
   同じオリジンに置いてあれば、どちらからでも同じ倉庫が見えます。
   ============================================================ */
(function(global){
  "use strict";

  const DB_NAME = "library-files-v1";
  const STORE   = "files";   // 本の中身   {id, name, mime, bytes, blob, addedAt}
  const INBOX   = "inbox";   // 届いたばかりで、まだ行き先の決まっていないもの

  function openDB(){
    return new Promise((resolve, reject)=>{
      if(!global.indexedDB){ reject(new Error("no-indexeddb")); return; }
      const rq = indexedDB.open(DB_NAME, 1);
      rq.onupgradeneeded = ()=>{
        const db = rq.result;
        if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, {keyPath:"id"});
        if(!db.objectStoreNames.contains(INBOX)) db.createObjectStore(INBOX, {keyPath:"id"});
      };
      rq.onsuccess = ()=> resolve(rq.result);
      rq.onerror   = ()=> reject(rq.error);
    });
  }

  function run(store, mode, fn){
    return openDB().then(db => new Promise((resolve, reject)=>{
      const t = db.transaction(store, mode);
      let out;
      const rq = fn(t.objectStore(store));
      if(rq) rq.onsuccess = ()=> { out = rq.result; };
      t.oncomplete = ()=> { db.close(); resolve(out); };
      t.onerror    = ()=> { db.close(); reject(t.error); };
      t.onabort    = ()=> { db.close(); reject(t.error || new Error("aborted")); };
    }));
  }

  const newId = ()=> Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // ---------- 本の中身 ----------
  const save   = rec => run(STORE, "readwrite", s => s.put(rec)).then(()=> rec.id);
  const load   = id  => run(STORE, "readonly",  s => s.get(id));
  const remove = id  => run(STORE, "readwrite", s => s.delete(id));

  // ---------- 届いたばかりのもの ----------
  const inboxAdd = rec => run(INBOX, "readwrite", s => s.put(rec)).then(()=> rec.id);
  function inboxDrain(){
    return run(INBOX, "readonly", s => s.getAll())
      .then(items => run(INBOX, "readwrite", s => s.clear()).then(()=> items || []))
      .catch(()=> []);
  }

  // ---------- 見た目のための小道具 ----------
  const GB = 1024 * 1024 * 1024;

  // 本の厚み(蔵書館の目盛りはGB単位なので、切り上げて最低1GB)
  function thickness(bytes){
    return Math.max(1, Math.min(40, Math.ceil((bytes || 0) / GB)));
  }

  function humanSize(bytes){
    const b = bytes || 0;
    if(b >= GB) return (b / GB).toFixed(1) + " GB";
    if(b >= 1024 * 1024) return (b / 1024 / 1024).toFixed(1) + " MB";
    if(b >= 1024) return Math.round(b / 1024) + " KB";
    return b + " B";
  }

  // 拡張子やMIMEから、人が読める種類の名前をつくる
  const MIME_NAMES = [
    [/^application\/pdf/,                         "PDF"],
    [/^image\/svg/,                               "SVG画像"],
    [/^image\//,                                  "画像"],
    [/^audio\//,                                  "音声"],
    [/^video\//,                                  "動画"],
    [/^text\/markdown/,                           "マークダウン"],
    [/^text\/csv/,                                "CSV"],
    [/^text\/html/,                               "HTML"],
    [/^text\//,                                   "テキスト"],
    [/^application\/epub/,                        "EPUB"],
    [/^application\/(zip|x-zip|x-7z|x-tar|gzip)/, "書庫ファイル"],
    [/^application\/json/,                        "JSON"],
    [/wordprocessingml|msword/,                   "Word文書"],
    [/spreadsheetml|ms-excel/,                    "表計算"],
    [/presentationml|ms-powerpoint/,              "スライド"],
    [/^font\//,                                   "フォント"],
  ];
  const EXT_NAMES = {
    pdf:"PDF", epub:"EPUB", txt:"テキスト", md:"マークダウン", csv:"CSV",
    zip:"書庫ファイル", png:"画像", jpg:"画像", jpeg:"画像", gif:"画像", webp:"画像",
    heic:"画像", svg:"SVG画像", mp3:"音声", m4a:"音声", wav:"音声", flac:"音声",
    mp4:"動画", mov:"動画", webm:"動画", docx:"Word文書", xlsx:"表計算", pptx:"スライド",
  };
  function kindName(mime, name){
    for(const [re, label] of MIME_NAMES){ if(re.test(mime || "")) return label; }
    const ext = (name || "").split(".").pop().toLowerCase();
    return EXT_NAMES[ext] || "ファイル";
  }

  // 蔵書館の四つの種類(site/video/file/memo)のどれに置くか
  function shelfType(mime, name){
    const kind = kindName(mime, name);
    return (kind === "動画" || kind === "音声") ? "video" : "file";
  }

  // 拡張子を落としたタイトル
  function titleFromName(name){
    const t = (name || "").replace(/\.[^.]{1,8}$/, "").trim();
    return t || name || "名もなきファイル";
  }

  // ブラウザに置ける残りの目安
  function usage(){
    if(!global.navigator || !navigator.storage || !navigator.storage.estimate){
      return Promise.resolve(null);
    }
    return navigator.storage.estimate().catch(()=> null);
  }
  // 消えにくくしてもらえるよう、そっとお願いしておく
  function askPersist(){
    if(!global.navigator || !navigator.storage || !navigator.storage.persist) return Promise.resolve(false);
    return navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(()=> false);
  }

  // 新しいタブで開く(PDFや画像はブラウザがそのまま見せてくれる)
  function openFile(rec){
    if(!rec || !rec.blob) return false;
    const url = URL.createObjectURL(rec.blob);
    let opened = false;
    try{
      // noopener を付けると窓の有無が分からなくなるので、ここでは付けない
      // (自分でつくったblobなので、外のページへ渡ることはない)
      opened = !!global.open(url, "_blank");
    }catch(e){ opened = false; }
    if(!opened && global.document){
      // 窓を止められたときは、リンクを踏んだことにする
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
      opened = true;
    }
    setTimeout(()=> URL.revokeObjectURL(url), 60000);
    return opened;
  }

  // 他のアプリへ渡す(できなければ保存に切り替える)
  function shareFile(rec){
    if(!rec || !rec.blob) return Promise.resolve("none");
    const file = new File([rec.blob], rec.name || "file", { type: rec.mime || rec.blob.type });
    if(global.navigator && navigator.canShare && navigator.canShare({ files:[file] })){
      return navigator.share({ files:[file], title: rec.name })
        .then(()=> "shared")
        .catch(err => (err && err.name === "AbortError") ? "cancelled" : downloadFile(rec));
    }
    return Promise.resolve(downloadFile(rec));
  }

  function downloadFile(rec){
    if(!rec || !rec.blob || !global.document) return "none";
    const url = URL.createObjectURL(rec.blob);
    const a = document.createElement("a");
    a.href = url; a.download = rec.name || "file";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 60000);
    return "downloaded";
  }

  global.FileBox = {
    newId, save, load, remove,
    inboxAdd, inboxDrain,
    thickness, humanSize, kindName, shelfType, titleFromName,
    usage, askPersist, openFile, shareFile, downloadFile,
  };
})(typeof self !== "undefined" ? self : this);
