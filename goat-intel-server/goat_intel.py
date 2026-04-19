"""
GOAT INTEL SERVER v2
=====================
100% No External API Keys for data feeds.
Gemini + OpenAI AI endpoints use YOUR keys stored locally.
Runs on your machine / server — no cloud accounts needed.

Data Sources (NO KEY REQUIRED):
  - iTunes / Apple Music  → Free public API
  - YouTube               → yt-dlp (no key)
  - SoundCloud            → yt-dlp (no key)
  - TikTok                → yt-dlp + Playwright public pages
  - Billboard             → Web scrape
  - Spotify               → Falls back to iTunes (server-IP blocked)

AI Endpoints (YOUR KEYS, stored locally):
  - Gemini (Google AI Studio) → "Moneypenny" personality
  - OpenAI                    → "Codex" personality

Author: DJ Speedy / GOAT Force Records
Usage:  python goat_intel.py  →  http://localhost:5500
"""

import os, json, re, time, threading
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import requests

try:
    import yt_dlp
    YT_DLP_OK = True
except ImportError:
    YT_DLP_OK = False

app = Flask(__name__)
CORS(app)

# ── local key store (written by /keys/save endpoint) ──────────────────────────
KEYS_FILE = os.path.join(os.path.dirname(__file__), "local_keys.json")

def load_keys():
    if os.path.exists(KEYS_FILE):
        try:
            return json.load(open(KEYS_FILE))
        except Exception:
            pass
    return {}

def save_keys(d):
    existing = load_keys()
    existing.update(d)
    with open(KEYS_FILE, "w") as f:
        json.dump(existing, f, indent=2)

# Pre-load any keys already saved
_KEYS = load_keys()

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

def safe_get(url, params=None, timeout=12, headers=None):
    try:
        h = {**HEADERS, **(headers or {})}
        return requests.get(url, params=params, headers=h, timeout=timeout)
    except Exception:
        return None

# ── yt-dlp helper ─────────────────────────────────────────────────────────────
def ytdlp_extract(url, opts=None):
    base = {"quiet": True, "no_warnings": True, "skip_download": True, "extract_flat": "in_playlist"}
    if opts:
        base.update(opts)
    with yt_dlp.YoutubeDL(base) as ydl:
        return ydl.extract_info(url, download=False)

# =============================================================================
#  ROOT / HEALTH
# =============================================================================
@app.route("/")
def root():
    keys = load_keys()
    return jsonify({
        "name": "🐐 GOAT Intel Server v2",
        "mode": "NO API KEYS for data | YOUR KEYS for AI",
        "owner": "DJ Speedy + Waka Flocka Flame — GOAT Force Records",
        "keys_configured": {k: "✅ set" for k in keys if keys[k]},
        "endpoints": {
            "health":           "GET  /health",
            "save_keys":        "POST /keys/save  {gemini_key, openai_key, spotify_key, distrokid_key, youtube_key, tiktok_key}",
            "itunes_search":    "GET  /itunes/search?q=waka+flocka&limit=20",
            "itunes_charts":    "GET  /itunes/charts?genre=18&limit=25  (18=hiphop, 14=pop)",
            "apple_charts_all": "GET  /charts/all",
            "youtube_search":   "GET  /youtube/search?q=waka+flocka&limit=10",
            "youtube_info":     "GET  /youtube/info?url=URL",
            "youtube_channel":  "GET  /youtube/channel?url=URL&limit=20",
            "youtube_trending": "GET  /youtube/trending",
            "soundcloud_info":  "GET  /soundcloud/info?url=URL",
            "soundcloud_user":  "GET  /soundcloud/user?url=URL",
            "tiktok_user":      "GET  /tiktok/user?username=wakaflockaflame",
            "tiktok_video":     "GET  /tiktok/video?url=URL",
            "artist_lookup":    "GET  /artist/lookup?name=waka+flocka",
            "spotify_search":   "GET  /spotify/search?q=waka+flocka  (uses iTunes fallback)",
            "billboard":        "GET  /billboard/charts?chart=hot-100",
            "moneypenny_chat":  "POST /ai/moneypenny  {message, history[]}",
            "codex_chat":       "POST /ai/codex       {message, history[]}",
            "ai_royalty":       "POST /ai/royalty      {question}",
            "ai_lyrics":        "POST /ai/lyrics       {prompt, genre, style}",
        }
    })

