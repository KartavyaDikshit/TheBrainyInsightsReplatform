<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 🛠️ Fixing Prisma `DATABASE_URL` Resolution on Windows + pnpm

Below is the definitive checklist that resolves 99% of Prisma “`Error: Environment variable not found: DATABASE_URL`” problems on Windows 10/11 when you use pnpm, PowerShell/CMD, and VS Code terminals.

***

## 1. Confirm the Environment Variable Really Reaches the Prisma CLI

1. Open **the exact shell** you are running `pnpm prisma …` from (PowerShell or CMD).
2. Run:

```powershell
echo %DATABASE_URL%      # CMD  
$Env:DATABASE_URL        # PowerShell
```

3. If it prints an empty line → Prisma cannot see it either.

### Quick Set-Once Fix

```powershell
# PowerShell
$Env:DATABASE_URL="postgresql://tbi_user:password@localhost:5432/tbi_db"
pnpm prisma db push
```

If this works, the issue is **variable propagation**, not Prisma itself.

***

## 2. Choose ONE Reliable Way to Inject Environment Variables

### A. `.env` File (Recommended)

1. Create a file **at repository root** called `.env` (no extension).
2. Add exactly (one line, no quotes):
```
DATABASE_URL="postgresql://tbi_user:password@localhost:5432/tbi_db"
```

3. Run again:
```bash
pnpm prisma db push
```

Prisma reads `.env` automatically if it is in the same folder that contains the `schema.prisma` referenced in `prisma generate`.

**Common pitfall → wrong path**
If your `schema.prisma` lives in `packages/database/prisma/schema.prisma`, the `.env` must live in `packages/database/prisma/` or you must tell Prisma where the env file is:

```jsonc
// inside schema.prisma
generator client {
  provider = "prisma-client-js"
  envFiles = ["../../.env"]  // relative to schema.prisma
}
```


### B. Cross-Env for Scripts

If you prefer package-level scripts:

```jsonc
"scripts": {
  "db:push": "cross-env DATABASE_URL=\"postgresql://...\" prisma db push"
}
```

Install once:

```bash
pnpm add -D cross-env
```


***

## 3. Verify pnpm Passes the Variable to Sub-Processes

Unlike npm, **pnpm runs scripts in a tiny shell**. Occasionally on Windows it drops variables coming from PowerShell profiles. Two solutions:

### A. Use `--shamefully-hoist` (rarely needed)

```bash
pnpm install --shamefully-hoist
```


### B. Call Prisma Directly

Instead of:

```bash
pnpm prisma db push
```

run:

```bash
node ./packages/database/node_modules/.bin/prisma db push
```

—If that works, the issue is pnpm’s script shim; switch to:

```jsonc
"scripts": {
  "db:push": "prisma db push"
}
```

and always execute via:

```bash
pnpm run db:push
```

(not bare `pnpm prisma …`).

***

## 4. Prisma Binary Cache Issues

Occasionally the downloaded Prisma CLI binary is built for another platform and silently ignores env vars.

```bash
pnpm exec prisma generate --clear-cache
pnpm exec prisma db push --skip-generate
```


***

## 5. Windows Path \& Special Characters

1. **No caret (`^`), percent (`%`), or ampersand (`&`)** characters un-escaped in the URL.
2. Use **double quotes** in CMD, **single or double** in PowerShell.

***

## 6. VS Code Integrated Terminal Quirks

Open a **fresh external shell** (CMD or PowerShell) instead of the VS Code terminal and retry:

```bash
pnpm prisma db push
```

If it works outside VS Code → the IDE’s terminal profile is overriding envs.

***

## 7. Node 18+ and `dotenv` Conflict

If you added `dotenv.config()` in a custom Prisma script, make sure it is executed **before** you call Prisma:

```js
import 'dotenv/config';
import { execSync } from 'node:child_process';

execSync('prisma db push', { stdio: 'inherit' });
```


***

## 8. Final Diagnostic Script

Create **`scripts/print-env.cjs`**:

```js
console.log('DATABASE_URL=', process.env.DATABASE_URL || '<undefined>');
```

Run:

```bash
node scripts/print-env.cjs
pnpm exec prisma env list
```

Both must print the same URL. If the script shows the URL but Prisma does not, open an issue on the Prisma repo with this output.

***

## 9. The Nuclear Option—Global `.env`

If all else fails, set it system-wide (Windows):

```powershell
[Environment]::SetEnvironmentVariable(
  "DATABASE_URL",
  "postgresql://tbi_user:password@localhost:5432/tbi_db",
  [EnvironmentVariableTarget]::User
)
# Reboot or restart shell
```


***

# 🎯 Summary Action List

1. Place a `.env` **in the same folder as `schema.prisma`** (or configure `envFiles`).
2. Run `pnpm exec prisma env list` to verify Prisma sees the variable.
3. Always call Prisma via `pnpm run db:push` (script) instead of bare `pnpm prisma …`.
4. Clear Prisma cache if still failing.
5. Confirm in a fresh external shell.

Follow these steps line by line—once `prisma env list` shows the correct `DATABASE_URL`, `pnpm prisma db push` will succeed, and you can continue with schema creation and seeding.

