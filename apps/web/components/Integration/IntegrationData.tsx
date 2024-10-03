import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Code, List } from '@mantine/core';

import { colors } from '@config';
import { CodeBlock } from './ContentBlock';
import { ModifiedText } from './ModifiedText';
import { IntegrationEnum } from '@impler/shared';

interface IContentProps {
  templateId: string;
  projectId: string;
  accessToken: string;
  embedScriptUrl: string;
}

export const integrationData: Record<IntegrationEnum, Record<string, (data: IContentProps) => ReactNode>> = {
  [IntegrationEnum.JAVASCRIPT]: {
    'Add Script': ({ embedScriptUrl }) => (
      <>
        <ModifiedText>Add embed script before closing body tag.</ModifiedText>
        <CodeBlock
          code={`<script type='text/javascript' src='${embedScriptUrl}' async></script>`}
          language="javascript"
        />
      </>
    ),
    'Add Import Button': () => (
      <>
        <CodeBlock code={`<button disabled id="impler-btn">Import</button>`} language="markup" />
      </>
    ),
    'Initialize Widget': () => (
      <>
        <ModifiedText size="sm">
          Before the widget gets shown you have to call <Code>init</Code> method, which initialize the importer.
        </ModifiedText>
        <CodeBlock
          code={`
<script type="text/javascript">
  let uuid = generateUuid();
  let isImplerInitialized = false;
  const ImplerBtn = document.getElementById("impler-btn");

  function generateUuid() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  window.onload = (e) => {
    if (window.impler) {
      window.impler.init(uuid);

      const readyCheckInterval = setInterval(() => {
        if (window.impler.isReady()) {
          clearInterval(readyCheckInterval);
          ImplerBtn.removeAttribute("disabled");
        }
      }, 1000);
    }
  };
</script>
        `}
          language="javascript"
        />
      </>
    ),
    'Show Widget': ({ accessToken, projectId, templateId }) => (
      <>
        <ModifiedText size="sm">After initialization, use the following code to show the widget:</ModifiedText>
        <CodeBlock
          code={`
ImplerBtn.addEventListener("click", (e) => {
  window.impler.show({
    uuid,
    projectId: "${projectId}",
    templateId: "${templateId}",
    accessToken: "${accessToken}",
  });
});
        `}
          language="javascript"
        />
      </>
    ),
    'Listening to Events': () => (
      <>
        <ModifiedText size="sm">You can listen for events from the Impler widget:</ModifiedText>
        <CodeBlock
          code={`
 window.impler.on('message', (eventData) => {
  switch (eventData.type) {
    case "WIDGET_READY":
      console.log("Widget is ready");
      break;
    case "CLOSE_WIDGET":
      console.log("Widget is closed");
      break;
    case "UPLOAD_STARTED":
      console.log("Upload started", eventData.value);
      break;
    case "UPLOAD_TERMINATED":
      console.log("Upload skipped in middle", eventData.value);
      break;
    case "UPLOAD_COMPLETED":
      console.log("Upload completed", eventData.value);
      break;
    case "DATA_IMPORTED":
      console.log("Data imported", eventData.value);
      break;
    default:
      break;
  }
}, uuid); // uuid generated in "Initialize Widget Step"
        `}
          language="javascript"
        />
      </>
    ),
    'Data Seeding in File': ({ projectId, templateId, accessToken }) => (
      <CodeBlock
        code={`
window.impler.show({
  uuid,
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
  data: [
    { country: 'ABC' },
    { country: 'DEF' },
    { country: 'GHE' },
  ]
});
        `}
      />
    ),
    'Customize Importer Texts': () => (
      <CodeBlock
        code={`
window.impler.show({
  ...
  texts: {
    STEPPER_TITLES: {
      REVIEW_DATA: 'Check Data', // New Title
    },
  },
});
        `}
      />
    ),
    'Advanced Validations': () => (
      <CodeBlock
        code={`
window.impler.show({
  ...
  schema: [
    {
      "key": "Department Code",
      "name": "Department Code",
      "type": "String",
      "validations": [
        {
          "validate": "unique_with",
          "uniqueKey": "Employee No"
        }
      ]
    },
    {
      "key": "Employee Id",
      "name": "Employee Id",
      "type": "Number",
      "validations": [
        {
          "validate": "unique_with",
          "uniqueKey": "Employee No"
        }
      ]
    }
  ]
});
        `}
      />
    ),
    'Providing Runtime Schema': () => (
      <CodeBlock
        code={`
window.impler.show({
  ...
  schema: [
    {
      key: 'country',
      name: 'Country',
      type: 'String'
    }
  ],
  output: {
      "%data%": {
        "country_id": "{{country}}"
      },
      "page": "{{page}}",
      "chunkSize": "{{chunkSize}}",
      "isInvalidRecords": "{{isInvalidRecords}}",
      "template": "{{template}}",
      "uploadId": "{{uploadId}}",
      "fileName": "{{fileName}}",
      "extra": "{{extra}}"
    }
});
`}
      />
    ),
    'Passing Extra Values': () => (
      <CodeBlock
        code={`
window.impler.show({
  ...
  extra: {
      userId: '4ddhodw3',
      time: new Date()
  }
});
`}
      />
    ),
    'Changing Import Title': () => (
      <CodeBlock
        code={`
window.impler.show({
  ...
  title: "Employee Import"
});
`}
      />
    ),
    'Programatically Closing Importer': () => (
      <CodeBlock
        code={`
window.impler.close();
  `}
      />
    ),
    'Changing the Color theme': () => (
      <CodeBlock
        code={`
window.impler.show({
  ...
  primaryColor: '#5f45ff'
});
`}
      />
    ),
    'Passing Auth Header Value': () => (
      <CodeBlock
        code={`
window.impler.show({
  authHeaderValue: () => '$2y$10$M5X2QYelhy1AV.2GgnlEm.aBPUG9CR4lNYP.kQcMP8YWNA.isM446'
});
  `}
      />
    ),
    'Complete Code Example': ({ accessToken, embedScriptUrl, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Acme Inc</title>
  </head>
  <body>
    <button disabled id="impler-btn">Import</button>
    <script type="text/javascript" src="${embedScriptUrl}" async></script>
    <script type="text/javascript">
      let uuid = generateUuid();
      const ImplerBtn = document.getElementById("impler-btn");

      function generateUuid() {
        return window.crypto.getRandomValues(new Uint32Array(1))[0];
      }

      window.onload = (e) => {
        if (window.impler) {
          window.impler.init(uuid);
          const readyCheckInterval = setInterval(() => {
            if (window.impler.isReady()) {
              clearInterval(readyCheckInterval);
              ImplerBtn.removeAttribute("disabled");
            }
          }, 1000);

          ImplerBtn.addEventListener("click", (e) => {
            window.impler.show({
              uuid,
              projectId: "${projectId}",
              templateId: "${templateId}",
              accessToken: "${accessToken}",
            });
          });

          window.impler.on('message', (eventData) => {
            // Handle the messages from the widget
          }, uuid);
        }
      };
    </script>
  </body>
</html>
        `}
          language="markup"
        />
      </>
    ),
  },
  [IntegrationEnum.REACT]: {
    'Add Script': ({ embedScriptUrl }) => (
      <>
        <ModifiedText>Add embed script before closing body tag.</ModifiedText>
        <CodeBlock code={`<script type='text/javascript' src='${embedScriptUrl}' async></script>`} />
      </>
    ),
    'Install Package': () => (
      <>
        <ModifiedText size="sm">Install the Package</ModifiedText>
        <CodeBlock code="npm i @impler/react" language="jsx" />
      </>
    ),
    'Add Import Button': ({ accessToken, projectId, templateId }) => (
      <>
        <ModifiedText mt="sm">
          <Code>@impler/react</Code> provides a headless <code>useImpler</code> hook that you can use to show an import
          widget in your application.
        </ModifiedText>
        <CodeBlock
          code={`
import { useImpler } from '@impler/react';

const { showWidget, isImplerInitiated } = useImpler({
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
});

<button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>`}
          language="javascript"
        />
      </>
    ),
    'Usage Example': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`
import { useImpler } from '@impler/react';

const { showWidget, isImplerInitiated } = useImpler({
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
});

function MyComponent() {
  return <button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>;
}`}
          language="javascript"
        />
      </>
    ),
    'Customize Texts': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`
import { useImpler } from '@impler/react';

const { showWidget, isImplerInitiated } = useImpler({
    projectId: ${projectId},
    templateId: ${templateId},
    accessToken: ${accessToken},
    texts: {
      STEPPER_TITLES: {
          REVIEW_DATA: 'Check Data', // New Title
      },
    },
});

<button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>`}
          language="javascript"
        />
      </>
    ),
    'Listening for Events': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`
const { showWidget, isImplerInitiated } = useImpler({
  projectId: ${projectId},
    templateId: ${templateId},
    accessToken: ${accessToken},
  onUploadStart: (uploadInfo) => {
      console.log("User Started Importing", uploadInfo);
  },
  onUploadTerminate: (uploadInfo) => {
      console.log("User left Import in middle", uploadInfo);
  },
  onUploadComplete: (uploadInfo) => {
      console.log("User completed import", uploadInfo);
  },
  onWidgetClose: () => {
      console.log("Import widget is closed");
  },
  onDataImported: (data) => {
      console.log("Imported data:", data);
  }
});`}
          language="javascript"
        />
      </>
    ),
    'Data Seeding in Sample File': () => (
      <>
        <CodeBlock
          code={`
showWidget({
  data: [
      { country: 'ABC' },
      { country: 'DEF' },
      { country: 'GHE' },
  ]
});`}
          language="javascript"
        />
      </>
    ),
    'Providing Runtime Schema': () => (
      <>
        <CodeBlock
          code={`
showWidget({
  schema: [
      {
        key: 'country',
        name: 'Country',
        type: 'String'
      }
  ],
  output: {
    "%data%": {
      "country_id": "{{country}}"
    },
    "page": "{{page}}",
    "chunkSize": "{{chunkSize}}",
    "isInvalidRecords": "{{isInvalidRecords}}",
    "template": "{{template}}",
    "uploadId": "{{uploadId}}",
    "fileName": "{{fileName}}",
    "extra": "{{extra}}"
  }
});`}
          language="javascript"
        />
      </>
    ),
    'Advanced Validations': () => (
      <>
        <CodeBlock
          code={`
showWidget({
  schema: [
    {
      "key": "Department Code",
      "name": "Department Code",
      "type": "String",
      "validations": [
        {
          "validate": "unique_with",
          "uniqueKey": "Employee No"
        }
      ]
    },
    {
      "key": "Employee Id",
      "name": "Employee Id",
      "type": "Number",
      "validations": [
        {
          "validate": "unique_with",
          "uniqueKey": "Employee No"
        }
      ]
    }
  ]
});`}
          language="javascript"
        />
      </>
    ),
    'Programmatically Closing Import Widget': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`const { showWidget, closeWidget, isImplerInitiated } = useImpler({
  projectId: ${projectId},
   templateId: ${templateId},
    accessToken: ${accessToken},
  onDataImported: (data) => {
      console.log("Imported data:", data);
      closeWidget();
  }
});`}
          language="javascript"
        />
      </>
    ),
    'Changing Import Title': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
  projectId: ${projectId},
   templateId: ${templateId},
    accessToken: ${accessToken},
  title: "Employee Import"
});`}
          language="javascript"
        />
      </>
    ),
    'Changing Theme Color': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
  projectId: ${templateId},
  templateId: ${projectId},
  accessToken: ${accessToken},
  primaryColor: '#5f45ff'
});`}
          language="javascript"
        />
      </>
    ),
    'Providing Authentication Header': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
   projectId: ${templateId},
  templateId: ${projectId},
  accessToken: ${accessToken},
  authHeaderValue: async () => {
      return "..."
  }
});`}
          language="javascript"
        />
      </>
    ),
  },
  [IntegrationEnum.ANGULAR]: {
    'Add Script': () => (
      <>
        <CodeBlock
          code="<script type='text/javascript' src='https://embed.impler.io/embed.umd.min.js' async></script>"
          language="javascript"
        />
      </>
    ),
    'Install Package': () => (
      <>
        <CodeBlock code="npm i @impler/angular" language="javascript" />
      </>
    ),
    'Use Impler Service': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          code={`import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { EventCalls, EventTypesEnum, ImplerService } from '@impler/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'impler-app';

  constructor(
    private implerService: ImplerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.implerService.initializeImpler();
    }
  }

  public show(): void {
    this.implerService.showWidget({
      colorScheme: 'dark',
      projectId: ${templateId},
  templateId: ${projectId},
  accessToken: ${accessToken},
    });
  }
}`}
          language="typescript"
        />
      </>
    ),

    'Customize Texts': () => (
      <CodeBlock
        code={`public show(): void {
        this.implerService.showWidget({
          ...
          texts: {
            STEPPER_TITLES: {
              REVIEW_DATA: 'Check Data', // New Title
            },
          }
        });
      `}
        language="typescript"
      />
    ),

    'Applying App Color Scheme': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    ...
    colorScheme: 'dark',
  });
}`}
        language="javascript"
      />
    ),

    'Data Seeding in Sample File': () => (
      <CodeBlock
        code={` public show(): void {
        this.implerService.showWidget({
          data: [
              { country: 'Canada' },
              { country: 'Australia' },
              { country: 'Germany' },
          ]
        });
}`}
        language="javascript"
      />
    ),

    'Providing Runtime Schema': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    schema: [
      {
        key: 'country',
        name: 'Country',
        type: 'String'
      }
    ],
    output: {
      "%data%": {
        "country_id": "{{country}}"
      },
      "page": "{{page}}",
      "chunkSize": "{{chunkSize}}",
      "isInvalidRecords": "{{isInvalidRecords}}",
      "template": "{{template}}",
      "uploadId": "{{uploadId}}",
      "fileName": "{{fileName}}",
      "extra": "{{extra}}"
    }
  });
}`}
        language="typescript"
      />
    ),

    'Advanced Validations': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    schema: [
      {
        "key": "Department Code",
        "name": "Department Code",
        "type": "String",
        "validations": [
          {
            "validate": "unique_with",
            "uniqueKey": "Employee No"
          }
        ]
      },
      {
        "key": "Employee Id",
        "name": "Employee Id",
        "type": "Number",
        "validations": [
          {
            "validate": "unique_with",
            "uniqueKey": "Employee No"
          }
        ]
      }
    ]
  });
}`}
        language="typescript"
      />
    ),

    'Using Typescript': () => (
      <CodeBlock
        code={`import { useImpler, ColumnTypes, ValidationTypes } from '@impler/angular';

