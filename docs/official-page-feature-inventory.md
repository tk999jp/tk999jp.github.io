# MidFD公式ページ 機能棚卸し

## 0. 調査メタ

- 調査日: 2026-07-05
- MidFD repo: `G:\\source\\repos\\MidFD` (public: `tk999jp/MidFD`)
- branch: main
- HEAD: 5255e21
- origin/main: 5255e21
- 調査対象:
  - `README.md`
  - `UserDocs/KEYBINDINGS.md`
  - `UserDocs/USER_GUIDE.md`
  - `UserDocs/PROFILES.md`
  - `UserDocs/SUPPORT.md`
  - `Commands/CommandIds.cs`
  - `Commands/CommandRegistry.cs`
  - `Services/CommandPaletteService.cs`
  - `Models/FeatureId.cs`
  - `Models/MarkSlotStore.cs`
  - `Models/QuickAccessStore.cs`
  - `Models/ExternalToolCommandDefinition.cs`
  - `Helpers/MouseGestureRecognizer.cs`
- 注意:
  - MidFD本体repoはread-only調査。編集・stage・commit・push 禁止。
  - 正本はHEAD追跡済みのUserDocs・ソース。artifacts/tmp/ 配下は正本扱いしない。
  - 未確認情報は「未確認」として残す。推測で公式文言を作らない。
  - RT: u（実ブラウザ/ユーザー実機確認は未実施）

---

## 1. 公式ページの主軸

### 正本から言えること（README.md より）

- FDライクな操作感を目指したWindows向け軽量ファイラー
- キーボードを主体とした軽快なファイル操作を重視
- コマンドプロンプト、PowerShell、Windows Terminal、WSL、Git Bash などをよく使う方が、Explorer とコマンドラインの間で使える軽量なGUI補助ツール
- ファイルを素早く見て、選び、整理し、外部ツールや shell へ渡す使い方を重視
- オリジナルの FD との完全互換を目的としない

### 使ってよい表現（正本確認済み）

- 「FDライクな操作感を目指した Windows 向け軽量ファイラー」
- 「キーボードを主体とした軽快なファイル操作」
- 「Explorer とコマンドラインの間で使える軽量なGUI補助ツール」
- 「タブ、カテゴリ、マーク、QuickAccess、アーカイブ操作、外部ツール実行、Command Palette、入力割り当て」
- 「.NET 10.0 Desktop Runtime が必要」

### 避ける表現

- 「FD互換」（オリジナルFDとの完全互換ではないため）
- 「高速」「最高」などの未確認修飾
- 推測で書いたコマンド名・キーバインド・操作手順
- スクリーンショットのみを根拠とした機能断定

---

## 2. 主要機能一覧

