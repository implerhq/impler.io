import Image from 'next/image';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { Carousel } from '@mantine/carousel';
import { Grid, Title, Text } from '@mantine/core';

import useStyles from './OnboardLayout.styles';
import WidgetSlideImage from '@assets/images/auth-carousel/widget.png';
import ActionsSlideImage from '@assets/images/auth-carousel/actions.png';
import WorkflowsSlideImage from '@assets/images/auth-carousel/workflows.png';

const Support = dynamic(() => import('components/common/Support').then((mod) => mod.Support), {
  ssr: false,
});

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
      <Support />
    </>
  );
}
