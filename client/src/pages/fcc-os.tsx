import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FreeCodeCampOSFrame } from '../components/freecodecamp-os/freecodecamp-os-frame';
import { Events } from '../components/freecodecamp-os/types';

let socket = new WebSocket('ws://localhost:7001/ws');

function sock(type: Events, data: unknown = {}) {
  // @ts-expect-error TODO
  socket.send(parse({ event: type, data }));
}
function parse(objOrString: unknown) {
  if (typeof objOrString === 'string') {
    return JSON.parse(objOrString);
  } else {
    return JSON.stringify(objOrString);
  }
}

function FCCOS(): JSX.Element {
  const [runningContainer, setRunningContainer] = useState(false);
  // Check with app, whether existing container is running.
  // If yes, show frame, else show project list

  function connectToWebSocket() {
    socket.onopen = function (_event) {
      sock(Events.CONNECT);
    };
    socket.onmessage = function (event) {
      // @ts-expect-error TODO
      const parsedData: { event: keyof typeof handle; data: unknown } = parse(
        event.data
      );
      console.log(parsedData);
      // @ts-expect-error TODO
      handle[parsedData.event]?.(parsedData.data);
    };
    socket.onclose = function (_event) {
      // Try to reconnect
      setTimeout(() => {
        socket = new WebSocket(`ws://localhost:7001/ws`);
        connectToWebSocket();
      }, 1000);
    };

    return () => {
      console.log('socket closing');
      socket.close();
    };
  }

  const handle = {
    [Events.CONTAINER_STATUS]: (data: boolean) => {
      setRunningContainer(data);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(connectToWebSocket, []);

  useEffect(() => {
    // Check if container is running
    // If yes, setRunningContainer to true
    void (() => {
      const interval = setInterval(() => {
        sock(Events.CONTAINER_STATUS);
        if (runningContainer) {
          clearInterval(interval);
        }
      }, 1000);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet title='freeCodeCamp-OS | freeCodeCamp.org' />
      <main>
        {runningContainer ? (
          <>
            <FreeCodeCampOSFrame />
            <iframe
              className='openvscode-server-frame'
              data-cy='openvscode-server-frame'
              name={`openvscode-server${Date.now()}`}
              sandbox='allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-to-custom-protocols'
              src={`http://localhost:7003`}
              title='Editor'
            />
          </>
        ) : (
          <ProjectBoard />
        )}
      </main>
    </>
  );
}

FCCOS.displayName = 'FCCOS';

export default FCCOS;

function ProjectBoard() {
  const projects = [
    { title: 'Project 1', description: 'This is project 1' },
    { title: 'Project 2', description: 'This is project 2' }
  ];

  async function handleProjectSelection(
    _e: React.MouseEvent<HTMLButtonElement>
  ) {}

  return (
    <div className='project-board'>
      <h1>Projects</h1>
      <div className='project-list'>
        {projects.map((p, i) => {
          return (
            <button
              onMouseDown={e => void handleProjectSelection(e)}
              key={i}
              className='project-link'
            >
              <h2>{p.title}</h2>
              <p>{p.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