| 機能 | 公式ページ掲載名 | 概要 | 標準/高度 | 正本 | 掲載判断 |
|---|---|---|---|---|---|
| キーボード操作 | キーボード操作 | カーソル移動・開く・コピー等のキーボード中心操作 | 標準 | README / KEYBINDINGS.md | recommended |
| キーバインドカスタマイズ | キーバインドカスタマイズ | Browser画面のコマンドに対してキー割り当てを変更・無効化・既定復帰 | 標準 | KEYBINDINGS.md / USER_GUIDE.md | recommended |
| Functionバー | Functionバー | Browser下部のFunctionバー表示・F1〜F12スロット割り当て。4レイヤー（通常/Shift/Ctrl/Alt）対応 | 標準 | KEYBINDINGS.md / USER_GUIDE.md | recommended |
| マウスジェスチャー | マウスジェスチャー | Browser画面で右クリックドラッグによるジェスチャー入力。1方向4種+2方向12種=合計16パターン。コマンド割り当てカスタマイズ可 | 標準（使用ON/OFFは初期オプション） | README / KEYBINDINGS.md / USER_GUIDE.md / MouseGestureRecognizer.cs | recommended |
| コマンド一覧 | コマンド一覧 | HelpメニューからCommand一覧を表示。割り当て対象コマンドと説明を確認できる | 標準 | README / KEYBINDINGS.md | short |
| Command Palette | Command Palette | Ctrl+Shift+P で機能・外部ツールを検索して実行。v1.1対応 | 標準 | README / KEYBINDINGS.md / USER_GUIDE.md / CommandPaletteService.cs | recommended |
| QuickAccess | QuickAccess | Q / F8 で開く。登録先・最近・履歴を一括確認し、よく使う場所へ素早く移動 | 標準 | README / KEYBINDINGS.md / USER_GUIDE.md / QuickAccessStore.cs | recommended |
| Alt slot launcher | 外部ツール Alt slot launcher | Alt 単体でlauncher一覧表示、Alt+英数字で直接起動 | 標準 | README / KEYBINDINGS.md / USER_GUIDE.md / ExternalToolCommandDefinition.cs | recommended |
| MarkSlot（基本） | MarkSlot | マーク状態をスロットに保存・復元 | 標準 | USER_GUIDE.md / KEYBINDINGS.md / MarkSlotStore.cs | recommended |
| MarkSlot（高度） | MarkSlot 集合演算 / バックアップ | スロット間の集合演算（積・差・和）、バックアップのエクスポート/インポート | 高度（詳細オプション要） | KEYBINDINGS.md / PROFILES.md / FeatureId.cs / MarkSlotStore.cs | short（高度機能注記） |
| タブ/カテゴリ | タブとカテゴリ | 複数タブ・カテゴリで作業場所を整理。Ctrl+Tab / Ctrl+Left / Ctrl+Right で移動 | 標準 | README / KEYBINDINGS.md / USER_GUIDE.md | recommended |
| 画像ビューア | 画像ビューア | 矩形選択コピー、右90度/左90度回転、左右/上下反転、画像情報表示。変換は表示専用 | 標準 | README / USER_GUIDE.md / ImageViewerForm.cs（存在確認） | recommended |
| VideoStill | 動画静止画プレビュー | ffmpeg使用。シークバー、←→で位置移動、Ctrl+Enterで外部再生。メタ情報表示 | 標準（ffmpeg別途要） | README / KEYBINDINGS.md / USER_GUIDE.md | recommended |
| 外部ツール連携 | 外部ツール連携 | 任意の外部ツールを登録・実行。7-Zip / ffmpeg / ffprobe / ffplay / 外部エディタなど | 標準 | README / USER_GUIDE.md / ExternalToolCommandDefinition.cs | recommended |
| Drag ZIP | Drag ZIP | Shift/Ctrl+複数マークドラッグでZIP化して渡す。manifest同梱対応 | 高度（詳細オプション要、既定OFF） | README / KEYBINDINGS.md / USER_GUIDE.md / PROFILES.md | short（高度機能注記） |
| アーカイブ操作 | アーカイブ操作 | 7-Zip連携（優先）、Windows標準tar.exe fallback。圧縮・解凍・ハッシュ確認 | 標準（7-Zip任意） | README / USER_GUIDE.md | recommended |
| Archive Contents | アーカイブ内ファイル一覧 | ZIPアーカイブ内ブラウズ、マーク解凍、テキストプレビュー | 標準 | USER_GUIDE.md / KEYBINDINGS.md | short |
| 一覧表示モード | 一覧表示モード | ファイル名のみ / ファイル名+サイズ / ファイル名+サイズ+更新日時 の3モード | 標準 | README / KEYBINDINGS.md / USER_GUIDE.md | short |
| 初回セットアップ | 初回セットアップ | 初回起動時にキー操作体系、メディアEnter動作、外部連携パス、初期オプションを設定。後から再表示可 | 標準 | README / USER_GUIDE.md / PROFILES.md | recommended |
| 高度な使い方 | 高度な使い方（詳細オプション） | 設定>操作 から Workspace Snapshot / MarkSlot集合演算 / Drag ZIP などを個別ON/OFF | 高度 | README / PROFILES.md / FeatureId.cs | detail-link |
| Workspace Snapshot | Workspace Snapshot | タブ・カーソル位置などの状態を保存・復元する作業管理機能 | 高度（詳細オプション要） | PROFILES.md / FeatureId.cs / CommandPaletteService.cs | defer |
| Logdsk | Logdsk（ディレクトリ移動） | L / F9 で起動。移動履歴、Tab補完付き | 標準 | KEYBINDINGS.md / USER_GUIDE.md / CommandRegistry.cs | short |
| フィルタ | フィルタ | F / Ctrl+F / F7 で一覧を絞り込み | 標準 | KEYBINDINGS.md | short |
| 配色カスタマイズ | 配色カスタマイズ | built-inプリセット、ユーザープリセット、HEX/RGB編集 | 標準 | README / USER_GUIDE.md | short |
| キー操作体系 | キー操作体系（操作プリセット） | 標準（現代的ショートカット中心）とFD互換（Fキー中心）の切り替え。機能制限はなし | 標準 | README / KEYBINDINGS.md / PROFILES.md | recommended |

---

## 3. 主力キーバインド（分類別）

> 正本: KEYBINDINGS.md @ 5255e21

- **移動**:
  - `↑` `↓` (選択項目の上下移動)
  - `PageUp` `PageDown` (ページ移動)
  - `Backspace` / `Alt+↑` (親ディレクトリへ移動)
  - `L` / `F9` (ディレクトリ移動 - Logdsk)
  - `Q` / `F8` (QuickAccess を開く)
- **ファイル操作**:
  - `C` / `F3` (コピー)
  - `M` / `F5` (移動)
  - `R` (名前変更)
  - `D` / `Delete` (削除)
  - `N` (新規ファイル作成)
  - `K` (新規フォルダ作成)
  - `A` (属性・日時変更)
- **開く / 実行**:
  - `Enter` (開く・内蔵表示)
  - `Z` (関連付けで開く)
  - `X` (コマンド実行ダイアログ)
  - `E` / `F4` (外部エディタで開く)
  - `H` (PowerShell をここで開く)
  - `Shift+H` (コマンドプロンプトをここで開く)
- **表示 / 整理**:
  - `T` (ディレクトリツリーを表示)
  - `F` / `Ctrl+F` / `F7` (フィルタ)
  - `Ctrl+R` / `Shift+R` (現在フォルダ再読込)
  - `Ctrl+1` / `Ctrl+2` / `Ctrl+3` (表示モード切替：ファイル名のみ/サイズ/詳細)
- **探す / 呼び出す**:
  - `Ctrl+Shift+P` / `F10` (Command Palette を開く)
  - `Ctrl+Shift+L` (タブの固定・解除)
  - `F12` (コマンド一覧を開く)

## 5. マーク操作 / MarkSlot

> 正本: KEYBINDINGS.md / USER_GUIDE.md / MarkSlotStore.cs

