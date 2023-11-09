import { mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { readFile, writeFile, stat, mkdir } from 'fs/promises'
import { appendIgnoreLine } from './ignore'
import { dirname, join } from 'path'

export type CacheDirOptions = {
  /** @default '.cache' */
  dir?: string

  /** @default 15*60*1000 (15 minutes) */
  expireInterval?: number

  /** @default '.gitignore' (false to skip auto append) */
  gitignore?: string | false
}

/**
 * @description Cache and re-use computation result with custom filename and directory.
 * */
export class CacheDir {
  dir: string
  expireInterval: number
  constructor(options?: CacheDirOptions) {
    this.dir = options?.dir || '.cache'
    this.expireInterval = options?.expireInterval || 15 * 60 * 1000
    mkdirSync(this.dir, { recursive: true })
    if (options?.gitignore !== false) {
      appendIgnoreLine(options?.gitignore || '.gitignore', this.dir)
    }
  }

  runSync(args: { filename: string; fn: () => string; as?: 'string' }): string
  runSync(args: { filename: string; fn: () => Buffer; as?: 'buffer' }): Buffer
  runSync(args: {
    filename: string
    fn: () => string | Buffer
    as?: 'string' | 'buffer'
  }): string | Buffer {
    const file = join(this.dir, args.filename)
    if (args.filename.includes('/') || args.filename.includes('\\')) {
      const dir = dirname(file)
      mkdirSync(dir, { recursive: true })
    }
    try {
      const stats = statSync(file)
      const passedTime = Date.now() - stats.mtimeMs
      if (passedTime < this.expireInterval) {
        const buffer = readFileSync(file)
        if (args.as === 'string') return buffer.toString()
        return buffer
      }
    } catch (error) {
      // file not exists or name clash with directory
    }
    const result = args.fn()
    writeFileSync(file, result)
    return result
  }

  runAsync(args: {
    filename: string
    fn: () => Promise<string>
    as?: 'string'
  }): Promise<string>
  runAsync(args: {
    filename: string
    fn: () => Promise<Buffer>
    as?: 'buffer'
  }): Promise<Buffer>
  async runAsync(args: {
    filename: string
    fn: () => Promise<string | Buffer>
    as?: 'string' | 'buffer'
  }): Promise<string | Buffer> {
    const file = join(this.dir, args.filename)
    if (args.filename.includes('/') || args.filename.includes('\\')) {
      const dir = dirname(file)
      await mkdir(dir, { recursive: true })
    }
    try {
      const stats = await stat(file)
      const passedTime = Date.now() - stats.mtimeMs
      if (passedTime < this.expireInterval) {
        const buffer = await readFile(file)
        if (args.as === 'string') return buffer.toString()
        return buffer
      }
    } catch (error) {
      // file not exists or name clash with directory
    }
    const result = await args.fn()
    writeFile(file, result)
    return result
  }
}
