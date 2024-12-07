/**
 * Migration script for deleting environments associated with deleted projects.
 *
 * This migration is designed to clean up environment documents that are still
 * associated with projects that have already been deleted. In older versions
 * of the system, if a project was deleted, the corresponding environment
 * documents were not automatically deleted. This issue has been fixed in
 * newer versions, but for older users, we need to run this migration to
 * ensure that any environments associated with deleted projects are properly removed.
 */

import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { EnvironmentRepository } from '@impler/dal';
export async function run() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const environmentRepository = new EnvironmentRepository();
  const deletedProjectsInEnvironments = await environmentRepository.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: '_projectId',
        foreignField: '_id',
        as: 'project',
      },
    },
    {
      $match: {
        project: {
          $size: 0,
        },
      },
    },
    {
      $unwind: {
        path: '$apiKeys',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'apiKeys._userId',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    {
      $unwind: {
        path: '$userInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        _projectId: 1,
        apiKeys: {
          _userId: '$apiKeys._userId',
          // key: "$apiKeys.key",
          user: {
            firstName: '$userInfo.firstName',
            lastName: '$userInfo.lastName',
            email: '$userInfo.email',
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        _projectId: {
          $first: '$_projectId',
        },
        apiKeys: {
          $push: '$apiKeys',
        },
      },
    },
  ]);

  const deletedProjectIdInEnvironment = deletedProjectsInEnvironments.map((deletedProjects) => deletedProjects._id);

  if (deletedProjectIdInEnvironment.length > 0) {
    await environmentRepository.deleteMany({
      _id: { $in: deletedProjectIdInEnvironment },
    });
    console.log(`end migration - deleted ${deletedProjectIdInEnvironment.length} environments.`);
  } else {
    console.log('end migration - No environments found to delete.');
  }

  app.close();
  process.exit(0);
}
run();
