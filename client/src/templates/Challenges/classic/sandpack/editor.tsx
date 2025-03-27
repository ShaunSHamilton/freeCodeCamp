import React, { useEffect, useRef } from 'react';
import {
  SandpackCodeEditor,
  // SandpackFileExplorer,
  SandpackFiles,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack
} from '@codesandbox/sandpack-react';
import { CodeMirrorRef } from '@codesandbox/sandpack-react/components/CodeEditor/CodeMirror';
import { EditorView, Decoration, DecorationSet } from '@codemirror/view';
import { StateField, StateEffect, Range } from '@codemirror/state';
import { connect } from 'react-redux';
import { ChallengeFiles } from '../../../../redux/prop-types';
import { updateFile } from '../../redux/actions';

import './style.css';

type SandpackEditorProps = {
  challengeFiles: NonNullable<ChallengeFiles>;
} & typeof mapDispatchToProps;

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

const mapDispatchToProps = {
  updateFile
};

function SandpackEditor({ challengeFiles, updateFile }: SandpackEditorProps) {
  const cmInstance = useRef<CodeMirrorRef>(null);
  const { sandpack } = useSandpack();
  const { activeFile, files } = sandpack;

  function addEditableRegionDecorations() {
    const challengeFile = fileNameToChallengeFile(activeFile, challengeFiles);
    if (!challengeFile.editableRegionBoundaries) return;

    // Getting CodeMirror instance
    const instance = cmInstance.current?.getCodemirror();

    if (!instance) return;

    // Based on `challengeFiles.editableRegionBoundaries`, add a blue border to
    // the top of the line[0] and the bottom of the line[1] in the editor
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
  }

  useEffect(addEditableRegionDecorations, [activeFile, challengeFiles]);

  useEffect(() => {
    const challengeFile = fileNameToChallengeFile(activeFile, challengeFiles);
    const fileKey = activeFileToFileKey(activeFile);
    // TODO: Update editable regions on change.
    const editableRegionBoundaries = challengeFile?.editableRegionBoundaries;
    updateFile({
      fileKey,
      editableRegionBoundaries,
      editorValue: files[activeFile].code
    });
    // TODO: Figure out how to update file without causing infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files[activeFile].code, updateFile]);

  return (
    <>
      {/* <SandpackFileExplorer /> */}
      <SandpackCodeEditor
        ref={cmInstance}
        extensions={[editableRegionDecoration]}
        showTabs={true}
        closableTabs={false}
      />
      <SandpackPreview />
    </>
  );
}

export function Sand({ challengeFiles, updateFile }: SandpackEditorProps) {
  return (
    <SandpackProvider
      files={challengeFilesToFiles(challengeFiles)}
      theme='auto'
      template='static'
    >
      <SandpackLayout>
        <SandpackEditor {...{ challengeFiles, updateFile }} />
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
        code: file.contents,
        active: !!file.editableRegionBoundaries?.length
      }
    };
  }, {} as SandpackFiles);

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

function activeFileToFileKey(activeFile: string): string {
  const fileKey = activeFile.split('/').at(-1)?.replace('.', '');
  if (!fileKey) {
    throw new Error(`File ${activeFile} not valid fileKey format`);
  }
  return fileKey;
}

export const SandEditor = connect(undefined, mapDispatchToProps)(Sand);
