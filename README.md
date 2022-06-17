# crypto-builder

Easy build nodejs code to safe deploy to other service.

## Develop

Build code to nodejs, hot reload in your coding code.

```sh
crypto-builder src/index.ts dist/index.js
```

## build

Build code to nodejs in one file.

```sh
crypto-builder src/index.ts dist/index.js --build
```

## build to crypto

Build code to nodejs and crypto your source code.

```sh
crypto-builder src/index.ts dist/index.js --crypto
```

## build to bytecode

Build code to nodejs, crypto and build v8 bytecode.

```sh
crypto-builder src/index.ts dist/index.js --byte
```