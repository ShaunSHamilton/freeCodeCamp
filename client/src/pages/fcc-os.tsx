import React from 'react';
import { Helmet } from 'react-helmet';
import { FreeCodeCampOSFrame } from '../components/freecodecamp-os/freecodecamp-os-frame';

function fccOS(): JSX.Element {
  return (
    <>
      <Helmet title='freeCodeCamp-OS | freeCodeCamp.org' />
      <main>
        <FreeCodeCampOSFrame />
        <iframe
          className='openvscode-server-frame'
          data-cy='openvscode-server-frame'
          name={`openvscode-server${Date.now()}`}
          sandbox='allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-to-custom-protocols'
          src={`http://localhost:8081`}
          title='Editor'
        />
      </main>
    </>
  );
}

fccOS.displayName = 'fccOS';

export default fccOS;
