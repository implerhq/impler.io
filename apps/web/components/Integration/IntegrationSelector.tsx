import { INTEGRATION_GUIDE } from '@config';
import { IntegrationEnum } from '@impler/shared';
import { Select } from '@mantine/core';

type LanguageSelectorProps = {
  integration: IntegrationEnum;
  setIntegration: (value: IntegrationEnum) => void;
};

export const IntegrationSelector = ({ integration, setIntegration }: LanguageSelectorProps) => (
  <Select
    size="xs"
    withinPortal
    value={integration}
    data={INTEGRATION_GUIDE}
    onChange={(value) => setIntegration((value as IntegrationEnum) || IntegrationEnum.JAVASCRIPT)} // Ensure proper casting
  />
);