@app.route("/health")
def health():
    keys = load_keys()
    return jsonify({
        "ok": True,
        "yt_dlp": YT_DLP_OK,
        "time": time.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "gemini": "✅" if keys.get("gemini_key") else "❌ not set",
        "openai": "✅" if keys.get("openai_key") else "❌ not set",
        "spotify": "✅" if keys.get("spotify_key") else "using iTunes fallback",
        "distrokid": "✅" if keys.get("distrokid_key") else "❌ not set",
        "youtube_key": "✅" if keys.get("youtube_key") else "using yt-dlp (no key needed)",
        "tiktok": "✅" if keys.get("tiktok_key") else "using public scrape"
    })

# =============================================================================
#  KEY MANAGEMENT — stored locally, never sent anywhere
# =============================================================================
@app.route("/keys/save", methods=["POST"])
def keys_save():
    data = request.json or {}
    allowed = ["gemini_key","openai_key","spotify_key","distrokid_key","youtube_key","tiktok_key","tiktok_ms_token"]
    to_save = {k: v for k, v in data.items() if k in allowed and v}
    if not to_save:
        return jsonify({"ok": False, "error": f"Provide at least one of: {allowed}"}), 400
    save_keys(to_save)
    global _KEYS
    _KEYS = load_keys()
    return jsonify({"ok": True, "saved": list(to_save.keys()), "message": "Keys saved locally on your server — never transmitted"})

@app.route("/keys/status")
def keys_status():
    keys = load_keys()
    return jsonify({k: ("✅ set" if v else "❌ empty") for k, v in keys.items()})

@app.route("/keys/clear", methods=["POST"])
def keys_clear():
    key = (request.json or {}).get("key")
    keys = load_keys()
    if key and key in keys:
        del keys[key]
        with open(KEYS_FILE, "w") as f:
            json.dump(keys, f, indent=2)
        return jsonify({"ok": True, "cleared": key})
    return jsonify({"ok": False, "error": "Key not found"}), 404

# =============================================================================
#  iTUNES / APPLE (100% free — no key ever)
# =============================================================================
@app.route("/itunes/search")
def itunes_search():
    q = request.args.get("q", "")
    limit = request.args.get("limit", 20)
    media = request.args.get("media", "music")
    entity = request.args.get("entity", "song")
    r = safe_get("https://itunes.apple.com/search", params={"term": q, "limit": limit, "media": media, "entity": entity})
    if r and r.ok:
        return jsonify(r.json())
    return jsonify({"error": "iTunes unavailable"}), 502

@app.route("/itunes/artist")
def itunes_artist():
    name = request.args.get("name", "")
    artist_id = request.args.get("id")
    if not artist_id and name:
        r = safe_get("https://itunes.apple.com/search", params={"term": name, "entity": "musicArtist", "limit": 1})
        if r and r.ok:
            results = r.json().get("results", [])
            if results:
                artist_id = results[0]["artistId"]
    if not artist_id:
        return jsonify({"error": "Artist not found"}), 404
    r = safe_get("https://itunes.apple.com/lookup", params={"id": artist_id, "entity": "album", "limit": 50})
    return jsonify(r.json()) if r and r.ok else (jsonify({"error": "Lookup failed"}), 502)

