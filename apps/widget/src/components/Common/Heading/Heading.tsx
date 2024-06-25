import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';

interface IHeadingProps {
  title?: string;
  active: PhasesEnum;
  imageTemplateAvailable?: boolean;
}

const Steps = [
  {
    label: TEXTS.STEPS.UPLOAD,
  },
  {
    label: TEXTS.STEPS.MAPPING,
  },
  {
    label: TEXTS.STEPS.REVIEW,
  },
  {
    label: TEXTS.STEPS.COMPLETE,
  },
];

export function Heading({ active, title, imageTemplateAvailable }: IHeadingProps) {
  const theme = useMantineTheme();

  return (
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      {active ? (
        <Group style={{ justifyContent: 'space-between' }} mb="lg">
          <Title order={3}>{title}</Title>
          <Stepper
            active={active - 1}
            steps={[
              ...(imageTemplateAvailable
                ? [
                    {
                      label: TEXTS.STEPS.IMAGE_TEMPLATE,
                    },
                  ]
                : []),
              ...Steps,
            ]}
            primaryColor={theme.colors.primary[variables.colorIndex]}
          />
        </Group>
      ) : (
        <></>
      )}
    </MediaQuery>
  );
}
