import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Code, List } from '@mantine/core';

import { colors, DOCUMENTATION_REFERENCE_LINKS } from '@config';
import { CodeBlock } from './ContentBlock';
import { ModifiedText } from './ModifiedText';
import { IntegrationEnum } from '@impler/shared';

interface IContentProps {
  templateId: string;
  projectId: string;
  accessToken: string;
  embedScriptUrl: string;
}

const HEIGHTS = {
  WITH_TEXT: '47vh',
  WITHOUT_TEXT: '50vh',
};

export const integrationData: Record<IntegrationEnum, Record<string, (data: IContentProps) => ReactNode>> = {
  [IntegrationEnum.JAVASCRIPT]: {
    '1) Add Script': ({ embedScriptUrl }) => (
      <>
        <ModifiedText>Add embed script before closing body tag</ModifiedText>
        <CodeBlock
          language="javascript"
          height={HEIGHTS.WITH_TEXT}
          code={`<script type='text/javascript' src='${embedScriptUrl}' async></script>`}
        />
      </>
    ),
    '2) Add Import Button': () => (
      <>
        <CodeBlock
          language="markup"
          height={HEIGHTS.WITHOUT_TEXT}
          code={`<button disabled id="impler-btn">Import</button>`}
        />
      </>
    ),
    '3) Initialize Widget': () => (
      <>
        <ModifiedText size="sm">
          Before the widget gets shown you have to call <Code>init</Code> method, which initialize the importer.
        </ModifiedText>
        <CodeBlock
          height={HEIGHTS.WITH_TEXT}
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
          height={HEIGHTS.WITH_TEXT}
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
          height={HEIGHTS.WITH_TEXT}
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.show({
  uuid,
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
  data: [
    { country: "Germany" },
    { country: "Australia" },
    { country: "Indonesia" },
  ]
});
        `}
      />
    ),
    'Customize Importer Texts': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.show({
  ...
  texts: {
    STEPPER_TITLES: {
      REVIEW_DATA: "Check Data", // New Title
    },
  },
});
        `}
      />
    ),
    'Advanced Validations': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.show({
  ...
  schema: [
    {
      key: "country",
      name: "Country",
      type: "String"
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.show({
  ...
  extra: {
      userId: "4ddhodw3",
      time: new Date()
  }
});
`}
      />
    ),
    'Changing Import Title': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.close();
  `}
      />
    ),
    'Changing the Color theme': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.show({
  ...
  primaryColor: "#5f45ff"
});
`}
      />
    ),
    'Passing Auth Header Value': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
window.impler.show({
  authHeaderValue: async () => {
    return "..."
  }
});
  `}
      />
    ),
    'Complete Code Example': ({ accessToken, embedScriptUrl, projectId, templateId }) => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
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
    '1) Add Script': ({ embedScriptUrl }) => (
      <>
        <ModifiedText>Add embed script before closing body tag</ModifiedText>
        <CodeBlock
          height={HEIGHTS.WITH_TEXT}
          code={`
// ReactJS
<script type='text/javascript' src='${embedScriptUrl}' async></script>

// NextJS
import Script from 'next/script';
...
<Script
  type="text/javascript"
  src="${embedScriptUrl}"
  strategy="beforeInteractive"
/>
          `}
        />
      </>
    ),
    '2) Install Package': () => <CodeBlock height={HEIGHTS.WITHOUT_TEXT} code="npm i @impler/react" language="bash" />,
    '3) Add Import Button': ({ accessToken, projectId, templateId }) => (
      <>
        <ModifiedText>
          Use <Code>useImpler</Code> hook provided by <Code>@impler/react</Code> to show an Importer in application
        </ModifiedText>
        <CodeBlock
          height={HEIGHTS.WITH_TEXT}
          code={`
import { useImpler } from "@impler/react";

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
    'Customize Texts': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
import { useImpler } from "@impler/react";

const { showWidget, isImplerInitiated } = useImpler({
    projectId: "${projectId}",
    templateId: "${templateId}",
    accessToken: "${accessToken}",
    texts: {
      STEPPER_TITLES: {
        REVIEW_DATA: "Check Data", // New Title
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
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
const { showWidget, isImplerInitiated } = useImpler({
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
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
    'Providing Runtime Schema': () => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
showWidget({
  schema: [
    {
      key: "country",
      name: "Country",
      type: "String"
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
    'Data Seeding in Sample File': () => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
showWidget({
  data: [
    { country: "Germany" },
    { country: "Australia" },
    { country: "Bharat" },
    { country: "Indonesia" },
    ...
  ]
});`}
          language="javascript"
        />
      </>
    ),
    'Advanced Validations': () => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
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
    'Using Typescript': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
import { useImpler, ColumnTypes, ValidationTypes } from "@impler/react";

const { showWidget } = useImpler({ ... })

showWidget({
  schema: [
    {
      key: "country",
      name: "Country",
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
`}
        language="typescript"
      />
    ),
    'Closing Import Widget': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
const { showWidget, closeWidget, isImplerInitiated } = useImpler({
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
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
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
const { showWidget, isImplerInitiated } = useImpler({
  projectId: "${projectId}",
  templateId: "${templateId}",
  accessToken: "${accessToken}",
  title: "Employee Import"
});
`}
          language="javascript"
        />
      </>
    ),
    'Changing Theme Color': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
const { showWidget, isImplerInitiated } = useImpler({
  projectId: "${templateId}",
  templateId: "${projectId}",
  accessToken: "${accessToken}",
  primaryColor: "#5f45ff"
});`}
          language="javascript"
        />
      </>
    ),
    'Providing Authentication Header': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
const { showWidget, isImplerInitiated } = useImpler({
  projectId: "${templateId}",
  templateId: "${projectId}",
  accessToken: "${accessToken}",
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
    '1) Add Script': ({ embedScriptUrl }) => (
      <>
        <ModifiedText>Add embed script before closing body tag</ModifiedText>
        <CodeBlock
          language="javascript"
          height={HEIGHTS.WITH_TEXT}
          code={`<script type="text/javascript" src="${embedScriptUrl}" async></script>`}
        />
      </>
    ),

    '2) Install Package': () => (
      <>
        <CodeBlock height={HEIGHTS.WITHOUT_TEXT} code="npm i @impler/angular" language="bash" />
      </>
    ),
    '3) Use Impler Service': ({ accessToken, projectId, templateId }) => (
      <>
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
import { RouterOutlet } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { EventCalls, EventTypesEnum, ImplerService } from "@impler/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "impler-app";

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
    colorScheme: "dark",
    projectId: "${templateId}",
    templateId: "${projectId}",
    accessToken: "${accessToken}",
  })
  }
}`}
          language="typescript"
        />
      </>
    ),

    'Customize Texts': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    ...
    texts: {
    STEPPER_TITLES:{
      REVIEW_DATA: "Check Data", // New Title     
    },
  }
});
`}
        language="typescript"
      />
    ),

    'Applying App Color Scheme': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    ...
    colorScheme: "dark",
  });
}`}
        language="javascript"
      />
    ),

    'Data Seeding in Sample File': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    data: [
        { country: "Canada"}, // spacing
        { country: "Australia"},
        { country: "Germany"},
    ]
  });
}`}
        language="javascript"
      />
    ),

    'Providing Runtime Schema': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    schema: [
      {
        key: "country",
        name: "Country",
        type: "String"
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
import { useImpler, ColumnTypes, ValidationTypes } from "@impler/angular";

public show(): void {
  this.implerService.showWidget({
    schema: [
      {
        key: "country",
        name: "Country",
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
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    extra: {
      userId: "4ddhodw3",
      time: new Date().this string()
    }
  });
}
`}
        language="typescript"
      />
    ),

    'Programmatically Closing Import Widget': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public close(): void {
  this.implerService.closeWidget();
}`}
        language="typescript"
      />
    ),

    'Changing Import Title': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    title: "Employee Import"
  });
}`}
        language="typescript"
      />
    ),

    'Changing Theme Color': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
  this.implerService.showWidget({
    primaryColor: "#5f45ff"
  });
}`}
        language="typescript"
      />
    ),

    'Providing Authentication Header Value': () => (
      <CodeBlock
        height={HEIGHTS.WITHOUT_TEXT}
        code={`