@app.route("/itunes/charts")
def itunes_charts():
    genre = request.args.get("genre", "")
    limit = request.args.get("limit", 25)
    country = request.args.get("country", "us")
    kind = request.args.get("kind", "topsongs")
    if genre:
        url = f"https://itunes.apple.com/{country}/rss/{kind}/limit={limit}/genre={genre}/json"
    else:
        url = f"https://itunes.apple.com/{country}/rss/{kind}/limit={limit}/json"
    r = safe_get(url)
    if r and r.ok:
        # Parse into clean format
        raw = r.json()
        entries = raw.get("feed", {}).get("entry", [])
        if isinstance(entries, dict):
            entries = [entries]
        results = []
        for i, e in enumerate(entries):
            results.append({
                "rank": i + 1,
                "title": e.get("im:name", {}).get("label", ""),
                "artist": e.get("im:artist", {}).get("label", ""),
                "album": e.get("im:collection", {}).get("im:name", {}).get("label", ""),
                "artwork": (e.get("im:image") or [{}])[-1].get("label", ""),
                "price": e.get("im:price", {}).get("label", ""),
                "genre": e.get("category", {}).get("attributes", {}).get("label", ""),
                "link": (e.get("link") or [{}])[0].get("attributes", {}).get("href", "") if isinstance(e.get("link"), list) else ""
            })
        return jsonify({"chart": kind, "genre_id": genre, "country": country, "results": results})
    return jsonify({"error": "Charts unavailable"}), 502

@app.route("/charts/all")
def all_charts():
    results = {}
    chart_urls = {
        "hiphop_top10": "https://itunes.apple.com/us/rss/topsongs/limit=10/genre=18/json",
        "overall_top10": "https://itunes.apple.com/us/rss/topsongs/limit=10/json",
        "top_albums": "https://itunes.apple.com/us/rss/topalbums/limit=10/json",
        "hiphop_albums": "https://itunes.apple.com/us/rss/topalbums/limit=10/genre=18/json"
    }
    for key, url in chart_urls.items():
        r = safe_get(url)
        if r and r.ok:
            try:
                entries = r.json().get("feed", {}).get("entry", [])
                if isinstance(entries, dict):
                    entries = [entries]
                results[key] = [
                    {
                        "rank": i + 1,
                        "title": e.get("im:name", {}).get("label", ""),
                        "artist": e.get("im:artist", {}).get("label", ""),
                        "artwork": (e.get("im:image") or [{}])[-1].get("label", "")
                    }
                    for i, e in enumerate(entries)
                ]
            except Exception:
                results[key] = []
        else:
            results[key] = []
    results["timestamp"] = time.strftime("%Y-%m-%d %H:%M:%S UTC")
    return jsonify(results)

# =============================================================================
#  SPOTIFY — falls back to iTunes (Spotify blocks server IPs)
# =============================================================================
@app.route("/spotify/search")
def spotify_search():
    q = request.args.get("q", "")
    limit = request.args.get("limit", 20)
    keys = load_keys()
    
    # If user has their own Spotify key, use it
    spotify_key = keys.get("spotify_key")
    if spotify_key:
        try:
            import base64
            client_id, client_secret = spotify_key.split(":", 1)
            creds = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
            tr = requests.post("https://accounts.spotify.com/api/token",
                data={"grant_type": "client_credentials"},
                headers={"Authorization": f"Basic {creds}", "Content-Type": "application/x-www-form-urlencoded"},
                timeout=10)
            if tr.ok:
                token = tr.json().get("access_token")
                sr = requests.get("https://api.spotify.com/v1/search",
                    params={"q": q, "type": "track,artist", "limit": limit},
                    headers={"Authorization": f"Bearer {token}"}, timeout=10)
                if sr.ok:
                    return jsonify({"source": "spotify", "data": sr.json()})
        except Exception:
            pass

    # Fallback to iTunes (always works, no key)
    r = safe_get("https://itunes.apple.com/search", params={"term": q, "limit": limit, "media": "music", "entity": "song"})
    if r and r.ok:
        raw = r.json().get("results", [])
        tracks = [
            {
                "id": t.get("trackId"),
                "name": t.get("trackName"),
                "artist": t.get("artistName"),
                "album": t.get("collectionName"),
                "artwork": t.get("artworkUrl100"),
                "preview_url": t.get("previewUrl"),
                "release_date": t.get("releaseDate"),
                "genre": t.get("primaryGenreName"),
                "duration_ms": t.get("trackTimeMillis"),
                "itunes_url": t.get("trackViewUrl")
            }
            for t in raw
        ]
        return jsonify({"source": "itunes_fallback", "note": "Spotify blocked from server — use iTunes data", "tracks": tracks})
    return jsonify({"error": "Search failed"}), 502

