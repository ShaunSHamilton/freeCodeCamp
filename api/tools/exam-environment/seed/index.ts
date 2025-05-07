import { PrismaClient } from '@prisma/client';
import * as mocks from '../../../__mocks__/env-exam';
import { MONGOHQ_URL } from '../../../src/utils/env';

const ARGS = process.argv.slice(2);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: MONGOHQ_URL
    }
  }
});

async function main() {
  await prisma.$connect();

  await prisma.envExamAttempt.deleteMany({});
  await prisma.envGeneratedExam.deleteMany({});
  await prisma.envExam.deleteMany({});

  await prisma.envExam.create({ data: mocks.exam });
  await prisma.envGeneratedExam.create({ data: mocks.generatedExam });

  if (ARGS.includes('--attempt')) {
    await prisma.envExamAttempt.create({ data: mocks.examAttempt });
  }
}

void main();