public show(): void {
  this.implerService.showWidget({
    schema: [
      {
        key: 'country',
        name: 'Country',
        type: ColumnTypes.STRING,
        "validations": [
          {
            "validate": ValidationTypes.LENGTH,
            "min": 5,
            "max": 100,
            "errorMessage": "Country Name must be between 5 to 100 characters"
          }
        ]
      }
    ]
  });
}`}
        language="typescript"
      />
    ),

    'Passing Extra Parameters': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    extra: {
      userId: '4ddhodw3',
      time: new Date().this string()
    }
  });
}`}
        language="typescript"
      />
    ),

    'Programmatically Closing Import Widget': () => (
      <CodeBlock
        code={`public close(): void {
  this.implerService.closeWidget();
}`}
        language="typescript"
      />
    ),

    'Changing Import Title': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    title: "Employee Import"
  });
}`}
        language="typescript"
      />
    ),

    'Changing Theme Color': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    primaryColor: '#5f45ff'
  });
}`}
        language="typescript"
      />
    ),

    'Providing Authentication Header Value': () => (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    authHeaderValue: async () => {
      return "..."
    }
  });
}`}
        language="typescript"
      />
    ),

    'Usage Example': () => (
      <>
        <ModifiedText>Usage Example</ModifiedText>
        <CodeBlock
          code={`...
