import React, { useState } from 'react';
import { Button, Card, Group, Stack, Text, Textarea, JsonInput, Alert } from '@mantine/core';
import { useDestination } from '@hooks/useDestination';
import { ITemplate } from '@impler/shared';

interface ISampleRequestExampleProps {
  template: ITemplate;
}

export function sampleRequestExample({ template }: ISampleRequestExampleProps) {
  const { sendSampleRequest, isSendSampleRequestLoading } = useDestination({ template });
  const [sampleData, setSampleData] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example sample data for demonstration
  const exampleSampleData = {
    rows: [
      {
        'Product Name': 'iPhone 14 Pro',
        Quantity: 25,
        'Unit Price': 999.99,
        Category: 'Electronics',
      },
      {
        'Product Name': 'MacBook Air M2',
        Quantity: 10,
        'Unit Price': 1199.99,
        Category: 'Electronics',
      },
      {
        'Product Name': 'AirPods Pro',
        Quantity: 50,
        'Unit Price': 249.99,
        Category: 'Accessories',
      },
    ],
    metadata: {
      source: 'manual_test',
      timestamp: new Date().toISOString(),
      testType: 'product_import_validation',
    },
  };

  const handleSendSample = async () => {
    // eslint-disable-next-line no-console
    console.log('🚀 Frontend: Initiating sample request...');
    // eslint-disable-next-line no-console
    console.log('Template ID:', template._id);
    // eslint-disable-next-line no-console
    console.log('Template Name:', template.name);

    try {
      let parsedData;
      if (sampleData.trim()) {
        parsedData = JSON.parse(sampleData);
      } else {
        parsedData = exampleSampleData;
      }

      // eslint-disable-next-line no-console
      console.log('📤 Frontend: Sending sample data:', parsedData);

      const requestPayload = {
        ...parsedData,
        description: description || 'Test sample request from frontend',
      };

      // eslint-disable-next-line no-console
      console.log('📦 Frontend: Final request payload:', requestPayload);

      // This will trigger the mutation and call the backend API
      sendSampleRequest(requestPayload, {
        onSuccess: (data) => {
          // eslint-disable-next-line no-console
          console.log('✅ Frontend: Sample request successful:', data);
          setResponse(data);
          setError(null);
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('❌ Frontend: Sample request failed:', err);
          setError(err.message || 'Unknown error occurred');
          setResponse(null);
        },
      });
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
      // eslint-disable-next-line no-console
      console.error('❌ Frontend: JSON parsing error:', errorMessage);
      setError('Invalid JSON format in sample data');
    }
  };

  const loadExampleData = () => {
    setSampleData(JSON.stringify(exampleSampleData, null, 2));
    setDescription('Example product import test with validation');
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack spacing="md">
        <Text size="lg" weight={500}>
          Sample Request Test - Template: {template.name}
        </Text>

        <Alert color="blue" title="API Endpoint Information">
          <Text size="sm">
            <strong>Backend Endpoint:</strong> POST /v1/template/{template._id}/send-sample
            <br />
            <strong>Frontend Hook:</strong> useDestination.sendSampleRequest
            <br />
            <strong>Console Logging:</strong> Check browser console and server logs for detailed flow
          </Text>
        </Alert>

        <Textarea
          label="Description (Optional)"
          placeholder="Describe what this sample request is testing..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={2}
        />

        <JsonInput
          label="Sample Data (JSON)"
          placeholder="Enter sample data as JSON or use example data"
          value={sampleData}
          onChange={setSampleData}
          minRows={10}
          maxRows={15}
          validationError="Invalid JSON format"
        />

        <Group>
          <Button
            variant="outline"
            onClick={loadExampleData}
            disabled={isSendSampleRequestLoading}
          >
            Load Example Data
          </Button>
          
          <Button
            onClick={handleSendSample}
            loading={isSendSampleRequestLoading}
            disabled={!sampleData.trim() && !exampleSampleData}
          >
            Send Sample Request
          </Button>
        </Group>

        {response && (
          <Alert color="green" title="✅ Success Response">
            <Text size="sm" style={{ fontFamily: 'monospace' }}>
              <strong>Request ID:</strong> {String(response.requestId || 'N/A')}
              <br />
              <strong>Status:</strong> {String(response.status || 'N/A')}
              <br />
              <strong>Processed Rows:</strong> {String(response.processedRows || 0)}
              <br />
              <strong>Timestamp:</strong> {String(response.timestamp || 'N/A')}
              <br />
              {response.details && typeof response.details === 'object' && (
                <>
                  <strong>Processing Time:</strong>{' '}
                  {String((response.details as Record<string, unknown>).processingTime || 'N/A')}ms
                  <br />
                  <strong>Template Name:</strong>{' '}
                  {String((response.details as Record<string, unknown>).templateName || 'N/A')}
                </>
              )}
            </Text>
          </Alert>
        )}

        {error && (
          <Alert color="red" title="❌ Error">
            <Text size="sm">{error}</Text>
          </Alert>
        )}

        <Alert color="gray" title="🔍 Console Logging Flow">
          <Text size="xs">
            <strong>Frontend Logs:</strong>
            <br />
            • 🚀 Initiating sample request
            <br />
            • 📤 Sending sample data
            <br />
            • 📦 Final request payload
            <br />
            • ✅/❌ Success/Error response
            <br />
            <br />
            
            <strong>Backend Logs:</strong>
            <br />
            • 🚀 API Endpoint Hit
            <br />
            • ✅ Template found
            <br />
            • 🔄 Processing sample data
            <br />
            • 📊 Sample data processed
            <br />
            • 🆔 Generated request ID
            <br />
            • ✅ Sample request completed
          </Text>
        </Alert>
      </Stack>
    </Card>
  );
}

// Example usage in a component:
/*
import { sampleRequestExample } from './example-sample-request-usage';

function MyTemplateComponent() {
  const template = useTemplate(); // Your template data
  
  return (
    <div>
      <sampleRequestExample template={template} />
    </div>
  );
}
*/
