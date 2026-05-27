# TaskFlow — Requirements & Package List

This document lists every npm package required across the monorepo, with version pins and the reason each is included.

---

## Root `package.json`

```json
{
  "name": "taskflow",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "test:backend": "npm run test --workspace=backend",
    "test:frontend": "npm run test --workspace=frontend",
    "test": "npm run test:backend && npm run test:frontend",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.5"
  }
}
```

---

## Backend `package.json`

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.3 | HTTP server framework |
| `mongoose` | ^8.3.0 | MongoDB ODM — schema, validation, queries |
| `jsonwebtoken` | ^9.0.2 | JWT sign + verify |
| `bcryptjs` | ^2.4.3 | Password hashing (pure JS, no native deps) |
| `express-validator` | ^7.0.1 | Request body/param validation middleware |
| `express-rate-limit` | ^7.2.0 | IP-based rate limiting |
| `cors` | ^2.8.5 | Cross-origin request headers |
| `helmet` | ^7.1.0 | Security headers (XSS, CSP etc.) |
| `winston` | ^3.13.0 | Structured logging (console + file) |
| `swagger-jsdoc` | ^6.2.8 | Generate OpenAPI spec from JSDoc comments |
| `swagger-ui-express` | ^5.0.0 | Serve Swagger UI at /api/docs |
| `dotenv` | ^16.4.5 | Load .env file into process.env |
| `zod` | ^3.23.0 | Runtime env var validation + type inference |
| `morgan` | ^1.10.0 | HTTP request logging middleware |

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.3",
    "express-rate-limit": "^7.2.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.0",
    "morgan": "^1.10.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "winston": "^3.13.0",
    "zod": "^3.23.0"
  }
}
```

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `typescript` | ^5.4.5 | TypeScript compiler |
| `ts-node` | ^10.9.2 | Run TypeScript directly in dev |
| `nodemon` | ^3.1.0 | Auto-restart on file changes |
| `@types/express` | ^4.17.21 | Express type definitions |
| `@types/node` | ^20.12.0 | Node.js type definitions |
| `@types/bcryptjs` | ^2.4.6 | bcryptjs type definitions |
| `@types/jsonwebtoken` | ^9.0.6 | JWT type definitions |
| `@types/cors` | ^2.8.17 | CORS type definitions |
| `@types/morgan` | ^1.9.9 | Morgan type definitions |
| `@types/swagger-ui-express` | ^4.1.6 | Swagger UI type definitions |
| `@types/swagger-jsdoc` | ^6.0.4 | Swagger JSDoc type definitions |
| `jest` | ^29.7.0 | Test runner |
| `@types/jest` | ^29.5.12 | Jest type definitions |
| `ts-jest` | ^29.1.4 | TypeScript preprocessor for Jest |
| `supertest` | ^6.3.4 | HTTP integration testing |
| `@types/supertest` | ^6.0.2 | Supertest type definitions |
| `mongodb-memory-server` | ^9.1.1 | In-memory MongoDB for tests |

```json
{
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.12.0",
    "@types/supertest": "^6.0.2",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "jest": "^29.7.0",
    "mongodb-memory-server": "^9.1.1",
    "nodemon": "^3.1.0",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  },
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --forceExit --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Frontend `package.json`

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.0 | UI library |
| `react-dom` | ^18.3.0 | React DOM renderer |
| `react-router-dom` | ^6.23.0 | Client-side routing |
| `@reduxjs/toolkit` | ^2.2.3 | Redux store + RTK Query for API caching |
| `react-redux` | ^9.1.1 | React bindings for Redux |
| `react-hook-form` | ^7.51.3 | Performant form state management |
| `@hookform/resolvers` | ^3.3.4 | Zod resolver bridge for react-hook-form |
| `zod` | ^3.23.0 | Schema validation for forms |
| `clsx` | ^2.1.1 | Conditional class name utility |
| `tailwind-merge` | ^2.3.0 | Merge Tailwind classes without conflicts |
| `react-hot-toast` | ^2.4.1 | Toast notification system |
| `date-fns` | ^3.6.0 | Date formatting and comparison utilities |

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@reduxjs/toolkit": "^2.2.3",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.51.3",
    "react-hot-toast": "^2.4.1",
    "react-redux": "^9.1.1",
    "react-router-dom": "^6.23.0",
    "tailwind-merge": "^2.3.0",
    "zod": "^3.23.0"
  }
}
```

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.2.10 | Build tool + dev server |
| `@vitejs/plugin-react` | ^4.2.1 | React Fast Refresh for Vite |
| `typescript` | ^5.4.5 | TypeScript compiler |
| `tailwindcss` | ^3.4.3 | Utility-first CSS framework |
| `autoprefixer` | ^10.4.19 | PostCSS vendor prefix automation |
| `postcss` | ^8.4.38 | CSS transformation pipeline |
| `vitest` | ^1.6.0 | Vite-native test runner |
| `@vitest/ui` | ^1.6.0 | Vitest web UI |
| `@testing-library/react` | ^15.0.6 | DOM-based React component testing |
| `@testing-library/user-event` | ^14.5.2 | Simulates real user interactions |
| `@testing-library/jest-dom` | ^6.4.2 | Custom DOM matchers |
| `msw` | ^2.3.0 | Mock Service Worker — API mocking in tests |
| `jsdom` | ^24.0.0 | DOM environment for Vitest |
| `@types/react` | ^18.3.0 | React type definitions |
| `@types/react-dom` | ^18.3.0 | ReactDOM type definitions |

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.6",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.0.0",
    "msw": "^2.3.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.10",
    "@vitest/ui": "^1.6.0",
    "vitest": "^1.6.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## Config Files Needed

### Root `.eslintrc.json`
```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

### Root `.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

### Root `.editorconfig`
```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### Backend `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "src/tests"]
}
```

### Frontend `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Backend `jest.config.ts`
```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**'],
  coverageDirectory: 'coverage',
  setupFilesAfterFramework: [],
};
```

### Frontend `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
```
