import { Flex, Stack, Text } from '@mantine/core';
import { Select } from '@ui/Select';
import { PhasesEnum } from '@types';
import { FileDropzone } from '@ui/FileDropzone';
import { Footer } from 'components/Common/Footer';
import { ImageWithIndicator } from '@ui/ImageWithIndicator';

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
              <ImageWithIndicator src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ" />
              <ImageWithIndicator src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ" />
            </Flex>
          </div>
          <div>
            <Text>Uploaded Images for Photo</Text>
            <Flex wrap="wrap" gap="xs">
              <ImageWithIndicator src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ" />
              <ImageWithIndicator src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ" />
              <ImageWithIndicator src="https://fastly.picsum.photos/id/54/200/200.jpg?hmac=-2_HX5umbAEVPP9CokmPW3Kc8V9iDplneKlS73LWdQQ" />
            </Flex>
          </div>
        </Stack>
      </Stack>
      <Footer onNextClick={() => {}} onPrevClick={() => {}} active={PhasesEnum.IMAGE_UPLOAD} />
    </>
  );
}