### 5.1 マーク操作

| 操作/機能 | 入力/条件 | 説明 | 標準/高度 | 正本 |
|---|---|---|---|---|
| マーク切り替え | Space / Insert | 選択項目のマーク状態を切り替えて次の項目へ移動します | 標準 | KEYBINDINGS.md |
| ファイルのみ全選択 | Home | ファイルのみを全選択/全解除します（ディレクトリ除外） | 標準 | KEYBINDINGS.md |
| ディレクトリを含めて全選択 | End / Ctrl+A | ディレクトリを含めて全選択/全解除します | 標準 | KEYBINDINGS.md |
| マウスマーク | Ctrl+左クリック | クリックした項目のマークON/OFFを切り替えます | 標準 | KEYBINDINGS.md |
| マウスマーク（範囲） | Shift+左クリック | アンカーからクリック位置まで範囲マークします | 標準 | KEYBINDINGS.md |
| マウスマーク（範囲） | Ctrl+Shift+leftクリック | Shift+左クリックと同じく範囲マークします | 標準 | KEYBINDINGS.md |
| マークスロットを開く | Ctrl+M | マーク状態を保存・復元するマークスロット画面を開きます | 標準 | KEYBINDINGS.md |
| マーク操作 | Tab | マーク関連操作に使います | 標準 | KEYBINDINGS.md |

### 5.2 MarkSlot

| 操作/機能 | 入力/条件 | 説明 | 標準/高度 | 正本 |
|---|---|---|---|---|
| MarkSlot画面を開く | F11（標準） / browser.open_mark_slot | マークスロット画面を開きます | 標準 | KEYBINDINGS.md / CommandRegistry.cs |
| 基本保存・復元 | MarkSlot画面から操作 | マーク状態をスロットに保存・後から復元 | 標準 | USER_GUIDE.md / MarkSlotStore.cs |
| スロット番号 | MarkSlotStore.CreateDefault | スロット番号は1始まりで複数スロット対応 | 標準 | MarkSlotStore.cs |
| スロット保存スコープ | - | CurrentTab / CurrentCategory / Workspace / SlotSetOperation の4種 | 標準/高度 | MarkSlotStore.cs（MarkSlotSourceScopes） |
| 集合演算 | 詳細オプションON時 | スロット間の積・差・和などの集合演算 | 高度（詳細オプション要） | KEYBINDINGS.md / PROFILES.md / FeatureId.cs |
| バックアップ export/import | 詳細オプションON時 | MarkSlotをJSONファイルにエクスポート・インポート（スキーマバージョン1） | 高度（詳細オプション要） | KEYBINDINGS.md / MarkSlotStore.cs |
| Archive Contents内での集合演算 | 詳細オプションON時 | Archive Contents内でも集合演算などの追加機能が利用可 | 高度 | KEYBINDINGS.md |

---

## 6. マウス操作 / ジェスチャー

> 正本: KEYBINDINGS.md / USER_GUIDE.md / MouseGestureRecognizer.cs

### 6.1 マウス操作

| 操作/機能 | 入力 | 説明 | 標準/高度 | 正本 |
|---|---|---|---|---|
| マウスジェスチャー開始 | 右クリックドラッグ | Browser画面でジェスチャー入力を開始します | 標準（使用ON/OFFは初期オプション） | KEYBINDINGS.md / USER_GUIDE.md |
| マークON/OFF | Ctrl+左クリック | クリックした項目のマークON/OFFを切り替えます | 標準 | KEYBINDINGS.md |
| 範囲マーク | Shift+左クリック | アンカーからクリック位置まで範囲マークします | 標準 | KEYBINDINGS.md |
| 範囲マーク | Ctrl+Shift+左クリック | Shift+左クリックと同じく範囲マークします | 標準 | KEYBINDINGS.md |

### 6.2 マウスジェスチャー

- パターン: 1方向4種（L / R / U / D）+ 2方向12種 = **合計16パターン**
- 入力: Browser画面で右クリックドラッグ
- ソース確認:
  - README.md: 「Browser画面のマウスジェスチャーカスタマイズ（16パターン）」
  - KEYBINDINGS.md: 「1方向4種（L / R / U / D）と2方向12種の合計16パターンに対応します」
  - MouseGestureRecognizer.cs: MaximumDirectionCount = 3、4方向（L/R/U/D）で認識（source確認済み）

| 機能 | 詳細 | 正本 |
|---|---|---|
| 対応パターン数 | 16パターン（1方向4種 + 2方向12種） | README / KEYBINDINGS.md / USER_GUIDE.md |
| コマンド割り当てカスタマイズ | 設定画面から各ジェスチャーに任意コマンドを割り当て | KEYBINDINGS.md / USER_GUIDE.md |
| 危険操作除外 | IsDangerous=true のコマンドはジェスチャー候補に出ない | CommandRegistry.cs（GetMouseGestureAssignableCommands） |
| 無効化・既定復帰 | ジェスチャーごとに無効化、既定に戻す、再起動後の復元に対応 | KEYBINDINGS.md / USER_GUIDE.md |
| ステータスバー表示 | 入力中は方向列と割り当てコマンド名をステータス表示。軌跡は一覧上に表示 | KEYBINDINGS.md / USER_GUIDE.md |

> 注意: 既定のジェスチャー割り当ての全16パターンマッピング表はUserDocsに掲載なし。要追加調査。

---

