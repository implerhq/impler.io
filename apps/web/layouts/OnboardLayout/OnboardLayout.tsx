import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { Carousel } from '@mantine/carousel';
import { useQuery } from '@tanstack/react-query';
import { Grid, Title, Text, Stack } from '@mantine/core';

import { commonApi } from '@libs/api';
import { API_KEYS, TEXTS } from '@config';
import { IErrorObject } from '@impler/shared';

import useStyles from './OnboardLayout.styles';
import { useAppState } from 'store/app.context';
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
    image: UncertainitySlideImage,
    title: 'Remove Uncertainity from Data',
    subtitle: 'Missing values, invalid format, empty rows and unknown column names gets handled automatically.',
  },
  {
    image: PowerfullSlideImage,
    title: 'Stay Powerful',
    subtitle: `Don't let old and buggy data import cross your way to scale and making your users happy.`,
  },
];

export function OnboardLayout({ children }: PropsWithChildren) {
  const { classes } = useStyles();
  const { setProfileInfo } = useAppState();
  useQuery<unknown, IErrorObject, IProfileData, [string]>(
    [API_KEYS.ME],
    () => commonApi<IProfileData>(API_KEYS.ME as any, {}),
    {
      onSuccess(profileData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.usetifulTags = { userId: profileData?._id };
        setProfileInfo(profileData);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Get started | Impler</title>
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
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
