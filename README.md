# cache-dir.ts

Cache and re-use computation result with custom filename and directory.

[![npm Package Version](https://img.shields.io/npm/v/cache-dir.ts)](https://www.npmjs.com/package/cache-dir)

## Features

- Cache computation results with custom filenames and directories
- Configurable cache expiration interval
- Support for both asynchronous and synchronous operations
- TypeScript typings included out of the box

## Installation

You can install this package using npm/pnpm/yarn/slnpm:

```bash
npm install cache-dir.ts
```

## Usage Example

Here is a basic example of how to use the CacheDir class:

```typescript
import { CacheDir } from 'cache-dir.ts'

let cache = new CacheDir()

let result = cache.runSync({
  filename: 'task-1.txt',
  fn: () => 'version 1',
})

console.assert(result == 'version 1', 'task 1 should run')

result = cache.runSync({
  filename: 'task-1.txt',
  fn: () => 'version 2',
})

console.assert(result == 'version 1', 'task 1 should be cached')
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
