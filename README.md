# crypto-build

Easy build nodejs code to safe deploy to other service.

## Develop

Build code to nodejs, hot reload in your coding code.

```sh
crypto-build src/index.ts dist/index.js
```

## Build

Build code to nodejs in one file.

```sh
crypto-build src/index.ts dist/index.js --build
```

## Build to crypto

Build code to nodejs and crypto your source code.

```sh
crypto-build src/index.ts dist/index.js --crypto
```

## Build to bytecode

Build code to v8 bytecode.

```sh
crypto-build src/index.ts dist/index.js --byte
```


## Build to crypto + bytecode

Build code to nodejs, crypto and build v8 bytecode.

```sh
crypto-build src/index.ts dist/index.js --crypto-byte
```