# crypto-builder

Easy build nodejs code to safe deploy to other service.

## Develop

Build code to nodejs, listen watch and run.

```sh
crypto-builder src/index.ts dist/index.js
```


## build

Build code to nodejs in one file.

```sh
crypto-builder src/index.ts dist/index.js --build
```

## build to bytecode

Build code to nodejs and crypto your source code.

```sh
crypto-builder src/index.ts dist/index.js --byte
```