import { ITemplate } from '@impler/shared';
import { Controller } from 'react-hook-form';
import { Stack, Accordion, Title, Switch, useMantineColorScheme, TextInput as Input } from '@mantine/core';

import { Button } from '@ui/button';
import { Select } from '@ui/select';
import { NumberInput } from '@ui/number-input';
import { REGULAR_EXPRESSIONS, colors } from '@config';
import { useDestination } from '@hooks/useDestination';

interface DestinationProps {
  template: ITemplate;
}

export function Destination({ template }: DestinationProps) {
  const { colorScheme } = useMantineColorScheme();
  const { watch, setValue, register, control, errors, onSubmit, resetDestination, isUpdateImportLoading } =
    useDestination({ template });
  const destination = watch('destination');

  return (
    <>
      <Accordion
        radius={0}
        variant="contained"
        value={String(destination)}
        disableChevronRotation
        chevron={
          <Switch
            color={colors.blue}
            checked={destination === 'webhook'}
            onChange={() => {
              if (destination === 'webhook') resetDestination({ destination: undefined, webhook: undefined });
              else setValue('destination', 'webhook');
            }}
          />
        }
      >
        <Accordion.Item value="webhook">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              Webhook
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Provide webhook to receive data
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={onSubmit}>
              <Stack spacing="xs">
                <Input
                  placeholder="Callback URL"
                  error={errors.webhook?.callbackUrl ? 'Please enter valid URL' : undefined}
                  {...register('webhook.callbackUrl', {
                    pattern: REGULAR_EXPRESSIONS.URL,
                  })}
                />
                <Input placeholder="Auth Header Name" {...register('webhook.authHeaderName')} />
                <Controller
                  control={control}
                  name="webhook.chunkSize"
                  render={({ field }) => (
                    <NumberInput
                      placeholder="100"
                      register={{
                        value: field.value,
                        onChange: field.onChange,
                      }}
                      error={errors.webhook?.chunkSize?.message}
                    />
                  )}
                />
                <Button loading={isUpdateImportLoading} type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Accordion
        radius={0}
        variant="contained"
        value={String(destination)}
        disableChevronRotation
        chevron={
          <Switch
            color={colors.blue}
            checked={destination === 'bubbleIo'}
            onChange={() => {
              if (destination === 'bubbleIo') resetDestination({ destination: undefined, bubbleIo: undefined });
              else setValue('destination', 'bubbleIo');
            }}
          />
        }
      >
        <Accordion.Item value="bubbleIo">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              Bubble.io
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Send Imported data to bubble.io
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={onSubmit}>
              <Stack spacing="xs">
                <Input
                  {...register('bubbleIo.appName')}
                  placeholder="Bubble Application Name"
                  error={errors.bubbleIo?.appName?.message}
                />
                <Input
                  placeholder="Custom Domain Name"
                  {...register('bubbleIo.customDomainName')}
                  error={errors?.bubbleIo?.customDomainName?.message}
                />
                <Controller
                  control={control}
                  name="bubbleIo.environment"
                  render={({ field }) => (
                    <Select
                      register={{
                        value: field.value,
                        onChange: field.onChange,
                      }}
                      data={['development', 'production']}
                      error={errors.bubbleIo?.environment?.message}
                    />
                  )}
                />
                <Input
                  placeholder="API Private Key"
                  {...register('bubbleIo.apiPrivateKey')}
                  error={errors?.bubbleIo?.apiPrivateKey?.message}
                />
                <Input
                  placeholder="Datatype"
                  {...register('bubbleIo.datatype')}
                  error={errors?.bubbleIo?.datatype?.message}
                />
                <Button loading={isUpdateImportLoading} type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
