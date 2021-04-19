# gravitee-tool - some utils for maintenance work

## Installation

`npm i -g mtwomey/gravitee-tool#v1.0.0` (or whatever version)

## Set your environment

`gravitee-tool --env dev`

## Set your JWT

`gravitee-tool --jwt [token]`

## List APIs

`gravitee-tool --list-apis`

## Create an API

```angular2html
❯ gravitee-tool --create-api --name "Bored API" --context-path "/bored" --target "https://www.boredapi.com/api/activity" --description "Suggest an activity" --labels "fun"
API Bored API created.
API Bored API deployed.
API Bored API started.
Bored API                     cf738e29-0b17-43be-b38e-290b17e3be60    https://gravitee-gw.topcoder-dev.com/bored
```

## Delete an API

`gravitee-tool --delete-api [API UUID]`

## Export an API (get JSON API Definition)

`gravitee-tool --export-api [API UUID]`

## Import an API (import a previously exported API definition)

`gravitee-tool --import-api [FILENAME]`