## 7. QuickAccess / Alt slot launcher

> 正本: README.md / KEYBINDINGS.md / USER_GUIDE.md / QuickAccessStore.cs / ExternalToolCommandDefinition.cs

### 7.1 用語整理

- **QuickAccess**: よく使う場所（フォルダ/外部コマンド）への移動ハブ機能。Q / F8 で開く。登録先・最近・履歴を一括管理。
- **Quick Launch**: 正式名称としてUserDocs・ソースに登場しない。→ **「Quick Launch」は本repoでは使用しない**。
- **Alt slot launcher**: 外部ツールに Alt+英数字 slot を設定し、Alt 単体でlauncher表示・Alt+英数字で直接起動する導線。正式名称は「外部ツール Alt slot launcher」。

| 機能 | 入力 | 説明 | 正本 |
|---|---|---|---|
| QuickAccess を開く | Q / F8 | QuickAccessを開きます | KEYBINDINGS.md |
| 登録先タブ | QuickAccess画面 | フォルダ登録・編集・削除。存在しないパスは移動前に停止 | USER_GUIDE.md |
| 最近タブ | QuickAccess画面 | 最近使った場所への移動、または登録先への追加 | USER_GUIDE.md |
| 履歴タブ | QuickAccess画面 | 戻る/進む履歴から移動 | USER_GUIDE.md |
| 外部コマンド登録 | QuickAccess画面 | 外部コマンドを登録。対象と作業ディレクトリを選択して実行 | USER_GUIDE.md |
| QuickAccessStore構造 | - | Bookmarks / Recents / Aliases / Commands の4コレクション | QuickAccessStore.cs |
| Alt launcher 表示 | Alt | 登録済みslotを一覧表示します | KEYBINDINGS.md / USER_GUIDE.md |
| Alt slot 直接起動 | Alt+英数字 | 対応slotの外部ツールを起動します | KEYBINDINGS.md / USER_GUIDE.md |
| launcher 内選択移動 | ↑/↓/Home/End/PageUp/PageDown | launcher内の選択を移動します | KEYBINDINGS.md |
| launcher から起動 | Enter | 選択中slotを起動します | KEYBINDINGS.md |
| launcher を閉じる | Esc | launcherを閉じます | KEYBINDINGS.md |
| 履歴戻り/進み（launcher内） | Alt+← / Alt+→ | launcherを閉じてBrowser履歴移動へ渡します | KEYBINDINGS.md |
| AltSlot 定義 | ExternalToolCommandDefinition.AltSlot | 外部ツール定義の AltSlot プロパティで設定 | ExternalToolCommandDefinition.cs |
| 注意 | - | Alt+英数字の外部ツールslotとAlt+F1〜F12のFunctionレイヤーは別の導線 | KEYBINDINGS.md / USER_GUIDE.md |

---

## 8. コマンド一覧 / Command Palette

> 正本: CommandRegistry.cs / CommandIds.cs / CommandPaletteService.cs / KEYBINDINGS.md

### 8.1 全コマンド一覧（CommandRegistry.cs より全件抽出 / 計56コマンド）

