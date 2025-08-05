/*
 *This migrartion is for the having only the bubbleAppUrl or streamlined using this send the bubble data to the specified destionation, the
 *bubbleAppUrl contains everything the version the datatype and other things, if these fields are not there we construct using the existing data
 */
import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { BubbleDestinationRepository } from '@impler/dal';

export async function run() {
  const bubbleDestinationRepository: BubbleDestinationRepository = new BubbleDestinationRepository();

  // eslint-disable-next-line no-console
  console.log('start migration - Constructing, Generating and Updating the bubbleAppUrl');

  // Init the mongodb connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const constructBubbleUrl = async (bubbleDestination: any | undefined | null) => {
    const bubbleAppUrl = [{ _id: '', bubbleAppUrl: '' }];
    bubbleDestination.forEach((destination) => {
      /*
       * If no direct URL, try to construct it from available fields
       * Type assertion to access potential additional properties
       */
      const customDomainName = destination.customDomainName as string | undefined;
      const appName = destination.appName as string | undefined;
      const environment = destination.environment as string | undefined;
      const datatype = destination.datatype as string | undefined;

      if (customDomainName || appName) {
        // Use custom domain if available, otherwise use app name with bubbleapps.io
        let baseUrl = customDomainName ? `https://${customDomainName}` : `https://${appName}.bubbleapps.io`;

        // Add version-test for development environment if specified
        if (environment === 'development') {
          baseUrl += '/version-test';
        }

        // Construct the full URL with the data type if available
        if (datatype) {
          bubbleAppUrl.push({ _id: destination._id, bubbleAppUrl: `${baseUrl}/api/1.1/obj/${datatype}` });
        }
      }
    });

    return bubbleAppUrl;
  };

  const bubbleDestinationLink = await bubbleDestinationRepository.find({
    bubbleAppUrl: { $exists: true, $ne: null },
  });

  const bubbleDestinations = await bubbleDestinationRepository.find({});
  const bubbleAppUrls = await constructBubbleUrl(bubbleDestinations);
  bubbleDestinationLink.map((link) => {
    bubbleAppUrls.push({ _id: link._id, bubbleAppUrl: link.bubbleAppUrl });
  });

  bubbleAppUrls.map(async (url) => {
    if (!url._id || !url.bubbleAppUrl) return;

    try {
      await bubbleDestinationRepository.update({ _id: url._id }, { $set: { bubbleAppUrl: url.bubbleAppUrl } });
    } catch (error) {
      return null;
    }
  });

  // eslint-disable-next-line no-console
  console.log('end migration - Constructed, Generated and Updated the bubbleAppUrl');

  app.close();
  process.exit(0);
}
run();
