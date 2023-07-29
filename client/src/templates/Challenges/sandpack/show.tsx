import { graphql } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { HandlerProps } from 'react-reflex';
import { useMediaQuery } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import store from 'store';
import { editor } from 'monaco-editor';
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider
} from '@codesandbox/sandpack-react';
import { challengeTypes } from '../../../../../config/challenge-types';
import LearnLayout from '../../../components/layouts/learn';
import { MAX_MOBILE_WIDTH } from '../../../../../config/misc';

import {
  ChallengeFiles,
  ChallengeMeta,
  ChallengeNode,
  CompletedChallenge,
  ResizeProps,
  SavedChallengeFiles,
  Test
} from '../../../redux/prop-types';
import { isContained } from '../../../utils/is-contained';
import ChallengeDescription from '../components/challenge-description';
import Hotkeys from '../components/hotkeys';
import ResetModal from '../components/reset-modal';
import ChallengeTitle from '../components/challenge-title';
import CompletionModal from '../components/completion-modal';
import HelpModal from '../components/help-modal';
import ShortcutsModal from '../components/shortcuts-modal';
import Notes from '../components/notes';
import Output from '../components/output';
import Preview, { type PreviewProps } from '../components/preview';
import ProjectPreviewModal from '../components/project-preview-modal';
import SidePanel from '../components/side-panel';
import VideoModal from '../components/video-modal';
import {
  cancelTests,
  challengeMounted,
  createFiles,
  executeChallenge,
  initConsole,
  initTests,
  previewMounted,
  updateChallengeMeta,
  openModal,
  setEditorFocusability,
  setIsAdvancing
} from '../redux/actions';
import {
  challengeFilesSelector,
  consoleOutputSelector,
  isChallengeCompletedSelector
} from '../redux/selectors';
import { savedChallengesSelector } from '../../../redux/selectors';
import { getGuideUrl } from '../utils';

// import './classic.css';
import '../components/test-frame.css';

const mapStateToProps = createStructuredSelector({
  challengeFiles: challengeFilesSelector,
  output: consoleOutputSelector,
  isChallengeCompleted: isChallengeCompletedSelector,
  savedChallenges: savedChallengesSelector
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createFiles,
      initConsole,
      initTests,
      updateChallengeMeta,
      challengeMounted,
      executeChallenge,
      cancelTests,
      previewMounted,
      openModal,
      setEditorFocusability,
      setIsAdvancing
    },
    dispatch
  );

interface ShowSandpackProps extends Pick<PreviewProps, 'previewMounted'> {
  cancelTests: () => void;
  challengeMounted: (arg0: string) => void;
  createFiles: (arg0: ChallengeFiles | SavedChallengeFiles) => void;
  data: { challengeNode: ChallengeNode };
  executeChallenge: (options?: { showCompletionModal: boolean }) => void;
  challengeFiles: ChallengeFiles;
  initConsole: (arg0: string) => void;
  initTests: (tests: Test[]) => void;
  isChallengeCompleted: boolean;
  output: string[];
  pageContext: {
    challengeMeta: ChallengeMeta;
    projectPreview: {
      challengeData: CompletedChallenge;
      showProjectPreview: boolean;
    };
  };
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
  openModal: (modal: string) => void;
  setEditorFocusability: (canFocus: boolean) => void;
  setIsAdvancing: (arg: boolean) => void;
  savedChallenges: CompletedChallenge[];
}

// Used to prevent monaco from stealing mouse/touch events on the upper jaw
// content widget so they can trigger their default actions. (Issue #46166)
const handleContentWidgetEvents = (e: MouseEvent | TouchEvent): void => {
  const target = e.target as HTMLElement;
  if (target?.closest('.editor-upper-jaw')) {
    e.stopPropagation();
  }
};

