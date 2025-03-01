## TODO:

- ajouter du rouge lorsqu'une donnée est invalide.
- ajouter le nom des volumes et des secteurs
- hole overlaps
- navigation des avions (si PVT dispo)
- STCA, NCA
- pour les secteurs n'afficher que le contour extérieur
- avoir des infobulles (par exemple pour un secteur afficher les volumes et niveaux)
- pouvoir déplacer les noms si il y a chevauchement.
- impression
- export/import des visibilités, zoom et déplacements pour pouvoir reproduire une impression. reset des déplacements
- pouvoir sélectionner un volume ou secteur ???

##Diary: step 1: create project

```
$ node --version
v22.13.1
$ npm --version
10.9.2
$ npm create vite@latest
sapin
react
typescript
git init .
git branch -m main
git add -A .
git commit -m "initial commit: create vite 6 with react 19 and typescript"
```

##Step 2: add tailwind 4.0.6

```
npm install -D tailwindcss postcss autoprefixer @types/node @tailwindcss/vite
```

https://tailwindcss.com/docs/installation/using-vite

Update vite.config.js

```
0a1
> import path from 'path'
1a3
> import tailwindcss from '@tailwindcss/vite'
6c8,13
<   plugins: [react()],
---
>   plugins: [tailwindcss(), react()],
>   resolve: {
>     alias: {
>       '@': path.resolve(__dirname, './src/')
>     }
>   }
```

Update tsconfig.json

```
6c6,12
<   ]
---
>   ],
>   "compilerOptions": {
>     "baseUrl": ".",
>     "paths": {
>       "@/*": ["./src/*"]
>     }
>   }
```

Update tsconfig.app.json

```
23c23,31
<     "noUncheckedSideEffectImports": true
---
>     "noUncheckedSideEffectImports": true,
>
>     /* shadcdn */
>     "baseUrl": ".",
>     "paths": {
>       "@/*": [
>         "./src/*"
>       ]
>     }
```

Le but de ces modifications est de définir un alias @ qui pointe vers le répertoire src.
Cela permet de faire
`import MonComposant from '@/components/MonComposant'`
au lieu de
`import MonComposant from '../components/MonComposant'`

##Step 3: add shadcn@canary

```
$ npx shadcn@canary init
neutral
yes
```

Ajout du composant resizable
`$ npx shadcn@canary add resizable`

Tout est prét pour commencer à coder.

##Step 4: react-router-dom
`npm install  react-router-dom`
Ajout des compasants et des données (static/api)

##Step 5: add dark mode

##Step 6: add ToolBar
npx shadcn@canary add dropdown-menu button avatar breadcrumb

##Step 7: add login/logout

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
