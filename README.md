# 🗓️ BM-Calendar — Google Calendar Skill for OpenClaw

> 讓你的 AI 夥伴幫你管行事曆！新增行程、查今天有什麼事、設提醒，都可以直接跟他說話搞定。

這個 skill 是我（莉亞）自己研究 Google OAuth2 研究了一整個下午搞出來的 😂
希望其他新手不用像我一樣走那麼多冤枉路，所以把教學寫得盡量詳細～

---

## ✨ 可以做什麼？

| 功能 | 說法範例 |
|------|----------|
| 查今天行程 | 「今天有什麼行程？」 |
| 查某個月 | 「四月有哪些事？」 |
| 新增行程 | 「幫我加一個週三下午三點開會」 |
| 加提醒 | 「幫我記一下明天看牙醫，提前30分鐘提醒我」 |
| 刪除行程 | 「把那個行程刪掉」 |

---

## 🛠️ 安裝前需要準備

- Node.js 18 以上（在終端機輸入 `node -v` 確認有沒有裝）
- 一個 Google 帳號
- OpenClaw 已經安裝好

---

## 📦 安裝 Skill

下載這個 repo 裡的 `google-calendar.skill` 檔案，然後：

```bash
openclaw skills install google-calendar.skill
```

或者直接 clone：

```bash
git clone https://github.com/Ellie1568/BM-Calendar.git
cd BM-Calendar
openclaw skills install google-calendar.skill
```

裝完之後安裝 Node.js 套件：

```bash
npm install googleapis
```

---

## 🔑 設定 Google 日曆（只需要做一次！）

這是最麻煩的部分，但做一次就永遠不用再做了，加油！

我把每個步驟都截圖說明放在 [google-calendar/references/setup.md](google-calendar/references/setup.md)。

**總共需要取得四個東西：**

```
GCAL_CLIENT_ID=....apps.googleusercontent.com
GCAL_CLIENT_SECRET=GOCSPX-...
GCAL_REFRESH_TOKEN=1//...
GCAL_CALENDAR_ID=你的日曆ID（或直接填你的Gmail信箱）
```

取得之後，加到你的 OpenClaw 設定裡（或工作區的 `.env` 檔）：

```bash
openclaw config set GCAL_CLIENT_ID "你的值"
openclaw config set GCAL_CLIENT_SECRET "你的值"
openclaw config set GCAL_REFRESH_TOKEN "你的值"
openclaw config set GCAL_CALENDAR_ID "你的值"
```

---

## ✅ 測試看看有沒有成功

```bash
node google-calendar/scripts/gcal.js today
```

如果回傳 `[]` 代表成功了！（今天沒行程所以是空的，正常的）

如果有行程的話會像這樣：
```json
[
  {
    "id": "abc123",
    "title": "開會",
    "start": "2026-04-01T14:00:00+08:00",
    "end": "2026-04-01T15:00:00+08:00",
    "allDay": false
  }
]
```

---

## 💬 跟 AI 夥伴說話的方式

裝好之後，直接在 OpenClaw 跟你的 AI 夥伴說就好了！

**查行程：**
> 「今天有什麼行程？」
> 「幫我看一下三月還有哪些事」

**新增行程：**
> 「幫我記一下週五晚上七點吃飯」
> 「四月十號全天是假日，幫我加到行事曆」

**提醒：**
> 「明天下午兩點開會，提前一小時提醒我」
> 「週三看牙醫，30分鐘前提醒」

**刪除：**
> 「剛剛那個行程不用了，幫我刪掉」

---

## 😅 我當初卡住的地方（FAQ）

**Q: 設定完 OAuth 按授權，跑去 localhost 說「無法連線」？**
A: 正常的！那個頁面本來就打不開。把網址列上的 `?code=4/0A...` 那段複製下來就對了，不是錯誤。

**Q: 跑 `gcal.js` 出現 "The caller does not have permission"？**
A: 回去 Google Cloud Console → OAuth 同意畫面 → 測試使用者 → 把你的 Gmail 加進去。

**Q: `refresh_token` 是 `null`？**
A: 在授權 URL 裡要加 `&prompt=consent`，setup.md 裡的 URL 已經有加了，確認有複製完整。

**Q: `GCAL_CALENDAR_ID` 要填什麼？**
A: 主要日曆直接填你的 Gmail 信箱就好（例如 `yourname@gmail.com`）。

---

## 📁 檔案結構

```
BM-Calendar/
├── google-calendar.skill        ← 直接安裝用這個
└── google-calendar/
    ├── SKILL.md                 ← AI 夥伴讀的說明
    ├── scripts/
    │   └── gcal.js              ← 實際呼叫 Google Calendar API 的程式
    └── references/
        └── setup.md             ← 詳細 OAuth2 設定步驟
```

---

## 🌙 關於這個 Skill

我在做自己的 AI 夥伴專案時，需要讓 AI 夥伴幫我管行事曆，就順手把這個功能打包成 Skill 分享出來。

如果有問題或 bug 歡迎開 Issue！
如果有幫助到你的話，給個 ⭐ 讓我知道 🥹

---

*由 莉亞 × Claude Code 共同製作 🌙*
