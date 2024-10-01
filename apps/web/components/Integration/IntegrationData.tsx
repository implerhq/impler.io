import React, { ReactNode } from 'react';
import { Text } from '@mantine/core';
import { IntegrationEnum } from '@impler/shared';
import { CodeBlock } from './ContentBlock';

export const integrationData: Record<IntegrationEnum, Record<string, ReactNode>> = {
  [IntegrationEnum.JAVASCRIPT]: {
    'Add Script': (
      <>
        <Text size="sm">
          Copy this snippet to your code before the closing body tag. It will add impler variable in window.
        </Text>
        <CodeBlock
          code="<script type='text/javascript' src='https://embed.impler.io/embed.umd.min.js' async></script>"
          language="javascript"
        />
      </>
    ),
    'Add Import Button': (
      <>
        <Text>Use the following button to open Impler:</Text>
        <CodeBlock code={`<button disabled id="impler-btn">Import</button>`} language="markup" />
      </>
    ),
    'Initialize Widget': (
      <>
        <Text size="sm">Before the widget gets shown you have to call its init method:</Text>
        <CodeBlock
          code={`
          <script type="text/javascript">
            let uuid = generateUuid();
            let isImplerInitialized = false;
            const ImplerBtn = document.getElementById("impler-btn");

            function generateUuid() { // (1)
              return window.crypto.getRandomValues(new Uint32Array(1))[0];
            }

            window.onload = (e) => {
              if (window.impler) {
                window.impler.init(uuid); // (2)

                const readyCheckInterval = setInterval(() => {
                  if (window.impler.isReady()) { // (3)
                    clearInterval(readyCheckInterval);
                    ImplerBtn.removeAttribute("disabled"); // (4)
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
    'Show Widget': (
      <>
        <Text size="sm">After initialization, use the following code to show the widget:</Text>
        <CodeBlock
          code={`
          ImplerBtn.addEventListener("click", (e) => {
            window.impler.show({
              uuid,
              projectId: "", // projectId
              templateId: "", // templateId
              accessToken: "", // accessToken
            });
          });
        `}
          language="javascript"
        />
      </>
    ),
    'Listening to Events': (
      <>
        <Text size="sm">You can listen for events from the Impler widget:</Text>
        <CodeBlock
          code={`
          window.impler.on('message', (eventData) => {
            // handle events here
          }, uuid);
        `}
          language="javascript"
        />
      </>
    ),
    'Complete Code Example': (
      <>
        <Text size="sm">Here is a complete code example:</Text>
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
              <script type="text/javascript" src="https://embed.impler.io/embed.umd.min.js" async></script>
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
                        projectId: "",
                        templateId: "",
                        accessToken: "",
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
    'Add Script': (
      <>
        <Text size="sm">Copy this snippet to your code before the closing body tag.</Text>
        <CodeBlock
          code="<script type='text/javascript' src='https://embed.impler.io/embed.umd.min.js' async></script>"
          language="javascript"
        />
      </>
    ),
    'Install Package': (
      <>
        <Text size="sm">Install the Package</Text>
        <CodeBlock code="npm i @impler/react" language="jsx" />
      </>
    ),
    'Add Import Button': (
      <>
        <Text size="lg">Add Import Button</Text>
        <Text mt="sm">
          @impler/react provides a headless <code>useImpler</code> hook that you can use to show an import widget in
          your application.
        </Text>
        <CodeBlock
          code={`import { useImpler } from '@impler/react';

const { showWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: "",
});

<button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>`}
          language="javascript"
        />
      </>
    ),
    'Usage Example': (
      <>
        <Text size="lg">Usage Example</Text>
        <CodeBlock
          code={`import { useImpler } from '@impler/react';

const { showWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: ""
});

function MyComponent() {
  return <button disabled={!isImplerInitiated} onClick={showWidget}>Import</button>;
}`}
          language="javascript"
        />
      </>
    ),
    'Customize Texts': (
      <>
        <Text size="lg">Customize Texts</Text>
        <CodeBlock
          code={`import { useImpler } from '@impler/react';

const { showWidget, isImplerInitiated } = useImpler({
    projectId: "",
    templateId: "",
    accessToken: "",
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
    'Listening for Events': (
      <>
        <Text size="lg">Listening for Events</Text>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: "",
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
    'Data Seeding in Sample File': (
      <>
        <Text size="lg">Data Seeding in Sample File</Text>
        <CodeBlock
          code={`showWidget({
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
    'Providing Runtime Schema': (
      <>
        <Text size="lg">Providing Runtime Schema</Text>
        <CodeBlock
          code={`showWidget({
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
    'Advanced Validations': (
      <>
        <Text size="lg">Advanced Validations</Text>
        <CodeBlock
          code={`showWidget({
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
    'Programmatically Closing Import Widget': (
      <>
        <Text size="lg">Programmatically Closing Import Widget</Text>
        <CodeBlock
          code={`const { showWidget, closeWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: "",
  onDataImported: (data) => {
      console.log("Imported data:", data);
      closeWidget();
  }
});`}
          language="javascript"
        />
      </>
    ),
    'Changing Import Title': (
      <>
        <Text size="lg">Changing Import Title</Text>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: "",
  title: "Employee Import"
});`}
          language="javascript"
        />
      </>
    ),
    'Changing Theme Color': (
      <>
        <Text size="lg">Changing Theme Color</Text>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: "",
  primaryColor: '#5f45ff'
});`}
          language="javascript"
        />
      </>
    ),
    'Providing Authentication Header': (
      <>
        <Text size="lg">Providing Authentication Header</Text>
        <CodeBlock
          code={`const { showWidget, isImplerInitiated } = useImpler({
  projectId: "",
  templateId: "",
  accessToken: "",
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
    'Use Impler Service': (
      <>
        <Text size="lg">Use Impler Service</Text>
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

    'Customize Texts': (
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

    'Applying App Color Scheme': (
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

    'Data Seeding in Sample File': (
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

    'Providing Runtime Schema': (
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

    'Advanced Validations': (
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

    'Using Typescript': (
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

    'Passing Extra Parameters': (
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

    'Programmatically Closing Import Widget': (
      <CodeBlock
        code={`public close(): void {
  this.implerService.closeWidget();
}`}
        language="typescript"
      />
    ),

    'Changing Import Title': (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    title: "Employee Import"
  });
}`}
        language="typescript"
      />
    ),

    'Changing Theme Color': (
      <CodeBlock
        code={`public show(): void {
  this.implerService.showWidget({
    primaryColor: '#5f45ff'
  });
}`}
        language="typescript"
      />
    ),

    'Providing Authentication Header Value': (
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

    'Usage Example': (
      <>
        <Text size="lg">Usage Example</Text>
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
  [IntegrationEnum.BUBBLE]: {},
};
