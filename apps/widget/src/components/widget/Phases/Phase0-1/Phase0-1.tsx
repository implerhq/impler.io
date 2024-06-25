import { Flex, Image, Indicator, Stack, Text } from '@mantine/core';
import { Select } from '@ui/Select';
import { FileDropzone } from '@ui/FileDropzone';
import { Footer } from 'components/Common/Footer';
import { PhasesEnum } from '@types';
import { CrossIcon } from '@icons';
import { colors } from '@config';

export function Phase01() {
  return (
    <>
      <Stack style={{ flexGrow: 1 }}>
        <Flex gap="sm">
          <Select
            title="Select Column"
            placeholder="Select Column"
            data={['Name', 'Email', 'Phone', 'Address', 'Date']}
            style={{ flexGrow: 1 }}
          />
        </Flex>
        <FileDropzone title="Upload Image" onDrop={() => {}} />
        <Stack>
          <div>
            <Text>Uploaded Images for Photo</Text>
            <Flex wrap="wrap" gap="xs">
              <Indicator
                withBorder
                tabIndex={0}
                label={<CrossIcon />}
                color={colors.danger}
                styles={{
                  indicator: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    width: '1.7rem',
                    cursor: 'pointer',
                    height: '1.7rem !important',
                    transform: 'translate(30%, -30%) !important',
                  },
                }}
              >
                <Image
                  src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ"
                  radius="md"
                  width={100}
                  height={100}
                />
              </Indicator>

              <Indicator
                p={0}
                withBorder
                tabIndex={0}
                label={<CrossIcon />}
                color={colors.danger}
                styles={{
                  indicator: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    width: '1.7rem',
                    cursor: 'pointer',
                    height: '1.7rem !important',
                    transform: 'translate(30%, -30%) !important',
                  },
                }}
              >
                <Image
                  src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ"
                  radius="md"
                  width={100}
                  height={100}
                />
              </Indicator>

              <Indicator
                p={0}
                withBorder
                tabIndex={0}
                label={<CrossIcon />}
                color={colors.danger}
                styles={{
                  indicator: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    width: '1.7rem',
                    cursor: 'pointer',
                    height: '1.7rem !important',
                    transform: 'translate(30%, -30%) !important',
                  },
                }}
              >
                <Image
                  src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ"
                  radius="md"
                  width={100}
                  height={100}
                />
              </Indicator>
            </Flex>
          </div>
          <div>
            <Text>Uploaded Images for Photo</Text>
            <Flex wrap="wrap" gap="xs">
              <Indicator
                withBorder
                tabIndex={0}
                label={<CrossIcon />}
                color={colors.danger}
                styles={{
                  indicator: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    width: '1.7rem',
                    cursor: 'pointer',
                    height: '1.7rem !important',
                    transform: 'translate(30%, -30%) !important',
                  },
                }}
              >
                <Image
                  src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ"
                  radius="md"
                  width={100}
                  height={100}
                />
              </Indicator>

              <Indicator
                p={0}
                withBorder
                tabIndex={0}
                label={<CrossIcon />}
                color={colors.danger}
                styles={{
                  indicator: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    width: '1.7rem',
                    cursor: 'pointer',
                    height: '1.7rem !important',
                    transform: 'translate(30%, -30%) !important',
                  },
                }}
              >
                <Image
                  src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ"
                  radius="md"
                  width={100}
                  height={100}
                />
              </Indicator>
            </Flex>
          </div>
        </Stack>
      </Stack>
      <Footer onNextClick={() => {}} onPrevClick={() => {}} active={PhasesEnum.IMAGE_UPLOAD} />
    </>
  );
}
