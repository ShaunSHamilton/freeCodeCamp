import { createSelector } from 'reselect';

// TODO: source the superblock structure via a GQL query, rather than directly
// from the curriculum
import superBlockStructure from '../../../curriculum/structure/superblocks/full-stack-developer.json';
import { randomBetween } from '../utils/random-between';
import { getSessionChallengeData } from '../utils/session-storage';
import { ns as MainApp } from './action-types';

export const savedChallengesSelector = state =>
  userSelector(state)?.savedChallenges || [];
export const completedChallengesSelector = state =>
  userSelector(state)?.completedChallenges || [];
export const completedDailyCodingChallengesSelector = state =>
  userSelector(state)?.completedDailyCodingChallenges || [];
export const userIdSelector = state => userSelector(state)?.id;
export const partiallyCompletedChallengesSelector = state =>
  userSelector(state)?.partiallyCompletedChallenges || [];
export const currentChallengeIdSelector = state =>
  state[MainApp].currentChallengeId;
export const isRandomCompletionThresholdSelector = state =>
  state[MainApp].isRandomCompletionThreshold;
export const isDonatingSelector = state => userSelector(state)?.isDonating;
export const isOnlineSelector = state => state[MainApp].isOnline;
export const isServerOnlineSelector = state => state[MainApp].isServerOnline;
export const isSignedInSelector = state => !!userSelector(state);
export const isDonationModalOpenSelector = state =>
  state[MainApp].showDonationModal;
export const isSignoutModalOpenSelector = state =>
  state[MainApp].showSignoutModal;
export const donatableSectionRecentlyCompletedSelector = state => {
  const donatableSectionRecentlyCompletedState =
    state[MainApp].donatableSectionRecentlyCompleted;

  if (donatableSectionRecentlyCompletedState) {
    const { block, module, superBlock } =
      donatableSectionRecentlyCompletedState;

    if (superBlock !== 'daily-coding-challenge') {
      if (module) return { section: 'module', title: module, superBlock };
      else if (block) return { section: 'block', title: block, superBlock };
    }
  }

  return null;
};

export const donationFormStateSelector = state =>
  state[MainApp].donationFormState;
export const updateCardStateSelector = state => state[MainApp].updateCardState;
export const signInLoadingSelector = state =>
  userFetchStateSelector(state).pending;
export const showCertSelector = state => state[MainApp].showCert;
export const showCertFetchStateSelector = state =>
  state[MainApp].showCertFetchState;
export const shouldRequestDonationSelector = state => {
  const completedChallengeCount = completedChallengesSelector(state).length;
  const isDonating = isDonatingSelector(state);
  const donatableSectionRecentlyCompleted =
    donatableSectionRecentlyCompletedSelector(state);
  const isRandomCompletionThreshold =
    isRandomCompletionThresholdSelector(state);

  // don't request donation if already donating
  if (isDonating) return false;

  // donations only appear after the user has completed ten challenges (i.e.
  // not before the 11th challenge has mounted)
  if (completedChallengeCount < 10) return false;

  // a block or module has been completed
  if (donatableSectionRecentlyCompleted) return true;

  const sessionChallengeData = getSessionChallengeData();
  /*
    Different intervals need to be tested for optimization.
   */
  // the assumption is that we save the count when we request donations
  if (sessionChallengeData.isSaved) {
    // only request if sufficient challenges have been completed since last
    // request
    return sessionChallengeData.countSinceSave >= 20;
  }

  /*
   Show modal if user has completed 10 challanged in total
   and 3 or more in this session.
   The isRandomCompletionThreshold flag is used to AB test interval randomness
  */
  if (isRandomCompletionThreshold) {
    return sessionChallengeData.currentCount >= randomBetween(3, 7);
  } else {
    return sessionChallengeData.currentCount >= 3;
  }
};

export const userTokenSelector = state => userSelector(state)?.userToken;

export const examInProgressSelector = state => state[MainApp].examInProgress;

export const examResultsSelector = state => userSelector(state)?.examResults;

export const msUsernameSelector = state => userSelector(state)?.msUsername;

export const completedSurveysSelector = state =>
  userSelector(state)?.completedSurveys || [];

export const isProcessingSelector = state => {
  return state[MainApp].isProcessing;
};