| ID | 表示名 | 説明 | カスタマイズ可 | 危険 | 正本 |
|---|---|---|---|---|---|
| browser.navigate.parent | 親ディレクトリへ移動 | 現在のディレクトリの親へ移動します。 | ○ | - | CommandRegistry.cs |
| browser.navigate.back | 履歴: 戻る | ディレクトリ履歴を1つ戻ります。 | ○ | - | CommandRegistry.cs |
| browser.navigate.forward | 履歴: 進む | ディレクトリ履歴を1つ進みます。 | ○ | - | CommandRegistry.cs |
| browser.reload | 再読込 | 現在ディレクトリを再読込します。 | ○ | - | CommandRegistry.cs |
| browser.execute | 実行 | 選択中の項目を実行します。 | ○ | - | CommandRegistry.cs |
| browser.mark.all_files | ファイルのみ全選択 | ファイルのみを全選択/全解除します。 | ○ | - | CommandRegistry.cs |
| browser.mark.all_items | ディレクトリを含めて全選択 | ディレクトリを含めて全選択/全解除します。 | ○ | - | CommandRegistry.cs |
| browser.cursor.top | 先頭へ移動 | 一覧の先頭へ移動します。 | ○ | - | CommandRegistry.cs |
| browser.cursor.bottom | 末尾へ移動 | 一覧の末尾へ移動します。 | ○ | - | CommandRegistry.cs |
| browser.change.attributes | 属性/日時変更 | 属性4種と日時3種を変更します。 | ○ | - | CommandRegistry.cs |
| browser.open.explorer | Explorerで開く | 現在ディレクトリをExplorerで開きます。 | ○ | - | CommandRegistry.cs |
| browser.open.shell | PowerShellをここで開く | 現在ディレクトリでPowerShellを開きます。 | ○ | - | CommandRegistry.cs |
| browser.open.external_editor | 外部エディタで開く | 選択ファイルを外部エディタで開きます。 | ○ | - | CommandRegistry.cs |
| browser.open.command_prompt | コマンドプロンプトをここで開く | 現在ディレクトリでコマンドプロンプトを開きます。 | ○ | - | CommandRegistry.cs |
| browser.create_directory | 新規フォルダ | 現在ディレクトリに新しいフォルダを作成します。 | ○ | - | CommandRegistry.cs |
| browser.create_file | 新規ファイル | 現在ディレクトリに新しいファイルを作成します。 | ○ | - | CommandRegistry.cs |
| browser.preview | プレビュー | 選択項目をプレビュー表示します。 | ○ | - | CommandRegistry.cs |
| browser.sort | ソート | ソート設定を開きます。 | ○ | - | CommandRegistry.cs |
| browser.filter | フィルタ | フィルタ設定を開きます。 | ○ | - | CommandRegistry.cs |
| browser.tree | ツリー | ツリーダイアログを開きます。 | ○ | - | CommandRegistry.cs |
| browser.quick_access | QuickAccess | QuickAccessを開きます。 | ○ | - | CommandRegistry.cs |
| browser.logdisk | Logdisk | Logdiskを実行します。 | ○ | - | CommandRegistry.cs |
| archive.pack | 圧縮 | 選択項目を圧縮します。 | ○ | - | CommandRegistry.cs |
| archive.unpack | 解凍 | 選択ファイルを解凍します。 | ○ | - | CommandRegistry.cs |
| browser.copy.full_path | フルパスコピー | 選択またはマーク項目のフルパスをコピーします。 | ○ | - | CommandRegistry.cs |
| browser.path_entry.open | パス入力 | 現在パスの入力欄を開きます。 | ○ | - | CommandRegistry.cs |
| browser.show_help | ヘルプ | ヘルプ表示を開きます。 | ○ | - | CommandRegistry.cs |
| browser.open_mark_slot | マークスロット | マークスロット画面を開きます。 | ○ | - | CommandRegistry.cs |
| browser.tab.new | 新しいタブを作る | 新しいBrowserタブを作成します。 | ○ | - | CommandRegistry.cs |
| browser.tab.next | 次のタブへ移動 | 次のBrowserタブへ移動します。 | ○ | - | CommandRegistry.cs |
| browser.tab.previous | 前のタブへ移動 | 前のBrowserタブへ移動します。 | ○ | - | CommandRegistry.cs |
| browser.tab_category.add | カテゴリ追加 | Browserタブカテゴリを追加します。 | ○ | - | CommandRegistry.cs |
| browser.tab_category.rename | カテゴリ名変更 | 現在のBrowserタブカテゴリ名を変更します。 | ○ | - | CommandRegistry.cs |
| browser.tab_category.delete | カテゴリ削除 | 現在のBrowserタブカテゴリを削除します。 | ○ | ○ | CommandRegistry.cs |
| browser.tab_category.move_left | カテゴリを左へ移動 | 現在のBrowserタブカテゴリを左へ移動します。 | ○ | - | CommandRegistry.cs |
| browser.tab_category.move_right | カテゴリを右へ移動 | 現在のBrowserタブカテゴリを右へ移動します。 | ○ | - | CommandRegistry.cs |
| browser.tab_category.next | 次のカテゴリへ移動 | 次のBrowserタブカテゴリへ移動します。 | ○ | - | CommandRegistry.cs |
| browser.tab_category.previous | 前のカテゴリへ移動 | 前のBrowserタブカテゴリへ移動します。 | ○ | - | CommandRegistry.cs |
| browser.tab.close | 現在タブを閉じる | 現在のBrowserタブを閉じます。 | ○ | - | CommandRegistry.cs |
| browser.tab.restore_closed | 閉じたタブを復元 | 直前に閉じたBrowserタブを復元します。 | ○ | - | CommandRegistry.cs |
| clipboard.paste | 貼り付け | クリップボード内容を貼り付けます。 | ○ | - | CommandRegistry.cs |
| file.copy | コピー | 選択項目をコピーします。 | ○ | - | CommandRegistry.cs |
| file.move | 移動 | 選択項目を移動します。 | ○ | - | CommandRegistry.cs |
| file.rename | 名前変更 | 選択項目を名前変更します。 | ○ | - | CommandRegistry.cs |
| file.delete | 削除 | 選択項目を削除します。 | ○ | ○ | CommandRegistry.cs |
| edit.undo | 元に戻す | 直前の対象操作を元に戻します。 | ×（非カスタマイズ） | - | CommandRegistry.cs |
| edit.redo | やり直し | 元に戻した操作をやり直します。 | ×（非カスタマイズ） | - | CommandRegistry.cs |
| app.open_system_information | 情報 | ドライブ、メモリ、システム情報を表示します。 | ○ | - | CommandRegistry.cs |
| app.open_new_instance | MidFDをもう1枚立ち上げ | 現在パスで新しいMidFDウィンドウを起動します。 | ○ | - | CommandRegistry.cs |
| app.open_control_panel | コントロールパネルを開く | Windowsのコントロールパネルを開きます。 | ○ | - | CommandRegistry.cs |
| app.open_settings | 設定を開く | 設定ダイアログを開きます。 | ○ | - | CommandRegistry.cs |
| app.open_command_launcher | コマンドランチャーを開く | コマンドランチャーを開きます。 | ○ | - | CommandRegistry.cs |
| browser.tab.filter_lock | 現在タブのフィルタロック | 現在のタブのフィルタロック設定ダイアログを開きます。 | ○ | - | CommandRegistry.cs |
| browser.tab.lock | 現在タブの固定/解除 | 現在のタブの固定状態を切り替えます。 | ○ | - | CommandRegistry.cs |
| app.open_command_list | コマンド一覧 | コマンド一覧を開きます。 | ○ | - | CommandRegistry.cs |