const Editor = () => {
  const files = {
    '/App.js': `export default function App() {
  return <h1>Hello world</h1>
}`
  };

  return (
    <SandpackProvider files={files} theme='auto' template='react'>
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs showTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
};

function ShowSandpack({
  challengeFiles: reduxChallengeFiles,
  data: {
    challengeNode: {
      challenge: {
        challengeFiles,
        block,
        title,
        description,
        instructions,
        fields: { tests, blockName },
        challengeType,
        removeComments,
        hasEditableBoundaries,
        superBlock,
        helpCategory,
        forumTopicId,
        usesMultifileEditor,
        notes,
        videoUrl,
        translationPending
      }
    }
  },
  pageContext: {
    challengeMeta,
    challengeMeta: { isFirstStep, nextChallengePath, prevChallengePath },
    projectPreview: { challengeData, showProjectPreview }
  },
  createFiles,
  cancelTests,
  challengeMounted,
  initConsole,
  initTests,
  updateChallengeMeta,
  openModal,
  setIsAdvancing,
  savedChallenges,
  isChallengeCompleted,
  output,
  executeChallenge,
  previewMounted
}: ShowSandpackProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const instructionsPanelRef = useRef<HTMLDivElement>(null);

  const blockNameTitle = `${t(
    `intro:${superBlock}.blocks.${block}.title`
  )}: ${title}`;
  const windowTitle = `${blockNameTitle} | freeCodeCamp.org`;

  const setHtmlHeight = () => {
    const vh = String(window.innerHeight - 1);
    document.documentElement.style.height = vh + 'px';
  };

  useEffect(() => {
    initializeComponent(title);
    // Bug fix for the monaco content widget and touch devices/right mouse
    // click. (Issue #46166)
    document.addEventListener('mousedown', handleContentWidgetEvents, true);
    document.addEventListener('contextmenu', handleContentWidgetEvents, true);
    document.addEventListener('touchstart', handleContentWidgetEvents, true);
    document.addEventListener('touchmove', handleContentWidgetEvents, true);
    document.addEventListener('touchend', handleContentWidgetEvents, true);

    window.addEventListener('resize', setHtmlHeight);
    setHtmlHeight();

    return () => {
      createFiles([]);
      cancelTests();
      document.removeEventListener(
        'mousedown',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener(
        'contextmenu',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener(
        'touchstart',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener(
        'touchmove',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener('touchend', handleContentWidgetEvents, true);
      window.removeEventListener('resize', setHtmlHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeComponent(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests, title]);

  const initializeComponent = (title: string): void => {
    initConsole('');

    const savedChallenge = savedChallenges?.find(challenge => {
      return challenge.id === challengeMeta.id;
    });

    createFiles(savedChallenge?.challengeFiles || challengeFiles || []);

    initTests(tests);
    if (showProjectPreview) openModal('projectPreview');
    updateChallengeMeta({
      ...challengeMeta,
      title,
      removeComments: removeComments !== false,
      challengeType,
      helpCategory
    });
    challengeMounted(challengeMeta.id);
    setIsAdvancing(false);
  };

  return (
    <Hotkeys
      challengeType={challengeType}
      executeChallenge={executeChallenge}
      innerRef={containerRef}
      instructionsPanelRef={instructionsPanelRef}
      nextChallengePath={nextChallengePath}
      prevChallengePath={prevChallengePath}
      usesMultifileEditor={usesMultifileEditor}
      {...(editorRef && { editorRef: editorRef })}
    >
      <LearnLayout hasEditableBoundaries={hasEditableBoundaries}>
        <Helmet title={windowTitle} />
        <Editor />
        <CompletionModal />
        <HelpModal challengeTitle={title} challengeBlock={blockName} />
        <VideoModal videoUrl={videoUrl} />
        <ResetModal />
        <ProjectPreviewModal
          challengeData={challengeData}
          closeText={t('buttons.start-coding')}
          previewTitle={t('learn.project-preview-title')}
          showProjectPreview={showProjectPreview}
        />
        <ShortcutsModal />
      </LearnLayout>
    </Hotkeys>
  );
}

ShowSandpack.displayName = 'ShowSandpack';

export default connect(mapStateToProps, mapDispatchToProps)(ShowSandpack);

export const query = graphql`
  query SandpackChallenge($slug: String!) {
    challengeNode(challenge: { fields: { slug: { eq: $slug } } }) {
      challenge {
        block
        title
        description
        id
        hasEditableBoundaries
        instructions
        notes
        removeComments
        challengeType
        helpCategory
        videoUrl
        superBlock
        translationPending
        forumTopicId
        fields {
          blockName
          slug
          tests {
            text
            testString
          }
        }
        required {
          link
          src
        }
        usesMultifileEditor
        challengeFiles {
          fileKey
          ext
          name
          contents
          head
          tail
          editableRegionBoundaries
          history
        }
      }
    }
  }
`;