export const createUserByNameSelector = username => state => {
  const sessionUser = userSelector(state);
  const otherUser = otherUserSelector(state);
  const isSessionUser = sessionUser?.username === username;
  const isOtherUser = otherUser?.username === username;
  const user = isSessionUser ? sessionUser : isOtherUser ? otherUser : null;
  return user;
};

export const userFetchStateSelector = state => state[MainApp].userFetchState;
export const allChallengesInfoSelector = state =>
  state[MainApp].allChallengesInfo;

export const completedChallengesIdsSelector = createSelector(
  completedChallengesSelector,
  completedChallenges => completedChallenges.map(node => node.id)
);

export const completedDailyCodingChallengesIdsSelector = createSelector(
  completedDailyCodingChallengesSelector,
  completedChallenges => completedChallenges.map(node => node.id)
);

export const completionStateSelector = createSelector(
  [allChallengesInfoSelector, completedChallengesIdsSelector],
  (allChallengesInfo, completedChallengesIds) => {
    const chapters = superBlockStructure.chapters;
    const { challengeNodes } = allChallengesInfo;

    const getCompletionState = ({
      chapters,
      challenges,
      completedChallengesIds
    }) => {
      const populateBlocks = blocks =>
        blocks.map(block => {
          const blockChallenges = challenges.filter(
            ({ block: blockName }) => blockName === block
          );

          const completedBlockChallenges = blockChallenges.every(({ id }) =>
            completedChallengesIds.includes(id)
          );

          return {
            name: block,
            isCompleted:
              completedBlockChallenges.length === blockChallenges.length
          };
        });

      const populateModules = modules =>
        modules.map(module => {
          const blocks = populateBlocks(module.blocks);
          const isCompleted = blocks.every(block => block.isCompleted === true);

          return {
            name: module.dashedName,
            blocks,
            isCompleted
          };
        });

      const allChapters = chapters.map(chapter => {
        const modules = populateModules(chapter.modules);
        const isCompleted = modules.every(
          module => module.isCompleted === true
        );

        return {
          name: chapter.dashedName,
          modules: populateModules(chapter.modules),
          isCompleted
        };
      });

      return allChapters;
    };

    return getCompletionState({
      chapters,
      challenges: challengeNodes.map(({ challenge }) => challenge),
      completedChallengesIds
    });
  }
);
export const userProfileFetchStateSelector = state =>
  state[MainApp].userProfileFetchState;
export const usernameSelector = state => userSelector(state)?.username ?? '';
export const themeSelector = state => state[MainApp].theme;
export const userThemeSelector = state => userSelector(state)?.theme;

export const userSelector = state => state[MainApp].user.sessionUser;
export const otherUserSelector = state => state[MainApp].user.otherUser;

export const renderStartTimeSelector = state => state[MainApp].renderStartTime;

