import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { Carousel } from '@mantine/carousel';
import { Grid, Title, Text, Stack } from '@mantine/core';

import useStyles from './OnboardLayout.styles';
import WidgetSlideImage from '@assets/images/auth-carousel/widget.png';
import PowerfullSlideImage from '@assets/images/auth-carousel/powerfull.png';
import UncertainitySlideImage from '@assets/images/auth-carousel/uncertainity.png';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

const slides: {
  image: any;
  title: string;
  subtitle: string;
}[] = [
  {
    image: WidgetSlideImage,
    title: 'Guided Import Widget',
    subtitle: 'Within few minutes add scalable and production ready import widget to your application.',
  },
  {
    image: PowerfullSlideImage,
    title: 'Stay Powerful',
    subtitle: `Don't let old and buggy data import cross your way to scale and making your users happy.`,
  },
  {
    image: UncertainitySlideImage,
    title: 'Remove Uncertainity from Data',
    subtitle: 'Missing values, invalid format, empty rows and unknown column names gets handled automatically.',
  },
];

export function OnboardLayout({ children }: PropsWithChildren) {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Get started with Impler</title>
        <meta name="description" content="Manage your import and exports at one place" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid className={classes.grid} gutter={0}>
          <Grid.Col md={6} className={classes.contentCol}>
            <div className={classes.contentContainer}>{children}</div>
          </Grid.Col>
          <Grid.Col md={6} className={classes.carouselCol}>
            <Carousel loop slideGap="md" withIndicators classNames={classes}>
              {slides.map((slide, index) => (
                <Carousel.Slide key={index} className={classes.slide} h="100%">
                  <Image src={slide.image} height={650} alt="Feature rich actions" className={classes.image} />
                  <Stack className="content" spacing={10} px="lg">
                    <Title order={1} align="center" color="white" className="title">
                      {slide.title}
                    </Title>
                    <Text size="lg" fw={500} align="center" color="white" className="subtitle">
                      {slide.subtitle}
                    </Text>
                  </Stack>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Grid.Col>
        </Grid>
      </main>
      <Support />
    </>
  );
}