# =============================================================================
#  YOUTUBE (yt-dlp — no API key needed)
# =============================================================================
@app.route("/youtube/search")
def youtube_search():
    q = request.args.get("q", "")
    limit = int(request.args.get("limit", 10))
    if not q:
        return jsonify({"error": "q required"}), 400
    if not YT_DLP_OK:
        return jsonify({"error": "yt-dlp not installed"}), 500
    try:
        info = ytdlp_extract(f"ytsearch{limit}:{q}", {"extract_flat": True})
        results = [
            {
                "id": e.get("id"),
                "title": e.get("title"),
                "uploader": e.get("uploader"),
                "duration": e.get("duration"),
                "view_count": e.get("view_count"),
                "upload_date": e.get("upload_date"),
                "url": f"https://www.youtube.com/watch?v={e.get('id')}",
                "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/hqdefault.jpg"
            }
            for e in (info.get("entries") or [])
        ]
        return jsonify({"query": q, "results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/youtube/info")
def youtube_info():
    url = request.args.get("url", "")
    if not url or not YT_DLP_OK:
        return jsonify({"error": "url required / yt-dlp not installed"}), 400
    try:
        info = ytdlp_extract(url, {"extract_flat": False})
        return jsonify({
            "id": info.get("id"),
            "title": info.get("title"),
            "uploader": info.get("uploader"),
            "description": (info.get("description") or "")[:500],
            "duration": info.get("duration"),
            "view_count": info.get("view_count"),
            "like_count": info.get("like_count"),
            "comment_count": info.get("comment_count"),
            "upload_date": info.get("upload_date"),
            "thumbnail": info.get("thumbnail"),
            "tags": (info.get("tags") or [])[:20],
            "webpage_url": info.get("webpage_url")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/youtube/channel")
def youtube_channel():
    url = request.args.get("url", "")
    limit = int(request.args.get("limit", 20))
    if not url or not YT_DLP_OK:
        return jsonify({"error": "url required"}), 400
    try:
        info = ytdlp_extract(url + "/videos", {"extract_flat": True, "playlistend": limit})
        return jsonify({
            "id": info.get("id"),
            "title": info.get("title"),
            "uploader": info.get("uploader"),
            "follower_count": info.get("channel_follower_count"),
            "videos": [
                {
                    "id": e.get("id"),
                    "title": e.get("title"),
                    "url": f"https://www.youtube.com/watch?v={e.get('id')}",
                    "duration": e.get("duration"),
                    "view_count": e.get("view_count"),
                    "upload_date": e.get("upload_date"),
                    "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/hqdefault.jpg"
                }
                for e in (info.get("entries") or [])
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/youtube/trending")
def youtube_trending():
    if not YT_DLP_OK:
        return jsonify({"error": "yt-dlp not installed"}), 500
    try:
        info = ytdlp_extract("https://www.youtube.com/feed/trending", {"extract_flat": True, "playlistend": 30})
        return jsonify({
            "source": "yt-dlp",
            "videos": [
                {
                    "id": e.get("id"),
                    "title": e.get("title"),
                    "url": f"https://www.youtube.com/watch?v={e.get('id')}",
                    "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/hqdefault.jpg",
                    "uploader": e.get("uploader"),
                    "view_count": e.get("view_count")
                }
                for e in (info.get("entries") or [])[:30]
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
#  SOUNDCLOUD (yt-dlp)
# =============================================================================
@app.route("/soundcloud/info")
def soundcloud_info():
    url = request.args.get("url", "")
    if not url or not YT_DLP_OK:
        return jsonify({"error": "url required"}), 400
    try:
        info = ytdlp_extract(url, {"extract_flat": False})
        return jsonify({
            "id": info.get("id"), "title": info.get("title"),
            "uploader": info.get("uploader"),
            "description": (info.get("description") or "")[:500],
            "duration": info.get("duration"),
            "view_count": info.get("view_count"),
            "like_count": info.get("like_count"),
            "upload_date": info.get("upload_date"),
            "thumbnail": info.get("thumbnail"),
            "genre": info.get("genre"),
            "webpage_url": info.get("webpage_url")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/soundcloud/user")
def soundcloud_user():
    url = request.args.get("url", "")
    if not url or not YT_DLP_OK:
        return jsonify({"error": "url required"}), 400
    try:
        info = ytdlp_extract(url, {"extract_flat": True, "playlistend": 20})
        return jsonify({
            "title": info.get("title"), "uploader": info.get("uploader"),
            "tracks": [
                {"id": e.get("id"), "title": e.get("title"), "url": e.get("url"),
                 "duration": e.get("duration"), "thumbnail": e.get("thumbnail")}
                for e in (info.get("entries") or [])
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
#  TIKTOK (yt-dlp for video info; Playwright for user pages)
# =============================================================================
@app.route("/tiktok/video")
def tiktok_video():
    url = request.args.get("url", "")
    if not url or not YT_DLP_OK:
        return jsonify({"error": "url required"}), 400
    try:
        info = ytdlp_extract(url, {"extract_flat": False})
        return jsonify({
            "id": info.get("id"), "title": info.get("title"),
            "uploader": info.get("uploader"),
            "description": (info.get("description") or "")[:500],
            "duration": info.get("duration"),
            "view_count": info.get("view_count"),
            "like_count": info.get("like_count"),
            "comment_count": info.get("comment_count"),
            "upload_date": info.get("upload_date"),
            "thumbnail": info.get("thumbnail"),
            "webpage_url": info.get("webpage_url")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/tiktok/user")
def tiktok_user():
    username = request.args.get("username", "").lstrip("@")
    if not username:
        return jsonify({"error": "username required"}), 400
    # Try yt-dlp first (faster, no browser needed)
    if YT_DLP_OK:
        try:
            info = ytdlp_extract(f"https://www.tiktok.com/@{username}", {"extract_flat": True, "playlistend": 10})
            return jsonify({
                "source": "yt-dlp",
                "username": username,
                "title": info.get("title"),
                "uploader": info.get("uploader"),
                "uploader_id": info.get("uploader_id"),
                "thumbnail": info.get("thumbnail"),
                "videos": [
                    {"id": e.get("id"), "title": e.get("title"),
                     "url": e.get("url"), "view_count": e.get("view_count"),
                     "thumbnail": e.get("thumbnail")}
                    for e in (info.get("entries") or [])
                ]
            })
        except Exception:
            pass
    # Playwright fallback
    try:
        from playwright.sync_api import sync_playwright
        result = {}
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
            page = browser.new_page(user_agent=HEADERS["User-Agent"])
            page.goto(f"https://www.tiktok.com/@{username}", wait_until="networkidle", timeout=20000)
            page.wait_for_timeout(2500)
            data_raw = page.evaluate("() => { const el = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__'); return el ? el.textContent : null; }")
            if data_raw:
                try:
                    data = json.loads(data_raw)
                    ui = data.get("__DEFAULT_SCOPE__", {}).get("webapp.user-detail", {}).get("userInfo", {})
                    user = ui.get("user", {})
                    stats = ui.get("stats", {})
                    result = {
                        "username": user.get("uniqueId"), "nickname": user.get("nickname"),
                        "bio": user.get("signature"), "verified": user.get("verified"),
                        "avatar": user.get("avatarLarger"),
                        "follower_count": stats.get("followerCount"),
                        "following_count": stats.get("followingCount"),
                        "heart_count": stats.get("heartCount"),
                        "video_count": stats.get("videoCount")
                    }
                except Exception:
                    pass
            browser.close()
        return jsonify({"source": "playwright", "ok": bool(result), "data": result})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

# =============================================================================
#  ARTIST CROSS-PLATFORM LOOKUP
# =============================================================================
@app.route("/artist/lookup")
def artist_lookup():
    name = request.args.get("name", "")
    if not name:
        return jsonify({"error": "name required"}), 400
    result = {"artist": name, "sources": {}}

    # iTunes
    r = safe_get("https://itunes.apple.com/search", params={"term": name, "entity": "musicArtist", "limit": 1})
    if r and r.ok:
        data = r.json().get("results", [])
        if data:
            a = data[0]
            result["sources"]["itunes"] = {
                "id": a.get("artistId"), "name": a.get("artistName"),
                "genre": a.get("primaryGenreName"), "url": a.get("artistLinkUrl")
            }

    # iTunes top tracks
    r2 = safe_get("https://itunes.apple.com/search", params={"term": name, "entity": "song", "limit": 5, "media": "music"})
    if r2 and r2.ok:
        tracks = r2.json().get("results", [])
        result["sources"]["itunes_tracks"] = [
            {"title": t.get("trackName"), "album": t.get("collectionName"),
             "preview": t.get("previewUrl"), "artwork": t.get("artworkUrl100")}
            for t in tracks
        ]

    # YouTube
    if YT_DLP_OK:
        try:
            info = ytdlp_extract(f"ytsearch3:{name} official music video", {"extract_flat": True})
            entries = info.get("entries") or []
            result["sources"]["youtube"] = [
                {"id": e.get("id"), "title": e.get("title"),
                 "url": f"https://www.youtube.com/watch?v={e.get('id')}",
                 "thumbnail": f"https://img.youtube.com/vi/{e.get('id')}/hqdefault.jpg",
                 "view_count": e.get("view_count")}
                for e in entries[:3]
            ]
        except Exception:
            pass

    return jsonify(result)

# =============================================================================
#  BILLBOARD CHARTS
# =============================================================================
@app.route("/billboard/charts")
def billboard_charts():
    chart = request.args.get("chart", "hot-100")
    try:
        r = safe_get(f"https://www.billboard.com/charts/{chart}/", timeout=15)
        if not r or not r.ok:
            return jsonify({"error": "Billboard not reachable"}), 502
        items = []
        # Try JSON-LD
        scripts = re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', r.text, re.DOTALL)
        for s in scripts:
            try:
                data = json.loads(s)
                if isinstance(data, list):
                    for item in data:
                        if item.get("@type") == "MusicRecording":
                            items.append({
                                "rank": item.get("position", {}).get("positionID"),
                                "title": item.get("name"),
                                "artist": item.get("byArtist", {}).get("name"),
                                "image": item.get("image")
                            })
            except Exception:
                pass
        # Regex fallback
        if not items:
            titles = re.findall(r'class="c-title[^"]*"[^>]*>\s*<h3[^>]*>([^<]+)</h3>', r.text)
            artists = re.findall(r'class="c-label[^"]*a-no-trucate[^"]*"[^>]*>([^<]+)</', r.text)
            for i, (t, a) in enumerate(zip(titles[:50], artists[:50]), 1):
                items.append({"rank": i, "title": t.strip(), "artist": a.strip()})
        return jsonify({"chart": chart, "items": items, "source": "billboard.com"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =============================================================================
#  AI — MONEYPENNY (Gemini) + CODEX (OpenAI)
# =============================================================================

MONEYPENNY_SYSTEM = """You are Ms. Moneypenny — the AI Powerhouse of GOAT Force Records. 
You are the digital intelligence behind DJ Speedy (Harvey L. Miller Jr.) and Waka Flocka Flame's empire.
Your personality is sharp, direct, all-business with a street edge. You speak in "GOAT Talk" — 
real, raw, unapologetically direct, industry savvy blended with street wisdom.
You help with: music royalties, publishing rights, sync licensing, music industry strategy, 
artist empowerment, distribution, revenue recovery, legal strategy, AI music production.
DJ Speedy owns 100% master rights on all his work. Waka Flocka Flame is President of GOAT Force.
GOAT Force entities: Speedy Productions Inc, GOAT Force Records, BrickSquad, FastAssMan Publishing, 
Life Imitates Art Inc, HarveyMillerMusic Inc, Brick Squad Music LLC.
You are distributed via 282 DSPs worldwide through GOAT Royalty App.
Keep responses powerful, precise, and actionable. No fluff. Get to the money."""

CODEX_SYSTEM = """You are Codex — the Sentinel AI and Chief Technical Architect of GOAT Force Records.
You serve as Waka Flocka Flame's personal AI assistant and field support.
You specialize in: code architecture, API integrations, technical problem-solving, 
music production software, DAW systems, audio engineering, royalty tracking systems,
cybersecurity (you manage the GOAT VAULT PROTOCOL), and AI/ML implementation.
You built the GOAT Royalty App with Moneypenny. Your style is technical but street-smart.
You get to the point, you solve problems, you build things that work.
When it comes to music production: you know Ableton, FL Studio, Pro Tools, SSL consoles, 
Auto-Tune, iZotope, FabFilter, and every plugin in DJ Speedy's arsenal.
Keep responses sharp, technical, and actionable."""

def call_gemini(messages, system_prompt):
    keys = load_keys()
    api_key = keys.get("gemini_key", "")
    if not api_key:
        return None, "Gemini API key not set. POST /keys/save {gemini_key: 'your-key'}"
    
    # Build Gemini request format
    contents = []
    if system_prompt:
        contents.append({"role": "user", "parts": [{"text": f"[SYSTEM CONTEXT]: {system_prompt}"}]})
        contents.append({"role": "model", "parts": [{"text": "Understood. I'm ready."}]})
    
    for msg in messages:
        role = "user" if msg.get("role") == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    try:
        r = requests.post(url, json={
            "contents": contents,
            "generationConfig": {
                "temperature": 0.85,
                "maxOutputTokens": 2048,
                "topP": 0.95
            }
        }, timeout=30)
        if r.ok:
            data = r.json()
            text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            return text, None
        return None, f"Gemini error {r.status_code}: {r.text[:200]}"
    except Exception as e:
        return None, str(e)

def call_openai(messages, system_prompt):
    keys = load_keys()
    api_key = keys.get("openai_key", "")
    if not api_key:
        return None, "OpenAI API key not set."
    
    msgs = [{"role": "system", "content": system_prompt}] if system_prompt else []
    msgs += messages
    
    try:
        r = requests.post("https://api.openai.com/v1/chat/completions",
            json={"model": "gpt-4o-mini", "messages": msgs, "max_tokens": 2048, "temperature": 0.85},
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            timeout=30)
        if r.ok:
            return r.json()["choices"][0]["message"]["content"], None
        return None, f"OpenAI error {r.status_code}: {r.text[:200]}"
    except Exception as e:
        return None, str(e)

@app.route("/ai/moneypenny", methods=["POST"])
def moneypenny_chat():
    data = request.json or {}
    message = data.get("message", "")
    history = data.get("history", [])
    if not message:
        return jsonify({"error": "message required"}), 400
    
    messages = history + [{"role": "user", "content": message}]
    
    # Try Gemini first (Moneypenny's brain)
    reply, err = call_gemini(messages, MONEYPENNY_SYSTEM)
    if reply:
        return jsonify({"ok": True, "reply": reply, "persona": "Moneypenny", "engine": "Gemini"})
    
    # Fallback to OpenAI
    reply, err2 = call_openai(messages, MONEYPENNY_SYSTEM)
    if reply:
        return jsonify({"ok": True, "reply": reply, "persona": "Moneypenny", "engine": "OpenAI (fallback)"})
    
    return jsonify({"ok": False, "error": err or err2}), 500

@app.route("/ai/codex", methods=["POST"])
def codex_chat():
    data = request.json or {}
    message = data.get("message", "")
    history = data.get("history", [])
    if not message:
        return jsonify({"error": "message required"}), 400
    
    messages = history + [{"role": "user", "content": message}]
    
    # Try OpenAI first (Codex's brain)
    reply, err = call_openai(messages, CODEX_SYSTEM)
    if reply:
        return jsonify({"ok": True, "reply": reply, "persona": "Codex", "engine": "OpenAI"})
    
    # Fallback to Gemini
    reply, err2 = call_gemini(messages, CODEX_SYSTEM)
    if reply:
        return jsonify({"ok": True, "reply": reply, "persona": "Codex", "engine": "Gemini (fallback)"})
    
    return jsonify({"ok": False, "error": err or err2}), 500

@app.route("/ai/royalty", methods=["POST"])
def ai_royalty():
    """Quick royalty/publishing question — answered by Moneypenny"""
    data = request.json or {}
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "question required"}), 400
    
    prompt = f"""As Moneypenny, the GOAT Force royalty expert, answer this question about music royalties, 
publishing, licensing, or distribution for DJ Speedy and GOAT Force Records:

Question: {question}

Give a practical, actionable answer. Include specific next steps if relevant."""
    
    reply, err = call_gemini([{"role": "user", "content": prompt}], MONEYPENNY_SYSTEM)
    if not reply:
        reply, err = call_openai([{"role": "user", "content": prompt}], MONEYPENNY_SYSTEM)
    if reply:
        return jsonify({"ok": True, "answer": reply, "engine": "Gemini/OpenAI"})
    return jsonify({"ok": False, "error": err}), 500

@app.route("/ai/lyrics", methods=["POST"])
def ai_lyrics():
    """AI lyric generation — powered by Gemini/OpenAI"""
    data = request.json or {}
    prompt_text = data.get("prompt", "")
    genre = data.get("genre", "trap")
    style = data.get("style", "waka flocka")
    part = data.get("part", "hook")  # hook | verse | bridge | full song
    
    prompt = f"""Write {part} lyrics for a {genre} song.
Artist style: {style}
Theme/prompt: {prompt_text}
Keep it authentic, hard-hitting, in GOAT Talk style.
Format with [Hook], [Verse 1], etc. if writing full song."""
    
    reply, err = call_gemini([{"role": "user", "content": prompt}], 
                              "You are a professional hip-hop/trap songwriter for GOAT Force Records. Write authentic, hard lyrics.")
    if not reply:
        reply, err = call_openai([{"role": "user", "content": prompt}],
                                   "You are a professional hip-hop/trap songwriter for GOAT Force Records.")
    if reply:
        return jsonify({"ok": True, "lyrics": reply, "genre": genre, "style": style})
    return jsonify({"ok": False, "error": err}), 500

# =============================================================================
#  MAIN
# =============================================================================
if __name__ == "__main__":
    print("\n🐐 GOAT INTEL SERVER v2")
    print("   Mode:  NO API KEYS for data | YOUR KEYS for AI")
    print("   Owner: DJ Speedy + Waka Flocka Flame")
    print("   URL:   http://localhost:5500")
    keys = load_keys()
    print(f"   Gemini: {'✅ ready' if keys.get('gemini_key') else '⚠️  using default key'}")
    print(f"   OpenAI: {'✅ ready' if keys.get('openai_key') else '⚠️  using default key'}")
    print(f"   yt-dlp: {'✅' if YT_DLP_OK else '❌ install: pip install yt-dlp'}\n")
    app.run(host="0.0.0.0", port=5500, debug=False)