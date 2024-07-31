import { Controller } from 'react-hook-form';
import { DestinationsEnum, ITemplate } from '@impler/shared';
import { Stack, TextInput as Input, Group } from '@mantine/core';

import { Button } from '@ui/button';
import { NumberInput } from '@ui/number-input';
import { DoaminInput } from '@ui/domain-input';
import { documentationReferenceLinks, REGULAR_EXPRESSIONS } from '@config';
import { NativeSelect } from '@ui/native-select';
import { useDestination } from '@hooks/useDestination';
import { DestinationItem } from './DestinationItem';

interface DestinationProps {
  template: ITemplate;
}

export function Destination({ template }: DestinationProps) {
  const {
    watch,
    errors,
    control,
    onSubmit,
    setValue,
    register,
    destination,
    setDestination,
    resetDestination,
    updateDestination,
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
      if (newDestination === DestinationsEnum.FRONTEND) {
        setDestination(newDestination);
        updateDestination({ destination: DestinationsEnum.FRONTEND, webhook: undefined, bubbleIo: undefined });
      }
    }
  };
  const bubbleDestinationEnvironment = watch('bubbleIo.environment');

  return (
    <Stack>
      <DestinationItem
        title="Get Imported Data in Frontend"
        subtitle="User imported data will be sent to frontend"
        active={destination === DestinationsEnum.FRONTEND}
        onClick={() => swithDestination(DestinationsEnum.FRONTEND)}
        tooltipLink={documentationReferenceLinks.frontendEndCallback}
      />
      <DestinationItem
        title="Webhook"
        subtitle="Provide webhook to receive data"
        active={destination === DestinationsEnum.WEBHOOK}
        onClick={() => swithDestination(DestinationsEnum.WEBHOOK)}
        tooltipLink={documentationReferenceLinks.webhook}
      >
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
            <Input label="Auth Header Name" placeholder="Auth Header Name" {...register('webhook.authHeaderName')} />
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
      </DestinationItem>

      <DestinationItem
        title="Bubble.io"
        subtitle="Send Imported data to bubble.io"
        active={destination === DestinationsEnum.BUBBLEIO}
        onClick={() => swithDestination(DestinationsEnum.BUBBLEIO)}
        tooltipLink={documentationReferenceLinks.bubbleIo}
      >
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

            <Controller
              control={control}
              name="bubbleIo.environment"
              render={({ field }) => (
                <NativeSelect
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
            {bubbleDestinationEnvironment === 'production' && (
              <Input
                label="Custom Domain Name"
                placeholder="Custom Domain Name"
                {...register('bubbleIo.customDomainName', {
                  pattern: /^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/,
                })}
                description="Required, if application is hosted on custom domain. Ex. myapp.io"
                error={errors?.bubbleIo?.customDomainName ? 'Please enter valid domain name' : undefined}
              />
            )}
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
      </DestinationItem>
    </Stack>
  );
}
