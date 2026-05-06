<p align="center">
  <a href="https://gozaru.fans">
    <picture>
      <img src="https://gozaru.fans/logo128.png">
    </picture>
  </a>
  <h1 align="center">gozaru.fans</h1>
</p>

**Unofficial** fan site for Hololive 6th generation, Iroha Kazama.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Run Locally

1. Install supabase cli. https://supabase.com/docs/guides/cli.
1. Clone this repository.
1. `$ supabase login`
1. `$ supabase init`
1. `$ supabase start`
1. Write the output environment variables to .env.local copied from .env.sample.
1. `$ npm run db:migrate`
1. If you need sample data, run: `$ npm run db:seed`
1. `$ npm run dev`

## Sentry の設定

Sentry を使う場合は、デプロイ先またはローカルの環境変数に以下を設定してください。未設定の場合、Sentry は初期化されません。

```env
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=
NEXT_PUBLIC_SENTRY_ENABLE_LOGS=
NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

- `NEXT_PUBLIC_SENTRY_DSN`: Sentry の DSN
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`: Performance tracing の送信率。未設定時は `0`
- `NEXT_PUBLIC_SENTRY_ENABLE_LOGS`: Sentry logs を有効にするか。未設定時は有効、`false` で無効
- `NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII`: デフォルト PII を送信するか。未設定時は無効、`true` で有効
- `SENTRY_ORG`: Source Map をアップロードする Sentry organization slug
- `SENTRY_PROJECT`: Source Map をアップロードする Sentry project slug
- `SENTRY_AUTH_TOKEN`: Source Map アップロード用の認証トークン

`NEXT_PUBLIC_SENTRY_DSN` が設定されている場合のみ Sentry を初期化します。開発環境で送信したくない場合は、ローカルの環境変数から `NEXT_PUBLIC_SENTRY_DSN` を外してください。

## Features

- 歌枠検索

## License

[MIT](https://github.com/qisarazu/iroha-fansite/blob/main/LICENSE)
