import { Controller } from 'react-hook-form';
import { DestinationsEnum, ITemplate } from '@impler/shared';
import { Stack, Accordion, Title, Switch, useMantineColorScheme, TextInput as Input, Group } from '@mantine/core';

import { Button } from '@ui/button';
import { Select } from '@ui/select';
import useStyles from './Destination.styles';
import { NumberInput } from '@ui/number-input';
import { DoaminInput } from '@ui/domain-input';
import { REGULAR_EXPRESSIONS, colors } from '@config';
import { useDestination } from '@hooks/useDestination';

interface DestinationProps {
  template: ITemplate;
}

export function Destination({ template }: DestinationProps) {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const {
    destination,
    register,
    control,
    errors,
    setValue,
    onSubmit,
    setDestination,
    resetDestination,
    mapBubbleIoColumnsClick,
    isUpdateImportLoading,
    isMapBubbleIoColumnsLoading,
  } = useDestination({
    template,
  });

  const swithDestination = (newDestination: DestinationsEnum) => {
    if (destination === newDestination)
      resetDestination({ destination: undefined, webhook: undefined, bubbleIo: undefined });
    else {
      setDestination(newDestination);
      setValue('destination', newDestination);
    }
  };

  return (
    <Stack>
      <Accordion
        radius={0}
        variant="contained"
        value={destination}
        classNames={classes}
        disableChevronRotation
        chevron={
          <Switch
            color={colors.blue}
            checked={destination === DestinationsEnum.WEBHOOK}
            onChange={() => swithDestination(DestinationsEnum.WEBHOOK)}
          />
        }
      >
        <Accordion.Item value={DestinationsEnum.WEBHOOK}>
          <Accordion.Control disabled>
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
                  required
                  label="Callback URL"
                  placeholder="Callback URL"
                  description="REST endpoint where data will be sent. Ex. https://acme.inc/api/data"
                  error={errors.webhook?.callbackUrl ? 'Please enter valid URL' : undefined}
                  {...register('webhook.callbackUrl', {
                    pattern: REGULAR_EXPRESSIONS.URL,
                  })}
                />
                <Input
                  label="Auth Header Name"
                  placeholder="Auth Header Name"
                  {...register('webhook.authHeaderName')}
                />
                <Controller
                  control={control}
                  name="webhook.chunkSize"
                  render={({ field }) => (
                    <NumberInput
                      required
                      label="Chunk Size"
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
        value={destination}
        classNames={classes}
        disableChevronRotation
        onChange={() => swithDestination(DestinationsEnum.BUBBLEIO)}
        chevron={
          <Switch
            color={colors.blue}
            checked={destination === DestinationsEnum.BUBBLEIO}
            onChange={() => swithDestination(DestinationsEnum.BUBBLEIO)}
          />
        }
      >
        <Accordion.Item value={DestinationsEnum.BUBBLEIO}>
          <Accordion.Control disabled>
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
                <Controller
                  name="bubbleIo.appName"
                  control={control}
                  render={({ field }) => (
                    <DoaminInput
                      value={field.value}
                      label="Bubble App Name"
                      onChange={field.onChange}
                      rightSection=".bubbleapps.io"
                      placeholder="Bubble Application Name"
                      error={errors.bubbleIo?.appName?.message}
                    />
                  )}
                />

                <Input
                  label="Custom Domain Name"
                  placeholder="Custom Domain Name"
                  {...register('bubbleIo.customDomainName', {
                    pattern: /^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/,
                  })}
                  description="Required, if application is hosted on custom domain. Ex. myapp.io"
                  error={errors?.bubbleIo?.customDomainName ? 'Please enter valid domain name' : undefined}
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
                      required
                      label="Environment"
                      data={['development', 'production']}
                      error={errors.bubbleIo?.environment?.message}
                    />
                  )}
                />
                <Input
                  required
                  label="API Private Key"
                  placeholder="API Private Key"
                  {...register('bubbleIo.apiPrivateKey')}
                  error={errors?.bubbleIo?.apiPrivateKey?.message}
                />
                <Input
                  required
                  label="Datatype Name"
                  placeholder="Datatype"
                  {...register('bubbleIo.datatype')}
                  error={errors?.bubbleIo?.datatype?.message}
                />
                <Group>
                  <Button loading={isUpdateImportLoading} type="submit">
                    Test and Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={mapBubbleIoColumnsClick}
                    loading={isMapBubbleIoColumnsLoading}
                  >
                    Map Columns
                  </Button>
                </Group>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
