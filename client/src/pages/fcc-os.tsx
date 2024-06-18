import React from 'react';
import { Helmet } from 'react-helmet';

function fccOS(): JSX.Element {
  return (
    <>
      <Helmet title='freeCodeCamp-OS | freeCodeCamp.org' />
      <main>
        <iframe
          className='freecodecamp-os-frame'
          data-cy='freecodecamp-os-frame'
          name={`freecodecamp-os${Date.now()}`}
          sandbox='allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-to-custom-protocols'
          src={`http://localhost:8080`}
          title='Editor'
        />
      </main>
    </>
  );
}

fccOS.displayName = 'fccOS';

export default fccOS;
