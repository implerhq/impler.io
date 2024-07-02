import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';

interface IHeadingProps {
  title?: string;
  active: PhasesEnum;
  hasImageUpload?: boolean;
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

export function Heading({ active, title, hasImageUpload }: IHeadingProps) {
  const theme = useMantineTheme();

  return (
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      {active ? (
        <Group style={{ justifyContent: 'space-between' }} mb="lg">
          <Title order={3}>{title}</Title>
          <Stepper
            active={active - (hasImageUpload ? 1 : 2)}
            steps={[
              ...(hasImageUpload
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
