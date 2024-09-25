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
    <a href="https://github.com/implerhq/impler.io/issues/new">Report Bug</a>
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
npm install @impler/angular
```

```bash
yarn add @impler/angular
```

## 🔨 Usage

### Add Script
You copy this snippet to your code in `index.html` file in head tag.
```html
<script type="text/javascript" src="https://embed.impler.io/embed.umd.min.js" async></script>
```

### Add Import Button

```tsx
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventCalls, EventTypesEnum, ImplerService } from '@impler/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'import-component';

  constructor(
    private implerService: ImplerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.implerService.initializeImpler();
      this.implerService.subscribeToWidgetEvents((eventData: EventCalls) => {
        switch (eventData.type) {
          case EventTypesEnum.DATA_IMPORTED:
            console.log('Data Imported', eventData.value);
            break;
          default:
            console.log(eventData);
            break;
        }
      });
    }
  }
  public show(): void {
    this.implerService.showWidget({
      colorScheme: 'dark',
      projectId: '...',
      templateId: '...',
      accessToken: '...',
    });
  }
}
```

## 🔗 Links

- [Home page](https://impler.io/)
- [Documentation](https://docs.impler.io/importer/angular-embed)