import { EventCalls, EventTypesEnum, ImplerService } from '@impler/angular';

@Component({
  ...
})
export class AppComponent {
  title = 'impler-app';

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
}`}
          language="typescript"
        />
      </>
    ),
  },
  [IntegrationEnum.BUBBLE]: {
    'Integration Steps': () => (
      <>
        <List type="ordered">
          <List.Item>
            Setting Bubble App
            <List type="unordered">
              <List.Item>You must have a paid bubble application plan to use the Bubble Data API</List.Item>
            </List>
            <List type="ordered">
              <List.Item>Setting up data type</List.Item>
              <List.Item>API Settings</List.Item>
            </List>
          </List.Item>
          <List.Item>
            Setting up the Impler Application
            <List type="ordered">
              <List.Item>Click on the &quot;Create Import&quot; to create the new import</List.Item>
              <List.Item>Give name and click on &quot;Create & Continue&quot;</List.Item>
              <List.Item>Enable Bubble.io destination</List.Item>
              <List.Item>Map Columns</List.Item>
            </List>
          </List.Item>
          <List.Item>
            Using the Plugin
            <List type="ordered">
              <List.Item>Install plugin</List.Item>
              <List.Item>Using the Plugin</List.Item>
            </List>
          </List.Item>
          <List.Item>Considering UserId while importing data</List.Item>
          <List.Item>Theming Importer</List.Item>
          <List.Item>Configuring multiple Importers on Page (In Progress)</List.Item>
        </List>
        <Link href="#">
          <ModifiedText color={colors.yellow}>Visit Documentation with Detailed Steps</ModifiedText>
        </Link>
      </>
    ),
  },
};
