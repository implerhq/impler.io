import { INTEGRATION_GUIDE } from '@config';
import { IntegrationEnum } from '@impler/shared';
import { NativeSelect } from '@ui/native-select';

type LanguageSelectorProps = {
  integration: IntegrationEnum;
  setIntegration: (value: IntegrationEnum) => void;
};

export const IntegrationSelector = ({ integration, setIntegration }: LanguageSelectorProps) => (
  <NativeSelect
    value={integration}
    data={INTEGRATION_GUIDE}
    onChange={(value) => setIntegration((value as IntegrationEnum) || IntegrationEnum.JAVASCRIPT)}
  />
);
