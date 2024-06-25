/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense, useState, useEffect } from 'react';
import {
  ConsoleError,
  Events,
  FreeCodeCampConfigI,
  LoaderT,
  ProjectI,
  TestType
} from './types/index';
import { Loader } from './components/loader';
import { Project } from './templates/project';
import { parse } from './utils/index';
import { E44o5 } from './components/error';
import './index.css';

// Dynamically construct the socket url based on `window.location`
let socket = new WebSocket(`ws://localhost:7002/ws`);

export const FreeCodeCampOSFrame = () => {
  const [project, setProject] = useState<ProjectI | null>(null);

  const [lessonNumber, setLessonNumber] = useState(1);
  const [description, setDescription] = useState('');
  const [tests, setTests] = useState<TestType[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [cons, setCons] = useState<ConsoleError[]>([]);
  const [loader, setLoader] = useState({
    isLoading: false,
    progress: { count: 0, total: 1 }
  });
  const [alertCamper, setAlertCamper] = useState<null | string>(null);
  const [error, setError] = useState<Error | null>(null);

  const [debouncers, setDebouncers] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  function connectToWebSocket() {
    socket.onopen = function (_event) {
      setConnected(true);
      setAlertCamper(null);
      sock(Events.CONNECT);
    };
    socket.onmessage = function (event) {
      // @ts-expect-error TODO
      const parsedData: { event: keyof typeof handle; data: unknown } = parse(
        event.data
      );
      // @ts-expect-error TODO
      handle[parsedData.event]?.(parsedData.data);
    };
    socket.onclose = function (_event) {
      setAlertCamper('Client has disconnected from local server');
      setConnected(false);
      // Try to reconnect
      setTimeout(() => {
        socket = new WebSocket(
          `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
            window.location.host
          }/ws`
        );
        connectToWebSocket();
      }, 1000);
    };

    return () => {
      console.log('socket closing');
      socket.close();
    };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(connectToWebSocket, []);

  const handle = {
    'handle-project-finish': handleProjectFinish,
    'update-loader': updateLoader,
    'update-test': updateTest,
    'update-tests': updateTests,
    'update-hints': updateHints,
    'update-console': updateConsole,
    'update-description': updateDescription,
    'update-project-heading': updateProjectHeading,
    'update-project': setProject,
    'update-error': updateError,
    'reset-tests': resetTests,
    RESPONSE: debounce
  };

  function handleProjectFinish() {
    // Send Camper to landing page
    updateProject(null);
  }

  useEffect(() => {
    if (connected) {
      sock(Events.REQUEST_DATA, 'projects');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  function debounce({ event }: { event: string }) {
    const debouncerRemoved = debouncers.filter(d => d !== event);
    setDebouncers(() => debouncerRemoved);
  }

  function sock(type: Events, data: unknown = {}) {
    if (debouncers.includes(type)) {
      return;
    }
    const newDebouncers = [...debouncers, type];
    setDebouncers(() => newDebouncers);
    // @ts-expect-error TODO
    socket.send(parse({ event: type, data }));
  }

  function updateProject(project: ProjectI | null) {
    sock(Events.SELECT_PROJECT, project?.id);
    resetState();
    setProject(project);
  }

  function updateProjectHeading({ lessonNumber }: { lessonNumber: number }) {
    setLessonNumber(lessonNumber);
  }

  function updateDescription({ description }: { description: string }) {
    setDescription(description);
  }

  function updateTests({ tests }: { tests: TestType[] }) {
    setTests(tests);
  }
  function updateTest({ test }: { test: TestType }) {
    setTests(ts => ts.map(t => (t.testId === test.testId ? test : t)));
  }
  function updateHints({ hints }: { hints: string[] }) {
    setHints(hints);
  }

  function updateConsole({ cons }: { cons: ConsoleError }) {
    if (!Object.keys(cons).length) {
      return setCons([]);
    }
    // Insert cons in array at index `id`
    setCons(prev => {
      const sorted = [
        ...prev.slice(0, cons.testId),
        cons,
        ...prev.slice(cons.testId)
      ].filter(Boolean);
      return sorted;
    });
  }

  function updateError({ error }: { error: Error }) {
    setError(error);
  }

  function updateLoader({ loader }: { loader: LoaderT }) {
    setLoader(loader);
  }

  function resetTests() {
    setTests([]);
  }

  function resetState() {
    setTests([]);
    setHints([]);
    setCons([]);
  }

  // function toggleLoaderAnimation({ loader }: { loader: LoaderT }) {
  //   setLoader(loader);
  // }

  function runTests() {
    setCons([]);
    sock(Events.RUN_TESTS);
  }
  function resetProject() {
    sock(Events.RESET_PROJECT);
  }
  function goToNextLesson() {
    sock(Events.GO_TO_NEXT_LESSON);
  }
  function goToPreviousLesson() {
    sock(Events.GO_TO_PREVIOUS_LESSON);
  }

  function cancelTests() {
    sock(Events.CANCEL_TESTS);
  }

  if (alertCamper) {
    return (
      <>
        <E44o5 text={alertCamper} error={error} />
      </>
    );
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {/* @ts-expect-error TODO */}
        <Project
          {...{
            cancelTests,
            cons,
            description,
            goToNextLesson,
            goToPreviousLesson,
            hints,
            loader,
            lessonNumber,
            project,
            resetProject,
            runTests,
            tests
          }}
        />
      </Suspense>
    </>
  );
};
