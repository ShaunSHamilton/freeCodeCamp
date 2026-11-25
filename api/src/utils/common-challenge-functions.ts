import { setTimeout } from 'node:timers/promises';

import { Prisma, type ExamResults, type user } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { omit, pick } from 'lodash-es';
import { challengeTypes } from '@freecodecamp/shared/config/challenge-types';
import { challenges, savableChallenges } from './get-challenges.js';
import { normalizeDate } from './normalize.js';
import { getPoints, type ProgressTimestamp } from './progress.js';

export const jsCertProjectIds = [
  'aaa48de84e1ecc7c742e1124',
  'a7f4d8f2483413a6ce226cac',
  '56533eb9ac21ba0edf2244e2',
  'aff0395860f5d3034dc0bfc9',
  'aa2e6f85cab2ab736c9a9b24'
];

export const multifileCertProjectIds = challenges
  .filter(c => c.challengeType === challengeTypes.multifileCertProject)
  .map(c => c.id);

export const multifilePythonCertProjectIds = challenges
  .filter(c => c.challengeType === challengeTypes.multifilePythonCertProject)
  .map(c => c.id);

export const msTrophyChallenges = challenges
  .filter(challenge => challenge.challengeType === challengeTypes.msTrophy)
  .map(({ id, msTrophyId }) => ({ id, msTrophyId }));

type SavedChallengeFile = {
  key: string;
  ext: string; // NOTE: This is Ext type in client
  name: string;
  history: string[];
  contents: string;
};

type SavedChallenge = {
  id: string;
  lastSavedDate: number;
  files: SavedChallengeFile[];
};

// TODO: Confirm this type - read comments below
type CompletedChallengeFile = {
  key: string;
  ext: string; // NOTE: This is Ext type in client
  name: string;
  contents: string;

  // These values are present in prop-types and ajax.ts builds with it
  // editableRegionBoundaries?: number[];
  // usesMultifileEditor?: boolean;
  // error: null | string | unknown;
  // head: string;
  // tail: string;
  // seed: string;
  // id: string;
  // history: string[];

  // This value is present in prisma schema
  path?: string | null;
};

// TODO: Should probably prefer `import{CompletedChallenge}from'@prisma/client'` instead of defining it here
export type CompletedChallenge = {
  id: string;
  solution?: string | null;
  githubLink?: string | null;
  challengeType?: number | null;
  completedDate: number;
  isManuallyApproved?: boolean | null;
  files?: CompletedChallengeFile[];
  examResults?: ExamResults | null;
};

/**
 * Helper function to save a user's challenge data. Used in challenge
 * submission endpoints.
 *
 * @param challengeId The id of the submitted challenge.
 * @param savedChallenges The user's saved challenges array.
 * @param challenge The saveble challenge.
 * @returns Update or push the saved challenges.
 */
export function saveUserChallengeData(
  challengeId: string,
  savedChallenges: SavedChallenge[],
  challenge: Omit<SavedChallenge, 'lastSavedDate'>
) {
  const challengeToSave: SavedChallenge = {
    id: challengeId,
    lastSavedDate: Date.now(),
    files: challenge.files?.map(file =>
      pick(file, ['contents', 'key', 'name', 'ext', 'history'])
    )
  };

  const savedIndex = savedChallenges.findIndex(({ id }) => challengeId === id);

  if (savedIndex >= 0) {
    savedChallenges[savedIndex] = challengeToSave;
  } else {
    savedChallenges.push(challengeToSave);
  }

  return savedChallenges;
}

/**
 * Retries function iff it fails due to a deadlock or write conflict.
 * @param fn The function that could fail.
 * @param options Retry policy.
 * @param options.attempts Maximum number of calls to fn (default 2).
 * @param options.delayMs Delay in ms before retrying, given the number of the
 * attempt that failed (default 1000).
 * @returns Promise returned by fn().
 */
export async function retryIfWriteConflict<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; delayMs?: (attempt: number) => number } = {}
): Promise<T> {
  const { attempts = 2, delayMs = () => 1000 } = options;

  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (
        attempt >= attempts ||
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2034'
      ) {
        throw error;
      }
      await setTimeout(delayMs(attempt));
    }
  }
}

const challengeDataSelect = {
  completedChallenges: true,
  savedChallenges: true,
  progressTimestamps: true,
  partiallyCompletedChallenges: true
} satisfies Prisma.userSelect;

