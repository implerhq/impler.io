<div align="center">
  <a href="https://impler.io">
    <img src="https://user-images.githubusercontent.com/50201755/203472285-e64392b4-b01d-4ee9-95d8-9a41297fdfe2.png" width="280" alt="Logo"/>
  </a>
</div>
<h1 align="center">Embed Data Import into your Product</h1>
  <p align="center">
    <br />
    <a href="https://docs.impler.io"><strong>Explore the docs »</strong></a>
    ·
    <a href="https://discord.impler.io">Join Discord</a>
    ·
    <a href="https://github.com/knovator/impler.io/issues/new">Report Bug</a>
  </p>
  
## ⭐️ Why
The ability to import data is often needed in the application. It usually starts the same, reading `.csv` or `.xlsx` file and insert records into the database. But after a while, you'll find yourself looping over large files, validating rows, and providing support for file types that you've never heard of them before.

Impler's goal is to help developers create an efficient and smooth data import experience between the product and its users. All with an easy-to-use API and outstanding developer experience.

## ✨ Features

- 🌈 Mapping Support between specified Schema and Fields in File
- 💅 Validation Support
- 🚀 Webhook support to send uploaded data
- 🛡 Simple and powerful Authentication
- 📦 Easy to set up and integrate
- 🛡 Written in TypeScript

## 📦 Install

```bash
npm install @impler/react
```

```bash
yarn add @impler/react
```

## 🔨 Usage

### Add Script
You copy this snippet to your code before the closing body tag.
```html
<script type="text/javascript" src="https://localhost:4701/embed.umd.min.js" async></script>
```

### Add Import Button

```tsx
import { Button as ImportButton } from '@impler/react';

<ImportButton
    projectId="<PROJECT_ID>"
    template="<CODE_OR_ID>" /* optional */
    accessToken="<SECRET>" /* required if API is protected */
/>
```

## 🔗 Links

- [Home page](https://impler.io/)
