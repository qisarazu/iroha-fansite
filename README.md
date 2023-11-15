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

## Features

- 歌枠検索

## License

[MIT](https://github.com/qisarazu/iroha-fansite/blob/main/LICENSE)