public show(): void {
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
        <CodeBlock
          height={HEIGHTS.WITHOUT_TEXT}
          code={`
import { EventCalls, EventTypesEnum, ImplerService } from "@impler/angular";

@Component({
  ...
})
export class AppComponent {
  title = "impler-app";

  constructor(
    private implerService: ImplerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.implerService.initializeImpler();
      this.implerService.subscribeToWidgetEvents((eventData: EventCalls) => {
        switch (eventData.type) {
          case EventTypesEnum.DATA_IMPORTED:
            console.log("Data Imported", eventData.value);
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
        <List type="ordered" styles={{ item: { margin: '10px 0', paddingLeft: '20px' } }}>
          <List.Item>
            <strong>Setting Up Bubble App</strong>
            <List type="ordered">
              <List.Item>Set up the data type.</List.Item>
              <List.Item>Configure API settings.</List.Item>
            </List>
          </List.Item>

          <List.Item>
            <strong>Setting Up the Impler Application</strong>
            <List type="ordered">
              <List.Item>Click on &quot;Create Import&quote; to initiate a new import.</List.Item>
              <List.Item>Provide a name and click &quot;Create & Continue.&quot;</List.Item>
              <List.Item>Enable the Bubble.io destination.</List.Item>
              <List.Item>Map columns as necessary.</List.Item>
            </List>
          </List.Item>

          <List.Item>
            <strong>Use the Plugin</strong>
            <List type="ordered">
              <List.Item>Install the plugin.</List.Item>
              <List.Item>
                Use the Plugin
                <List type="ordered">
                  <List.Item>Initialize Importer on Page Load</List.Item>
                  <List.Item>Add a Button on the Page and Add Workflow</List.Item>
                  <List.Item>Add Workflow to Open Importer on Button Click</List.Item>
                  <List.Item>Configure Importer</List.Item>
                </List>
              </List.Item>
            </List>
          </List.Item>

          <List.Item>
            <strong>Provide consideration for UserId if neede</strong>
          </List.Item>

          <List.Item>
            <strong>Theme the Importer by providing theme color</strong>
          </List.Item>
        </List>

        <Link href={DOCUMENTATION_REFERENCE_LINKS.bubbleIo}>
          <ModifiedText
            color={colors.yellow}
            style={{ textDecoration: 'underline', marginTop: '20px', display: 'block' }}
          >
            Visit Documentation with Detailed Steps
          </ModifiedText>
        </Link>
      </>
    ),
  },
};