/**
 * Helper function to update a user's challenge data. Used in challenge
 * submission endpoints.
 *
 * The user's challenge data is read and written in a single transaction, so
 * concurrent submissions (e.g. the same challenge submitted twice at once)
 * cannot overwrite or duplicate each other's changes. If another write to the
 * user lands first, the transaction is retried against the fresh record.
 *
 * TODO: Keep refactoring. This function does too much.
 * @param fastify The Fastify instance.
 * @param user The user submitting the challenge.
 * @param challengeId The id of the submitted challenge.
 * @param _completedChallenge The challenge submission.
 * @returns Information about the update, including the user's points after it.
 */
export async function updateUserChallengeData(
  fastify: FastifyInstance,
  user: Pick<user, 'id'> & Partial<Pick<user, 'needsModeration'>>,
  challengeId: string,
  _completedChallenge: CompletedChallenge
) {
  const { files, completedDate: newProgressTimeStamp = Date.now() } =
    _completedChallenge;
  const isSavable = savableChallenges.has(challengeId);

  const completedChallenge: CompletedChallenge = isSavable
    ? {
        ..._completedChallenge,
        files: files?.map(
          file =>
            pick(file, [
              'contents',
              'key',
              'index',
              'name',
              'path',
              'ext'
            ]) as CompletedChallengeFile
        ),
        completedDate: normalizeDate(_completedChallenge.completedDate)
      }
    : omit(_completedChallenge, ['files']);

  const challengeToSave: SavedChallenge | undefined = isSavable
    ? {
        id: challengeId,
        lastSavedDate: newProgressTimeStamp,
        files: files?.map(file =>
          pick(file, ['contents', 'key', 'name', 'ext', 'history'])
        ) as SavedChallengeFile[]
      }
    : undefined;

  const { needsModeration = false } = user;

  const updateUser = () =>
    fastify.prisma.$transaction(async tx => {
      const {
        completedChallenges = [],
        savedChallenges = [],
        progressTimestamps = [],
        partiallyCompletedChallenges = []
      } = await tx.user.findUniqueOrThrow({
        where: { id: user.id },
        select: challengeDataSelect
      });

      let savedChallengesUpdate: Prisma.userUpdateInput['savedChallenges'];

      const oldChallenge = completedChallenges.find(
        ({ id }) => challengeId === id
      );
      const alreadyCompleted = !!oldChallenge;

      const finalChallenge = alreadyCompleted
        ? {
            ...completedChallenge,
            completedDate: normalizeDate(oldChallenge.completedDate)
          }
        : completedChallenge;

      const userCompletedChallenges = alreadyCompleted
        ? completedChallenges.map(x =>
            x.id === challengeId
              ? finalChallenge
              : { ...x, completedDate: normalizeDate(x.completedDate) }
          )
        : { push: finalChallenge };

      // We can't use push, because progressTimestamps is a JSON blob and, until
      // we convert it to an array, push is not available. Since this could result
      // in the completedChallenges and progressTimestamps arrays being out of sync,
      // we should prioritize normalizing the data structure.
      const userProgressTimestamps =
        !alreadyCompleted && Array.isArray(progressTimestamps)
          ? [...progressTimestamps, newProgressTimeStamp]
          : progressTimestamps;

      if (challengeToSave) {
        const isSaved = savedChallenges.some(({ id }) => challengeId === id);

        savedChallengesUpdate = isSaved
          ? savedChallenges.map(x =>
              x.id === challengeId ? challengeToSave : x
            )
          : { push: challengeToSave };
      }

      const { savedChallenges: userSavedChallenges } = await tx.user.update({
        where: { id: user.id },
        data: {
          completedChallenges: userCompletedChallenges,
          // TODO: `needsModeration` should be handled closer to source, because it exists in 3 states: true, false, undefined/null
          //       `undefined` in Prisma is a no-op
          needsModeration: needsModeration || undefined,
          savedChallenges: savedChallengesUpdate,
          progressTimestamps: userProgressTimestamps,
          // remove from partiallyCompleted on submit
          partiallyCompletedChallenges: partiallyCompletedChallenges.filter(
            challenge => challenge.id !== challengeId
          )
        },
        select: {
          savedChallenges: true
        }
      });

      const points = getPoints(
        progressTimestamps as ProgressTimestamp[] | null
      );

      return {
        alreadyCompleted,
        completedDate: finalChallenge.completedDate,
        userSavedChallenges,
        points: alreadyCompleted ? points : points + 1
      };
    });

  return await retryIfWriteConflict(updateUser, {
    attempts: 5,
    // Jittered, so that requests which conflicted once are unlikely to
    // conflict again.
    delayMs: attempt => Math.random() * 20 * attempt
  });
}