### 8.2 Command Palette 組み込みコマンド（CommandPaletteService.cs より）

| ID | 表示名 | カテゴリ | 詳細オプション要否 | 正本 |
|---|---|---|---|---|
| browser.reloadCurrentDirectory | 現在ディレクトリを再読込 | Browser | 不要 | CommandPaletteService.cs |
| browser.copyCurrentPath | 現在パスをコピー | Browser | 不要 | CommandPaletteService.cs |
| browser.copySelectedItemFullPath | 選択項目のフルパスをコピー | Browser | 不要 | CommandPaletteService.cs |
| browser.open.explorer | Explorerで開く | Browser | 不要 | CommandPaletteService.cs |
| browser.open.shell | PowerShellをここで開く | Browser | 不要 | CommandPaletteService.cs |
| browser.open.externalEditor | 外部エディタで開く | Browser | 不要 | CommandPaletteService.cs |
| app.openSettings | 設定を開く | App | 不要 | CommandPaletteService.cs |
| mark.openSlotManager | マークスロット管理を開く | Mark | 不要 | CommandPaletteService.cs |
| workspace.openSnapshotManager | Workspace Snapshot 管理を開く | Workspace | WorkspaceSnapshot有効時のみ | CommandPaletteService.cs / FeatureId.cs |

> 注: 外部ツールは ExternalToolCommandStorage から動的に読み込まれ、Category = "External" として追加される。

### 8.3 全件抽出の可否

- 全件抽出できたか: **はい（CommandRegistry.cs の全定義を完全抽出。計56コマンド）**
- 補足: CommandPaletteServiceの組み込みコマンドも全件確認。外部ツール登録分は動的なため個別不可（ユーザー定義）。
- 次の調査: FD互換プリセット時のFunctionキー割り当てデフォルトのフル表

### 8.4 FeatureId（高度な機能フラグ）

> 正本: Models/FeatureId.cs

| FeatureId | 機能説明 |
|---|---|
| WorkspaceSnapshot | Workspace Snapshot（詳細オプション要） |
| MarkSlotSetOperations | MarkSlot集合演算（詳細オプション要） |
| MarkSlotBackupTransfer | MarkSlotバックアップexport/import（詳細オプション要） |
| ImageQuantization | 画像減色（詳細オプション要） |
| SvgClipboard | SVGコピー（詳細オプション要） |
| CommandPaletteUsage | Command Palette使用状況（詳細オプション要） |
| FileSystemWatcherAutoRefresh | 高度な自動追従制御（詳細オプション要） |

---

## 9. タブ / カテゴリ / 移動

> 正本: KEYBINDINGS.md / USER_GUIDE.md / CommandRegistry.cs

| 機能 | 操作 | 説明 | 正本 |
|---|---|---|---|
| タブ切り替え | Ctrl+Tab | タブを切り替えます | KEYBINDINGS.md |
| 同一カテゴリ内前後タブ移動 | Ctrl+Left / Ctrl+Right | 現在カテゴリ内で前後のタブへ移動します | KEYBINDINGS.md |
| 新しいタブを作る | browser.tab.new コマンド | 新しいBrowserタブを作成します | CommandRegistry.cs |
| 閉じたタブを復元 | browser.tab.restore_closed コマンド | 直前に閉じたBrowserタブを復元します | CommandRegistry.cs |
| タブのフィルタロック | browser.tab.filter_lock コマンド | 現在のタブのフィルタロック設定ダイアログを開きます | CommandRegistry.cs |
| タブの固定/解除 | browser.tab.lock コマンド | 現在のタブの固定状態を切り替えます | CommandRegistry.cs |
| カテゴリ追加 | browser.tab_category.add コマンド | Browserタブカテゴリを追加します | CommandRegistry.cs |
| カテゴリ名変更 | browser.tab_category.rename コマンド | 現在のカテゴリ名を変更します | CommandRegistry.cs |
| カテゴリ削除（確認あり） | browser.tab_category.delete コマンド | 現在のカテゴリを削除します（IsDangerous=true） | CommandRegistry.cs |
| カテゴリ左/右移動 | browser.tab_category.move_left / move_right コマンド | カテゴリを左右に移動します | CommandRegistry.cs |
| 次/前カテゴリへ移動 | browser.tab_category.next / previous コマンド | 次/前カテゴリへ移動します | CommandRegistry.cs |
| Logdsk（ディレクトリ移動） | L / F9 | パス入力・履歴・Tab補完付きのディレクトリ移動 | KEYBINDINGS.md / CommandRegistry.cs |

---

## 10. 画像ビューア / VideoStill

> 正本: README.md / KEYBINDINGS.md / USER_GUIDE.md / ImageViewerForm.cs（存在確認）

### 10.1 画像ビューア