export const claimableCertsSelector = createSelector(
  [userSelector],
  user => {
    if (!user) return [];
    if (!user.name || !user.isHonest) return [];

    const {
      completedChallenges = [],
      isRespWebDesignCert = false,
      isJsAlgoDataStructCert = false,
      isJsAlgoDataStructCertV8 = false,
      isFrontEndLibsCert = false,
      is2018DataVisCert = false,
      isApisMicroservicesCert = false,
      isInfosecQaCert = false,
      isQaCertV7 = false,
      isInfosecCertV7 = false,
      isFrontEndCert = false,
      isBackEndCert = false,
      isDataVisCert = false,
      isFullStackCert = false,
      isSciCompPyCertV7 = false,
      isDataAnalysisPyCertV7 = false,
      isMachineLearningPyCertV7 = false,
      isRelationalDatabaseCertV8 = false,
      isCollegeAlgebraPyCertV8 = false,
      isFoundationalCSharpCertV8 = false
    } = user;

    const completedChallengeIds = completedChallenges.map(({ id }) => id);

    const claimable = [];

    const certChecks = [
      {
        claimed: isRespWebDesignCert,
        name: 'Responsive Web Design',
        slug: 'responsive-web-design',
        projects: [
          '587d78af367417b2b2512b03',
          'bd7158d8c442eddfaeb5bd18',
          '587d78b0367417b2b2512b05',
          '587d78af367417b2b2512b04',
          'bd7158d8c242eddfaeb5bd13'
        ]
      },
      {
        claimed: isJsAlgoDataStructCertV8,
        name: 'JavaScript Algorithms and Data Structures',
        slug: 'javascript-algorithms-and-data-structures-v8',
        projects: [
          '657bdc55a322aae1eac3838f',
          '657bdc8ba322aae1eac38390',
          '657bdcb9a322aae1eac38391',
          '657bdcc3a322aae1eac38392',
          '6555c1d3e11a1574434cf8b5'
        ]
      },
      {
        claimed: isFrontEndLibsCert,
        name: 'Front End Development Libraries',
        slug: 'front-end-development-libraries',
        projects: [
          'bd7158d8c442eddfaeb5bd13',
          'bd7157d8c242eddfaeb5bd13',
          '587d7dbc367417b2b2512bae',
          'bd7158d8c442eddfaeb5bd17',
          'bd7158d8c442eddfaeb5bd0f'
        ]
      },
      {
        claimed: is2018DataVisCert,
        name: 'Data Visualization',
        slug: 'data-visualization',
        projects: [
          'bd7168d8c242eddfaeb5bd13',
          'bd7178d8c242eddfaeb5bd13',
          'bd7188d8c242eddfaeb5bd13',
          '587d7fa6367417b2b2512bbf',
          '587d7fa6367417b2b2512bc0'
        ]
      },
      {
        claimed: isRelationalDatabaseCertV8,
        name: 'Relational Database',
        slug: 'relational-database-v8',
        projects: [
          '5f1a4ef5d5d6b5ab580fc6ae',
          '5f9771307d4d22b9d2b75a94',
          '5f87ac112ae598023a42df1a',
          '602d9ff222201c65d2a019f2',
          '602da04c22201c65d2a019f4'
        ]
      },
      {
        claimed: isApisMicroservicesCert,
        name: 'Back End Development and APIs',
        slug: 'back-end-development-and-apis',
        projects: [
          'bd7158d8c443edefaeb5bdef',
          'bd7158d8c443edefaeb5bdff',
          'bd7158d8c443edefaeb5bd0e',
          '5a8b073d06fa14fcfde687aa',
          'bd7158d8c443edefaeb5bd0f'
        ]
      },
      {
        claimed: isQaCertV7,
        name: 'Quality Assurance',
        slug: 'quality-assurance-v7',
        projects: [
          '587d8249367417b2b2512c41',
          '587d8249367417b2b2512c42',
          '587d824a367417b2b2512c43',
          '5e601bf95ac9d0ecd8b94afd',
          '5e601c0d5ac9d0ecd8b94afe'
        ]
      },
      {
        claimed: isSciCompPyCertV7,
        name: 'Scientific Computing with Python',
        slug: 'scientific-computing-with-python-v7',
        projects: [
          '5e44412c903586ffb414c94c',
          '5e444136903586ffb414c94d',
          '5e44413e903586ffb414c94e',
          '5e444147903586ffb414c94f',
          '5e44414f903586ffb414c950'
        ]
      },
      {
        claimed: isDataAnalysisPyCertV7,
        name: 'Data Analysis with Python',
        slug: 'data-analysis-with-python-v7',
        projects: [
          '5e46f7e5ac417301a38fb928',
          '5e46f7e5ac417301a38fb929',
          '5e46f7f8ac417301a38fb92a',
          '5e46f802ac417301a38fb92b',
          '5e4f5c4b570f7e3a4949899f'
        ]
      },
      {
        claimed: isInfosecCertV7,
        name: 'Information Security',
        slug: 'information-security-v7',
        projects: [
          '587d824a367417b2b2512c44',
          '587d824a367417b2b2512c45',
          '5e46f979ac417301a38fb932',
          '5e46f983ac417301a38fb933',
          '5e601c775ac9d0ecd8b94aff'
        ]
      },
      {
        claimed: isMachineLearningPyCertV7,
        name: 'Machine Learning with Python',
        slug: 'machine-learning-with-python-v7',
        projects: [
          '5e46f8d6ac417301a38fb92d',
          '5e46f8dcac417301a38fb92e',
          '5e46f8e3ac417301a38fb92f',
          '5e46f8edac417301a38fb930',
          '5e46f8edac417301a38fb931'
        ]
      },
      {
        claimed: isCollegeAlgebraPyCertV8,
        name: 'College Algebra with Python',
        slug: 'college-algebra-with-python-v8',
        projects: [
          '63d83ff239c73468b059cd3f',
          '63d83ffd39c73468b059cd40',
          '63d8401039c73468b059cd41',
          '63d8401e39c73468b059cd42',
          '63d8402e39c73468b059cd43'
        ]
      },
      {
        claimed: isFoundationalCSharpCertV8,
        name: 'Foundational C# with Microsoft',
        slug: 'foundational-c-sharp-with-microsoft',
        projects: [
          '647e3159823e0ef219c7359b',
          '647e22d18acb466c97ccbef8'
        ]
      },
      {
        claimed: isJsAlgoDataStructCert,
        name: 'Legacy JavaScript Algorithms and Data Structures',
        slug: 'javascript-algorithms-and-data-structures',
        projects: [
          'aaa48de84e1ecc7c742e1124',
          'a7f4d8f2483413a6ce226cac',
          '56533eb9ac21ba0edf2244e2',
          'aff0395860f5d3034dc0bfc9',
          'aa2e6f85cab2ab736c9a9b24'
        ]
      },
      {
        claimed: isFrontEndCert,
        name: 'Legacy Front End',
        slug: 'legacy-front-end',
        projects: [
          'bd7157d8c242eddfaeb5bd13',
          'bd7158d8c442eddfaeb5bd13',
          'bd7188d8c242eddfaeb5bd13',
          'bd7178d8c242eddfaeb5bd13',
          'bd7198d8c242eddfaeb5bd13',
          'bd7158d8c242eddfaeb5bd13',
          'bd7158d8c442eddfaeb5bd18',
          '587d78b0367417b2b2512b05',
          '587d78af367417b2b2512b04',
          'bd7158d8c242eddfaeb5bd13'
        ]
      },
      {
        claimed: isBackEndCert,
        name: 'Legacy Back End',
        slug: 'legacy-back-end',
        projects: [
          'bd7158d8c443edefaeb5bdef',
          'bd7158d8c443edefaeb5bdff',
          'bd7158d8c443edefaeb5bd0e',
          'bd7158d8c443edefaeb5bd0f',
          '589fc831f9fc3f718c588e2e',
          'bd7158d8c443eddfaeb5bdef',
          'bd7158d8c443eddfaeb5bdff',
          'bd7158d8c443eddfaeb5bd0e'
        ]
      },
      {
        claimed: isDataVisCert,
        name: 'Legacy Data Visualization',
        slug: 'legacy-data-visualization',
        projects: [
          'bd7168d8c242eddfaeb5bd13',
          '587d7fa6367417b2b2512bbf',
          '587d7fa6367417b2b2512bc0',
          '587d7fa6367417b2b2512bc1',
          'bd7168d8c242eddfaeb5bd19',
          'bd7157d8c242eddfaeb5bd13',
          'bd7158d8c442eddfaeb5bd13',
          'bd7188d8c242eddfaeb5bd13',
          'bd7178d8c242eddfaeb5bd13',
          'bd7198d8c242eddfaeb5bd13'
        ]
      },
      {
        claimed: isInfosecQaCert,
        name: 'Legacy Information Security and Quality Assurance',
        slug: 'information-security-and-quality-assurance',
        projects: [
          '587d824a367417b2b2512c43',
          '587d824a367417b2b2512c44',
          '587d824a367417b2b2512c45',
          '587d824a367417b2b2512c46',
          '587d824a367417b2b2512c47',
          '587d824a367417b2b2512c48',
          '587d824a367417b2b2512c49',
          '587d824a367417b2b2512c4a',
          '587d824a367417b2b2512c4b',
          '587d824a367417b2b2512c4c'
        ]
      }
    ];

    for (const cert of certChecks) {
      if (cert.claimed) continue;

      const allProjectsComplete = cert.projects.every(projectId =>
        completedChallengeIds.includes(projectId)
      );

      if (allProjectsComplete) {
        claimable.push({
          name: cert.name,
          slug: cert.slug
        });
      }
    }

    if (
      !isFullStackCert &&
      isRespWebDesignCert &&
      isJsAlgoDataStructCert &&
      isFrontEndLibsCert &&
      is2018DataVisCert &&
      isApisMicroservicesCert &&
      isInfosecQaCert
    ) {
      claimable.push({
        name: 'Legacy Full Stack',
        slug: 'full-stack'
      });
    }

    return claimable;
  }
);
