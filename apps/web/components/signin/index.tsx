import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Carousel } from '@mantine/carousel';
import { Grid, Title, Text } from '@mantine/core';

import { colors } from '@config';
import useStyles from './Styles';
import { Button } from '@ui/button';

import DarkLogo from '@assets/images/logo-dark.png';
import { GithubIcon } from '@assets/icons/Github.icon';
import WidgetSlideImage from '@assets/images/auth-carousel/widget.png';
import ActionsSlideImage from '@assets/images/auth-carousel/actions.png';
import WorkflowsSlideImage from '@assets/images/auth-carousel/workflows.png';

const slides: {
  image: any;
  title: string;
  subtitle: string;
}[] = [
  {
    image: ActionsSlideImage,
    title: 'Feature rich actions',
    subtitle: 'Our library of actions offers a range of options to meet your needs.',
  },
  {
    image: WidgetSlideImage,
    title: 'Easy Widget Embbed',
    subtitle:
      'Utilize the widget embed facility to quickly and effortlessly import spreadsheets from your application.',
  },
  {
    image: WorkflowsSlideImage,
    title: 'Build Dynamic Workflows',
    subtitle: 'Create workflows that are dynamic and can be customized to meet your needs.',
  },
];

export const Signin = () => {
  const { classes } = useStyles();

  return (
    <main>
      <Grid
        style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: colors.black,
        }}
        gutter={0}
      >
        <Grid.Col md={6} className={classes.signinCol}>
          <div className={classes.signinContainer}>
            <Image src={DarkLogo} alt="Impler Logo" />
            <Title order={1} color="white" mt="sm">
              Signin to Impler
            </Title>
            <Text color="white" mb="sm">
              Hop into your account to start importing records
            </Text>
            <Button component="a" onClick={() => signIn('github')} leftIcon={<GithubIcon />}>
              Continue with Github
            </Button>
          </div>
        </Grid.Col>
        <Grid.Col md={6} className={classes.carouselCol}>
          <Carousel loop slideGap="md" withIndicators classNames={classes}>
            {slides.map((slide, index) => (
              <Carousel.Slide key={index}>
                <Image src={slide.image} height={450} alt="Feature rich actions" />
                <Title order={1} color="white">
                  {slide.title}
                </Title>
                <Text color="white">{slide.subtitle}</Text>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid.Col>
      </Grid>
    </main>
  );
};