| 機能 | 操作 | 説明 | 外部ツール要否 | 正本 |
|---|---|---|---|---|
| 画像を開く | Enter | 画像ファイルをMidFD Image Viewerで表示 | 不要 | USER_GUIDE.md |
| 矩形選択 | ドラッグ | 画像上でドラッグして矩形選択範囲を指定 | 不要 | README / USER_GUIDE.md |
| 選択範囲コピー | Ctrl+C（選択時） | 選択範囲のみをコピー。選択なしの場合は全画像コピー | 不要 | README / USER_GUIDE.md |
| 右90度回転 | 画像ビューア内操作 | 表示専用（元ファイル変更なし） | 不要 | README / USER_GUIDE.md |
| 左90度回転 | 画像ビューア内操作 | 表示専用（元ファイル変更なし） | 不要 | README / USER_GUIDE.md |
| 左右反転 | 画像ビューア内操作 | 表示専用（元ファイル変更なし） | 不要 | README / USER_GUIDE.md |
| 上下反転 | 画像ビューア内操作 | 表示専用（元ファイル変更なし） | 不要 | README / USER_GUIDE.md |
| 画像情報表示 | 画像ビューア内 | 通常画像の基本情報（サイズ等）を表示 | 不要 | README / USER_GUIDE.md |
| モデルレス表示 | - | MainFormがアクティブでもEscで開いている画像ビューアを閉じられる | 不要 | USER_GUIDE.md |

### 10.2 VideoStill（動画静止画プレビュー）

| 機能 | 操作 | 説明 | 外部ツール要否 | 正本 |
|---|---|---|---|---|
| VideoStillを開く | Enter / V | 動画ファイルの静止画プレビューを開きます（既定設定時） | ffmpeg.exe 必須 | KEYBINDINGS.md / USER_GUIDE.md |
| シーク（前後） | ← / → | 動画内の位置を前後に変更します（動画長に合わせて自動ステップ） | ffmpeg.exe 必須 | KEYBINDINGS.md / USER_GUIDE.md |
| 大シーク（前後） | Shift+← / Shift+→ | 大きなステップで位置を変更します | ffmpeg.exe 必須 | KEYBINDINGS.md / USER_GUIDE.md |
| 先頭へ戻る | Home | 動画の先頭（0秒）へ位置を戻します | ffmpeg.exe 必須 | KEYBINDINGS.md / USER_GUIDE.md |
| 外部再生 | Ctrl+Enter | 現在プレビュー位置から外部再生（ffplay等）を起動 | ffplay.exe（未設定時はWin関連付け） | KEYBINDINGS.md / USER_GUIDE.md |
| シークバー操作 | 画像プレビュー下部クリック | 動画内の任意の位置へシーク | ffprobe.exe（なし時は無効） | USER_GUIDE.md |
| 動画メタ情報表示 | 画像情報ダイアログ | VideoStill時はコンテナ形式、codec、動画長、解像度、FPS、ビットレートも表示 | ffprobe.exe 推奨 | README / USER_GUIDE.md |
| 自動追従プレビュー | カーソル移動で自動更新 | 画像プレビュー画面が開いている状態でBrowser側カーソル移動するとプレビューが自動更新 | ffmpeg.exe 必須 | USER_GUIDE.md |
| 設定（メディアEnter動作） | 初回セットアップ / 設定 | 「メディアファイル Enter で外部再生する」でEnter/Ctrl+Enterの動作を切り替え | - | KEYBINDINGS.md / USER_GUIDE.md |

> 注意: ffmpeg.exe / ffplay.exe / ffprobe.exe はMidFDに同梱していません。

---

## 11. 外部ツール連携

> 正本: README.md / USER_GUIDE.md / KEYBINDINGS.md / ExternalToolCommandDefinition.cs

| 機能 | 操作 | 説明 | 正本 |
|---|---|---|---|
| 外部ツール登録 | 設定>外部連携タブ | 外部ツールを名前・説明・エイリアス・AltSlot・実行ファイルパス・引数・作業ディレクトリで登録 | ExternalToolCommandDefinition.cs |
| 外部ツール実行 | Command Palette / Alt slot | 登録済み外部ツールをCommand Palette検索または Alt slot から実行 | USER_GUIDE.md / CommandPaletteService.cs |
| Alt slot launcher | Alt / Alt+英数字 | Alt単体でlauncher表示、Alt+英数字で直接起動 | KEYBINDINGS.md / USER_GUIDE.md |
| 引数テンプレート | ExternalToolCommandDefinition.Arguments | {currentDir} / {selectedPath} などのプレースホルダーで引数を構成 | ExternalToolCommandDefinition.cs |
| 7-Zip連携 | 設定>外部連携 | アーカイブ操作で7-Zipを優先使用。パス設定で有効化 | README / USER_GUIDE.md |
| ffmpeg連携 | 設定>外部連携 | VideoStill（静止画生成）に使用 | USER_GUIDE.md |
| ffplay連携 | 設定>外部連携 | Ctrl+Enterによる外部動画再生に使用 | USER_GUIDE.md |
| ffprobe連携 | 設定>外部連携 | 動画の総時間取得に使用。未検出時はシークバー無効 | USER_GUIDE.md |
| 外部エディタ | 設定>外部連携 | 選択ファイルを外部エディタで開く（E / F4） | KEYBINDINGS.md |
| Explorer連携 | Alt+F2 / メニュー | 現在フォルダをExplorerで開く | README / KEYBINDINGS.md |
| PowerShell連携 | H | 現在フォルダでPowerShellを開く | KEYBINDINGS.md |
| コマンドプロンプト連携 | Shift+H | 現在フォルダでコマンドプロンプトを開く | KEYBINDINGS.md |

---

## 12. 公式ページ掲載判断

### recommended（公式ページの主要セクションとして掲載）

