import { Controller } from 'react-hook-form';
import { DestinationsEnum, ITemplate } from '@impler/shared';
import { Stack, TextInput as Input, Group, Select, Flex, Badge } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, ROUTES } from '@config';
import { NumberInput } from '@ui/number-input';
import { DOCUMENTATION_REFERENCE_LINKS, REGULAR_EXPRESSIONS } from '@config';
import { useDestination } from '@hooks/useDestination';
import { DestinationItem } from './DestinationItem';
import { LockIcon } from '@assets/icons/Lock.icon';

interface DestinationProps {
  template: ITemplate;
}

export function Destination({ template }: DestinationProps) {
  const {
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
    openSampleRequestModal,
    isUpdateImportLoading,
    isSendSampleRequestPending,
    isMapBubbleIoColumnsLoading,
    isSendSampleRequestLoading,
    bubbleIoIntegrationUnavailable,
    webhookRetrySettingsUnavailable,
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

  return (
    <Stack>
      <DestinationItem
        title="Get Imported Data in Frontend"
        subtitle="User imported data will be sent to frontend"
        active={destination === DestinationsEnum.FRONTEND}
        onClick={() => swithDestination(DestinationsEnum.FRONTEND)}
        tooltipLink={DOCUMENTATION_REFERENCE_LINKS.frontendEndCallback}
      />
      <DestinationItem
        title="Webhook"
        subtitle="Provide webhook to receive data"
        active={destination === DestinationsEnum.WEBHOOK}
        onClick={() => swithDestination(DestinationsEnum.WEBHOOK)}
        tooltipLink={DOCUMENTATION_REFERENCE_LINKS.webhook}
      >
        <form onSubmit={onSubmit}>
          <Stack spacing="xs">
            <Input
              required
              label="Callback URL"
              placeholder="Callback URL"
              description={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>REST endpoint where data will be sent. Ex. https://acme.inc/api/data</span>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => openSampleRequestModal()}
                    loading={isSendSampleRequestLoading || isSendSampleRequestPending}
                  >
                    Send Test Webhook
                  </Button>
                </div>
              }
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

            <Group grow>
              {webhookRetrySettingsUnavailable ? (
                <Flex
                  direction="row"
                  gap="sm"
                  align="center"
                  p="xs"
                  bg={colors.BGSecondaryDark}
                  style={{
                    border: `1px solid ${colors.StrokeDark}`,
                  }}
                >
                  <LockIcon size="xl" color="#868e96" />
                  <Stack spacing={5} w="100%" align="flex-start">
                    <Badge color="orange">Premium Feature</Badge>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>Advanced Retry Settings</p>
                      <p style={{ fontSize: '0.75rem', color: '#868e96', margin: '4px 0 0 0' }}>
                        Configure custom retry intervals and counts for failed webhook deliveries
                      </p>
                    </div>
                  </Stack>
                  <Button
                    component="a"
                    size="xs"
                    href={ROUTES.EXPLORE_PLANS}
                    onClick={() => {
                      window.location.href = ROUTES.EXPLORE_PLANS;

                      return false;
                    }}
                  >
                    Upgrade
                  </Button>
                </Flex>
              ) : (
                <>
                  <Controller
                    name="webhook.retryInterval"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Retry Interval"
                        description="Specify how long the system waits in minutes before sending the next request after a failure."
                        placeholder="Retry Interval"
                        data={[
                          { value: '5', label: '5 minutes' },
                          { value: '15', label: '15 minutes' },
                          { value: '30', label: '30 minutes' },
                        ]}
                        value={String(field.value || '')}
                        onChange={(value) => field.onChange(Number(value))}
                        error={errors.webhook?.message}
                      />
                    )}
                  />
                  <Controller
                    name="webhook.retryCount"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Retry Count"
                        description="Maximum number of retry attempts allowed before the system stops retrying."
                        placeholder="Retry Count"
                        data={[
                          { value: '2', label: '2' },
                          { value: '5', label: '5' },
                        ]}
                        value={String(field.value || '')}
                        onChange={(value) => field.onChange(Number(value))}
                        error={errors.webhook?.message}
                      />
                    )}
                  />
                </>
              )}
            </Group>

            <Button loading={isUpdateImportLoading} type="submit">
              Save
            </Button>
          </Stack>
        </form>
      </DestinationItem>

      <DestinationItem
        title="Bubble.io"
        subtitle={
          bubbleIoIntegrationUnavailable
            ? 'Bubble.io as a destination is not available in your current plan'
            : 'Send Imported data to bubble.io'
        }
        active={destination === DestinationsEnum.BUBBLEIO}
        onClick={() => swithDestination(DestinationsEnum.BUBBLEIO)}
        tooltipLink={DOCUMENTATION_REFERENCE_LINKS.bubbleIo}
        disabled={bubbleIoIntegrationUnavailable}
      >
        <form onSubmit={onSubmit}>
          <Stack spacing="xs">
            <Input
              required
              label="Bubble App URL"
              placeholder="https://acme.in/api/1.1/obj/customers"
              description={
                <>
                  <div>Example with default domain: https://your-app.bubbleapps.io/api/1.1/obj/your-datatype</div>
                  <div>Example with custom domain: https://yourapp.com/api/1.1/obj/your-datatype</div>
                </>
              }
              {...register('bubbleIo.bubbleAppUrl')}
              error={errors?.bubbleIo?.bubbleAppUrl?.message}
            />
            <Input
              required
              label="API Private Key"
              placeholder="API Private Key"
              {...register('bubbleIo.apiPrivateKey')}
              error={errors?.bubbleIo?.apiPrivateKey?.message}
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
