<a name="readme-top"></a>

<div align="center">
  <a href="https://impler.io?utm_source=github" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/implerhq/impler.io/assets/50201755/7695ab1a-29f2-475c-976a-a74c9dfd60cc">
    <img alt="Impler Logo" src="https://github.com/implerhq/impler.io/assets/50201755/7695ab1a-29f2-475c-976a-a74c9dfd60cc" width="280"/>
  </picture>
  </a>
</div>

<br />

<p align="center">
  <a href="https://github.com/implerhq/impler.io/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/implerhq/impler.io.svg?style=for-the-badge" alt="Impler Contributors" />
  </a>
  <a href="https://github.com/implerhq/impler.io/network/members">
    <img src="https://img.shields.io/github/forks/implerhq/impler.io.svg?style=for-the-badge" alt="Impler Forks" />
  </a>
  <a href="https://github.com/implerhq/impler.io/issues">
    <img src="https://img.shields.io/github/issues/implerhq/impler.io.svg?style=for-the-badge" alt="Impler Issues" />
  </a>
  <a href="https://github.com/implerhq/impler.io/stargazers">
    <img src="https://img.shields.io/github/stars/implerhq/impler.io.svg?style=for-the-badge" alt="Impler Stars" />
  </a>
</p>

<h1 align="center">Readymade and scalable data import experience for developers👩‍💻</h1>
<div align="center">Simple and intuitive way to onboard users data via guided import widget</div>

<br />

<div align="center">
  <p align="center">
    <a href="https://docs.impler.io"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://web.impler.io">See it first hand</a>
    ·
    <a href="https://discord.impler.io">Meet the team</a>
    ·
    <a href="https://github.com/implerhq/impler.io/issues/new?assignees=&labels=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/implerhq/impler.io/issues/new?assignees=&labels=&template=feature_request.md&title=">Request Feature</a>
  </p>
</div>

## 🤔 Why Impler?

Impler provides embeddable, scalable, and readymade data import experience in products. With Impler you don't need to worry about building and managing complex architecture for importing customers' data. Just integrate impler with few easy steps and the data import experience will be ready in just a few minutes.

## ✨ Features

- 🕸️ Guided and responsive data import widget
- ☠️ Static and Dynamic validations to validate all kinds of data
- 📔 Auto-generate Excel template along with excel based validations
- 🧹 Facility to clean the invalid data during import
- 🪝 Webhook support to send imported data to the application
- 💪 Ability to provide default and dynamic schema
- 🧪 Event hooks to react according to widget status
- 🤸‍♂️ Facility to format data application receives
- 👨‍💻 Guided and driven by community

## 🚀 Getting Started

The best way to explore the possibilities of the platform is by creating your Import. Head over to [web portal](https://web.impler.io) and setup your account.

After setting up your account, you can create an import and add columns to it. Once columns are added you're ready to import data.

There are two ways:
1. Click on `Import` button to open the import widget from the web portal
2. Embed import widget import widget into your application

To integrate impler into your reactjs application, you need to install the package:

```bash
npm install @impler/react
```

Add script in your app before closing body tag
```html
<script type="text/javascript" src="https://embed.impler.io/embed.umd.min.js" async></script>
```

```ts
import { useImpler } from '@impler/react';
        
const { showWidget, isImplerInitiated } = useImpler({
    templateId: "<TEMPLATE_ID>",
    projectId: "<PROJECT_ID>",
    accessToken: "<ACCESS_TOKEN>",
});

<button disabled={!isImplerInitiated} onClick={showWidget}>
    Import
</button>
```

## Contributing

Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Here are a few ways:
- Help with open issues or create your own
- Share your thoughts and suggestions with us over [discord](https://discord.impler.io)
- Help create tutorials and blog posts
- Request a feature by opening an issue with the tag `enhancement`
- Report a bug by providing steps to reproduce

If you have something in mind that would make it better, please fork the repo and create a pull request. Every hand is appreciated!

## 💻 Need Help?

We are more than happy to help you. If you are getting any errors or facing problems while working on this project, join our [discord server](https://discord.impler.io) and ask for help. We are open to discussing anything related to the project.

## ⚡ Immediate working space with Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/implerhq/impler.io)

## 🔗 Quick Links

🏡 [Home page](https://impler.io?utm_source=github) <br />
🏗️ [Contribution Guidelines](https://github.com/implerhq/impler.io/blob/next/CONTRIBUTING.md) <br />
💻 [Run Impler Locally](https://docs.impler.io/community/run-impler-locally)

## 🛡️ License

Impler is licensed under the MIT License - see the [LICENSE](https://github.com/implerhq/impler.io/blob/next/LICENSE) file for details.

## 🎖️ Thank you

The beauty of open-source software is enhanced through collaborative efforts. Don't forget to give the project a star :star:! Thanks again!
