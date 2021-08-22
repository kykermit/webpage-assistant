# Webpage assistant

LINEボットにメッセージを投稿すると、メッセージの内容に応答してWebページを操作してくれる簡易バーチャルアシスタントです。

ナビゲーションを開いたり、画面をスクロール移動させたり、自分がブラウザを直接操作しなくても簡単なメッセージでバーチャルアシスタントが代わりにブラウザを操作してくれます。

## Webpage assistantの役割

- LINEのチャットから指示を受けるとWebページでアクションを実行します
- 実行したアクションをWebページにアラート表示します
- アクションの実行結果をLINEのチャットにお知らせします

## 動作イメージ

### LINE側

![webpage-assistant-line](https://user-images.githubusercontent.com/88605144/130343982-6ed5c957-9a30-4ac0-91e2-ae5a0ea64e46.gif)

### ブラウザ側

![webpage-assistant-browser](https://user-images.githubusercontent.com/88605144/130343994-73d07e0c-734e-4f57-bd0d-3e0314ac8ef1.gif)

## 使い方

※ Node.jsおよびnpmがインストールされていること、LINEボットが作成されていることを前提としています。
※ サーバー側のソースコードは[webpage-assistant-server](https://github.com/kykermit/webpage-assistant-server)をご参照ください。

1. `src/ts/core/config.ts`にボットサーバーのエンドポイント（webpage-assistant-serverのデプロイ環境）のURLを設定します

```
export const WEBHOOK_URL = 'wss://webpage-assistant.sample.com/';
```

2. npmパッケージをインストールします

```
npm i
```

3. Webpage assistantを起動し、Webページを表示します

```
npm start
```

4. LINEのチャットに特定のコマンド（メッセージ）を投稿するとWebページ側でアクションが実行されます

コマンド例：

```
open
```

## コマンド一覧

Webpage assistantが応答できるメッセージは下記の5つです。
それ以外のメッセージはコマンドとして認識せず「アクションの実行に失敗しました。」というメッセージを返します。

| コマンド | アクション |
| --- | --- |
| open | ナビゲーションを開きます。<br>既にナビゲーションが開いている場合は、アクションを実行しません。 |
| close | ナビゲーションを閉じます。<br>既にナビゲーションが閉じている場合は、アクションを実行しません。 |
| top | ページ最上部までスクロールします。<br>既にページ最上部までスクロールしている場合は、アクションを実行しません。 |
| up | 上方向にスクロールします。<br>既にページ最上部までスクロールしている場合は、アクションを実行しません。 |
| down | 下方向にスクロールします。<br>既にページ最下部までスクロールしている場合は、アクションを実行しません。 |

## 動作環境

- Google Chrome 最新版
- Node.jsの推奨バージョン: 16.x
- npmの推奨バージョン: 7.x