- キーボード操作（カーソル・開く・マーク・コピー/移動/削除/リネーム）
- キーバインドカスタマイズ（Browser画面のコマンド単位でキー変更・無効化・既定復帰）
- Functionバー（4レイヤー対応 F1〜F12 割り当て）
- マウスジェスチャー（16パターン、コマンド割り当てカスタマイズ）
- Command Palette（Ctrl+Shift+P、機能・外部ツール検索実行）
- QuickAccess（登録先・最近・履歴を一括管理）
- 外部ツール Alt slot launcher（Alt / Alt+英数字）
- MarkSlot（マーク状態の保存・復元）
- タブとカテゴリ（作業場所の整理）
- 画像ビューア（矩形選択コピー・回転・反転・画像情報）
- 動画静止画プレビュー（VideoStill / ffmpeg連携）
- 外部ツール連携（7-Zip / ffmpeg / 外部エディタ等）
- 初回セットアップ（キー操作体系・初期オプション・外部連携パス）
- キー操作体系（標準 / FD互換）

### short（短く掲載。詳細はHelpメニュー・UserDocsに誘導）

- コマンド一覧（HelpメニューからCommand一覧を確認できる旨のみ掲載）
- Archive Contents（ZIPアーカイブ内ブラウズと選択解凍）
- 一覧表示モード（ファイル名のみ / +サイズ / +サイズ+日時の3モード）
- Logdsk（ディレクトリ移動、Tab補完・履歴付き）
- フィルタ（一覧絞り込み）
- 配色カスタマイズ（プリセット・HEX/RGB編集）
- MarkSlot集合演算・バックアップ（高度機能注記付きで短く）
- Drag ZIP（高度機能注記付きで短く）

### detail-link（詳細ページ/UserDocsへリンク）

- 高度な使い方（詳細オプション）全体 → UserDocs/KEYBINDINGS.md / PROFILES.md へ
- キーバインド全表 → UserDocs/KEYBINDINGS.md へ
- ファイル操作の安全性注意 → UserDocs/USER_GUIDE.md / SUPPORT.md へ
- 不具合報告方法 → UserDocs/SUPPORT.md → GitHub Issues へ

### defer（今回は未掲載。将来検討）

- Workspace Snapshot（高度機能、一般ユーザーには複雑すぎる可能性）
- ImageQuantization（画像減色）/ SvgClipboard（SVGコピー）の詳細（FeatureIdにのみ存在、UserDocsへの記載薄い）
- シンボリックリンク/ジャンクションの安全境界（上級者向け）
- テキストクリップボードの.txtファイル化（既定OFFの機能）

### reject / avoid（掲載しない）

- 推測・未確認の機能紹介
- スクリーンショットのみを根拠とした機能説明
- 「Quick Launch」という用語（本repoには存在しない）
- 旧「使い方で選ぶ + モーダル」方向の流用
- FDとの完全互換を示唆する文言

---

## 13. 未確認・要追加調査

| 項目 | 理由 | 次の確認方法 |
|---|---|---|
| マウスジェスチャーの既定割り当て全16パターンのマッピング表 | USER_GUIDE.mdには「戻る/進む/親ディレクトリへ/再読込など」とのみ記載。具体的な全パターンのデフォルト割り当て一覧がUserDocsに未掲載 | MainForm.Input.cs または設定読み込み部のデフォルト値を調査 |
| 標準Fキー割り当てのShift/Ctrl層の全デフォルト値 | KEYBINDINGS.mdにAlt層の一部は記載あり。Shift/Ctrl層の全デフォルトは未掲載 | FunctionBarAssignmentDialog.cs または設定初期化部を調査 |
| FD互換プリセット時のShift+F6=Shell起動の詳細 | KEYBINDINGS.mdに「FD互換の既定ではShift+F6がShell起動」の記載あり。他のShiftレイヤーデフォルトは未掲載 | 同上 |
| ImageViewerの回転・反転操作の具体的なUIトリガー | UserDocsに操作名の記載あり。具体的なキー/メニュー/ボタン操作が未掲載 | ImageViewerForm.cs のUI実装確認 |
| Command Palette v1.1 の高度なCommand Palette機能の詳細 | KEYBINDINGS.mdに「高度なCommand Palette機能」が詳細オプション一覧に記載あり。CommandPaletteLayerService等の詳細未調査 | CommandPaletteLayerService.cs / CommandPaletteLayerQuery.cs を確認 |
| QuickAccessのAliasesとCommandsコレクションの用途詳細 | QuickAccessStore.csにBookmarks/Recents/Aliases/Commandsの4コレクション確認。AliasesとCommandsのUI上の役割詳細は未確認 | QuickAccessDialog.cs を調査 |
| LargeText Viewerの操作詳細 | USER_GUIDE.mdに「安全性のため通常テキストViewerと一部操作が異なる場合があります」と記載あり。詳細未調査 | LargeTextViewer関連ソースを確認 |
| アーカイブ操作で対応するフォーマット一覧 | USER_GUIDE.mdに「zip、7z、tar」と記載あり。7-Zipが使える場合の対応フォーマット詳細は未調査 | 7-Zip連携部分のソースまたはドキュメント確認 |
| external_tools.sample.json の内容 | リポジトリルートにサンプルファイルあり。外部ツール登録の参考例として有用な可能性 | external_tools.sample.json を読む |
| MarkSlotのスロット総数（デフォルト） | MarkSlotStore.CreateDefault(slotCount)でスロット数は引数。デフォルトスロット数が何かソース上で未確認 | MarkSlotDialog.csまたは初期化部を確認 |
