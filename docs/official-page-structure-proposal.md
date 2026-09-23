# MidFD公式ページ 構成案

## 0. メタ
- 作成日: 2026-07-05
- 対象repo: `G:\source\repos\tk999jp.github.io-dev`
- 正本: `docs/official-page-feature-inventory.md`
- 非対象: HTML/CSS/JS実装、本番repo反映、MidFD本体変更
- RT: RT:u

## 1. 結論
- 推奨構成: 3ページ（LP、導入ガイド、キー操作ガイド）に役割を分離する。
  - `index.html`: 配布LP（Hero、Download、動作要件、特徴、クイックスタート、確認情報、報告・注意）
  - `guide.html`: 導入ガイド（前提要件、ZIP展開・起動方法、Runtime不足時対応、外部ツール最小設定、困ったとき）
  - `keys.html`: キー操作ガイド（作業フロー基準の主力キーリファレンス）
- 廃止する構成: 1ページ内での詳細キーバインド・全コマンドの羅列、アコーディオン全開表示、内部調査メモの混入。

## 2. ページ全体の情報設計
3つのページのナビゲーションを一貫させ、それぞれの役割に応じた情報量に抑える。

### 2.1 LP (`index.html`) の構成
| 順序 | セクション | 目的 | 主な掲載内容 |
|---|---|---|---|
| 1 | Hero | 製品の要点と初回ダウンロード | 製品ロゴ、1行説明、通常版DL、Releases導線、動作要件、キャプチャ |
| 2 | Download / Runtime | 配布物と前提条件の提示 | 通常版DL、Releasesリンク、.NET 10 x64 Desktop Runtime必須、Source code zip警告 |
| 3 | MidFDの特徴 | 主要機能の要約（カード） | キーボード操作、移動と管理、プレビューと外部連携（アコーディオンは廃止） |
| 4 | クイックスタート | 最初に覚える主要5操作 | 基本的なキー（↑↓、Enter、Backspace、L、Q、Ctrl+Shift+P）の紹介と各詳細ページへのCTA |
| 5 | 確認情報 | 配布物の検証 | GitHub Releases API 経由の情報、公開元、SHA256取得状態（元ロジック維持） |
| 6 | 報告・注意 | サポートと免責事項 | Issueリンク、バックアップ注意、免責事項 |

### 2.2 導入ガイド (`guide.html`) の構成
- **前提動作要件**: Windows x64 / .NET 10 Desktop Runtime x64
- **ZIPの取得と展開**: ZIPのダウンロード、任意のフォルダ展開、`README_FIRST.txt` の確認、`Source code (zip)` に関する通常起動用ではない旨の注意
- **Runtime不足時の対応**: 起動## 5. 導入ガイド (`guide.html`)
### 5.1 掲載内容
- ZIP 展開と起動方法
- Runtime 不足時の案内と Microsoft 公式リンク、wingetコマンド
- 初回起動時オプション（キー操作プリセット選択）の案内
- 外部ツール（7-Zip, ffmpeg/ffplay/ffprobe, 外部エディタ）の初回最小限設定

### 5.2 起動できない場合の案内
Runtime 不足、OSビット数の不一致、SmartScreen等のセキュリティ警告解除など、自己解決可能なトラブルシューティングに特化させる。

### 5.3 外部ツールの最小化
各ツールごとの長文の使用手順や仕様は掲載せず、「どの機能にどの外部ツールが必要か」「設定パスをどこに登録するか」の記述に留める。

## 6. 確認情報 (`index.html#verify`)
Releases API 経由の情報、SHA256取得状態の表示ロジック、ProductVersion が見つからない場合の非表示仕様など、既存のJS動作仕様をそのまま維持する。

## 7. 報告・注意 (`index.html#report`)
- 開発者への不具合報告先（GitHub Issues）、詳細サポート文書リンク。
- ファイル操作の前にバックアップを確認するよう注意を促す。

## 8. 旧構成の扱い
| 旧要素 | 判断 | 理由 | 置換先 |
|---|---|---|---|
| 使い方で選ぶ | reject | 導線が曖昧になる | 主要特徴カード + クイックスタート |
| usecase modal | reject | モーダル依存・長文押し込みはUXを損ねる | 専用の `guide.html` / `keys.html` |
| 関連画面を表示 | reject | 目的が不鮮明 | キャプチャスイッチャー |
| 外部ツールを導入ガイドタブ内に置く構成 | reject | 起動条件と拡張要素が混ざる | `guide.html` 内の外部ツール最小設定 |
| runtime.html独立ページ | reject | 1ページLP側への要件統合 | LP動作要件 + `guide.html` |
| ProductVersion空欄表示 | reject | 推測での表示は不可 | 取得できない場合は非表示 |
| SHA256固定値に見える表示 | reject | 誤解を与えるため | Releases API取得状態に応じた表示 |

## 9. 実装フェーズへの指示方針
### 9.1 編集・新設するファイル
- `midfd/index.html` (配布LP)
- `midfd/guide.html` (導入ガイド)
- `midfd/keys.html` (キー操作ガイド)
- `assets/css/site.css` (レイアウト崩れ防止用の最小CSS)
- `assets/js/midfd.js` (ナビゲーション調整)

### 9.2 実装禁止・保留
- ローカルパス (`file:///` などの G: ドライブパス) をHTMLに含めること。
- `CommandRegistry.cs` などの内部用語・調査メタをHTMLに含めること。
- `midfd-release.js` の取得ロジックの破壊。

## 10. recommended / fallback / defer / reject
### recommended
- 3ページ構成（配布LP、導入ガイド、キー操作ガイド）の責務分離
- 作業フロー基準のキーガイド構成
- 最小限の外部ツール連携案内
- 既存のリリース表示JSロジック維持

### fallback
- 3ページ分割でCSSなどの変更量が多い場合、見た目は既存のclassやレイアウトを最大限流用して最小差分にする。

### defer
- 本番リポジトリ（tk999jp.github.io）への反映
- その他の追加個別ページの作成

### reject
- ユーザー向けHTMLへの `file:///` ローカルリンク混入
- 内部用語・調査メタ（`IsDangerous` / `CommandRegistry` 等）の混入
- `Quick Launch` などの誤った表記
- 本番リポジトリの直接編集


