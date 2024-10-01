import React, { ReactNode } from 'react';
import { Text } from '@mantine/core';
import { IntegrationEnum } from '@impler/shared';
import { CodeBlock } from './ContentBlock';

export const integrationData: Record<IntegrationEnum, Record<string, ReactNode>> = {
  [IntegrationEnum.JAVASCRIPT]: {
    'Add Script': (
      <>
        <Text size="lg">Add Script</Text>
        <Text size="xs">
          Copy & Paste this snippet to your code before the closing body tag. It will add impler variable in window.
        </Text>
        <CodeBlock
          code="<script src='https://embed.impler.io/embed.umd.min.js' async></script>"
          language="javascript"
        />
      </>
    ),
    'Install Package': (
      <>
        <Text>Run the following command:</Text>
        <CodeBlock code="npm install @impler/embed" language="jsx" />
      </>
    ),
    'Add Import Button': (
      <>
        <Text>Use the following button to open Impler:</Text>
        <CodeBlock code={`<button onclick="impler.open()">Import</button>`} language="markup" />
      </>
    ),
    'Usage Example': (
      <>
        <Text>Here is an example of how to use Impler:</Text>
        <CodeBlock code={`window.impler.open();`} language="javascript" />
      </>
    ),
  },
  [IntegrationEnum.REACT]: {
    'Add Script': (
      <>
        <Text size="lg">Add Script</Text>
        <Text size="xs">Copy this snippet to your code before the closing body tag.</Text>
        <CodeBlock
          code="<script type='text/javascript' src='https://embed.impler.io/embed.umd.min.js' async></script>"
          language="javascript"
        />
      </>
    ),
    'Install Package': (
      <>
        <Text size="lg">Install the Package</Text>
        <Text>Add @impler/react in your application by running the following command:</Text>
        <CodeBlock code="npm i @impler/react" language="jsx" />
      </>
    ),
    'Add Import Button': (
      <>
        <Text size="lg">Add Import Button</Text>
        <Text>
          @impler/react provides a headless <code>useImpler</code> hook that you can use to show an import widget in
          your application.
        </Text>
        <CodeBlock
          code={`import { useImpler } from '@impler/react';\n\nconst { showWidget, isImplerInitiated } = useImpler({\n    projectId: "",\n    templateId: "",\n    accessToken: "",\n});\n\n<button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>`}
          language="javascript"
        />
      </>
    ),
    'Usage Example': (
      <>
        <Text size="lg">Usage Example</Text>
        <CodeBlock
          code={`import { useImpler } from '@impler/react';\n\nconst { showWidget, isImplerInitiated } = useImpler({\n    projectId: "",\n    templateId: "",\n    accessToken: "",\n});\n\nfunction MyComponent() {\n  return <button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>;\n}`}
          language="javascript"
        />
      </>
    ),
  },
  [IntegrationEnum.ANGULAR]: {
    'Add Script': (
      <>
        <Text size="lg">Add Script</Text>
        <CodeBlock
          code="<script type='text/javascript' src='https://embed.impler.io/embed.umd.min.js' async></script>"
          language="javascript"
        />
      </>
    ),
    'Install Package': (
      <>
        <Text size="lg">Install the Package</Text>
        <CodeBlock code="npm i @impler/angular" language="javascript" />
      </>
    ),
    'Add Import Button': (
      <>
        <Text size="lg">Add Import Button</Text>
        <CodeBlock code={`<button (click)="showWidget()">Import</button>`} language="javascript" />
        <Text>Implement the showWidget method in your component:</Text>
        <CodeBlock
          code={`public showWidget(): void {
  this.implerService.showWidget({
    projectId: '...',
    templateId: '...',
    accessToken: '...',
  });
}`}
          language="typescript"
        />
      </>
    ),
    'Usage Example': (
      <>
        <Text size="lg">Usage Example</Text>
        <CodeBlock
          code={`import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImplerService } from '@impler/angular';

@Component({
  selector: 'app-root',
  template: '<button (click)="showWidget()">Import</button>'
})
export class AppComponent {
  constructor(
    private implerService: ImplerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.implerService.initializeImpler();
    }
  }

  public showWidget(): void {
    this.implerService.showWidget({
      projectId: '...',
      templateId: '...',
      accessToken: '...',
    });
  }
}`}
          language="typescript"
        />
      </>
    ),
  },
  [IntegrationEnum.BUBBLE]: {},
};
