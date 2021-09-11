# GAS_autoKintai

## 概要
GAS(Google App Scripts)を使いGoogleカレンダーから勤怠情報を取得しメールで送信します。

## 機能

- Googleカレンダーから予定のタイトルを勤怠予定として取得
- Googleカレンダーから翌々週以降、30日後までの予定のタイトルをを休暇予定として取得
- 任意の宛先にメールで送信

## 使い方

1. Googleカレンダーに時間を終日、タイトルの先頭に★を付けて予定を登録します。
2. スクリプトエディタにautoKintaiMail.gsのソースを貼り付け、送信先、参照するカレンダー等を設定します。
3. トリガーに登録します。

### 利用時の注意
以下の条件を満たした場合、取得対象となります。
1. 予定が終日で登録されている。
2. 予定のタイトルの先頭に★が付いている。

## 作者

[@g0raken](https://twitter.com/g0raken)

## ライセンス

[MIT](http://TomoakiTANAKA.mit-license.org)</blockquote>