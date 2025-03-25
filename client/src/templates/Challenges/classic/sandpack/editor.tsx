import React, { useEffect, useRef } from 'react';
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackFiles,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack
} from '@codesandbox/sandpack-react';
import { CodeMirrorRef } from '@codesandbox/sandpack-react/components/CodeEditor/CodeMirror';
import { EditorView, Decoration, DecorationSet } from '@codemirror/view';
import { StateField, StateEffect, Range } from '@codemirror/state';
import { ChallengeFiles } from '../../../../redux/prop-types';

interface SandpackEditorProps {
  challengeFiles: NonNullable<ChallengeFiles>;
}

const editableRegionDecoration = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(value, tr) {
    value = value.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setEditableRegionDecorations)) {
        value = e.value;
      }
    }
    return value;
  },
  provide(field) {
    return EditorView.decorations.from(field);
  }
});

const setEditableRegionDecorations = StateEffect.define<DecorationSet>();

export function SandpackEditor({ challengeFiles }: SandpackEditorProps) {
  const cmInstance = useRef<CodeMirrorRef>(null);
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;

  useEffect(() => {
    // Getting CodeMirror instance
    const instance = cmInstance.current?.getCodemirror();
    console.log(instance);

    if (!instance) return;

    // Based on `challengeFiles.editableRegionBoundaries`, add a blue border to
    // the top of the line[0] and the bottom of the line[1] in the editor
    const challengeFile = fileNameToChallengeFile(activeFile, challengeFiles);
    console.log(challengeFile.editableRegionBoundaries);
    if (!challengeFile.editableRegionBoundaries) return;
    const [top, bottom] = challengeFile.editableRegionBoundaries;

    const decorations: Range<Decoration>[] = [];

    const topLine = instance.state.doc.line(top + 1);
    const bottomLine = instance.state.doc.line(bottom - 1);

    decorations.push(
      Decoration.line({
        attributes: { class: 'editable-region-border-top' }
      }).range(topLine.from)
    );
    decorations.push(
      Decoration.line({
        attributes: { class: 'editable-region-border-bottom' }
      }).range(bottomLine.from)
    );

    instance.dispatch({
      effects: setEditableRegionDecorations.of(Decoration.set(decorations))
    });

    const style = document.createElement('style');
    style.innerHTML = `
      .editable-region-border-top {
        border-top: 2px solid blue;
      }
      .editable-region-border-bottom {
        border-bottom: 2px solid blue;
      }
    `;
    document.head.appendChild(style);

    return () => {
      instance.dispatch({
        effects: setEditableRegionDecorations.of(Decoration.none)
      });
      document.head.removeChild(style);
    };
  }, [activeFile, challengeFiles]);

  return (
    <>
      <SandpackFileExplorer />
      <SandpackCodeEditor
        ref={cmInstance}
        extensions={[editableRegionDecoration]}
      />
      <SandpackPreview />
    </>
  );
}

export function Sand({ challengeFiles }: SandpackEditorProps) {
  return (
    <SandpackProvider
      files={challengeFilesToFiles(challengeFiles)}
      theme='auto'
      template='static'
      options={{
        classes: {
          'sp-layout-height': '100%'
        }
      }}
    >
      <SandpackLayout style={{ height: '100%' }}>
        <SandpackEditor challengeFiles={challengeFiles} />
      </SandpackLayout>
    </SandpackProvider>
  );
}

export function challengeFilesToFiles(
  challengeFiles: NonNullable<ChallengeFiles>
): SandpackFiles {
  const files = challengeFiles.reduce((acc, file) => {
    return {
      ...acc,
      [`/${file.name}.${file.ext}`]: {
        code: file.contents
      }
    };
  }, {});

  files['/package.json'] = {
    code: JSON.stringify({
      dependencies: {},
      main: '/index.html'
    }),
    active: false,
    hidden: true
  };
  return files;
}

function fileNameToChallengeFile(
  fileName: string,
  challengeFiles: NonNullable<ChallengeFiles>
) {
  const file = challengeFiles.find(
    file => `/${file.name}.${file.ext}` === fileName
  );
  if (!file) {
    throw new Error(`File ${fileName} not found in challengeFiles`);
  }
  return file;
}
