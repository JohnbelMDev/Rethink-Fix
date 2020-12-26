import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';

// Used below, these need to be registered
import MarkdownEditor from '../MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';
import Search from '../components/search';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile }) {
  console.log('This is the active file',files);


  return (
    <div className={css.files}>
    <Search />
    <table>
    <thead>
    <tr>
    <th>File</th>
    <th>Modified</th>
    </tr>
    </thead>
    <tbody>
    {files.map(file => (
      <tr
      key={file.name}
      className={classNames(
        css.row,
        activeFile && activeFile.name === file.name ? css.active : ''
      )}
      onClick={() => setActiveFile(file)}
      >
      <td className={css.file}>
      <div
      className={css.icon}
      dangerouslySetInnerHTML={{
        __html: TYPE_TO_ICON[file.type]
      }}
      ></div>
      {path.basename(file.name)}
      </td>

      <td>
      {new Date(file.lastModified).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
      </td>
      </tr>
    ))}
    </tbody>
    </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
    <div className={css.title}>{path.basename(file.name)}</div>
    <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  "text/plain": PlaintextEditor,
  "text/markdown": MarkdownEditor,
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    const files = listFiles();

    async function tryLocalFile(f){

      const name = f.name
      console.log('This is the name of the active file',name);
      const localsaveString = await localStorage.getItem(name)
      console.log('This is localsave',localsaveString);
      if(localsaveString){
        const localsave = JSON.parse(localsaveString)
        console.log('This is the localsave object', localsave);
        const file = new File(
          [ localsave.text ],
          localsave.name,
          {
            type:localsave.type,
            lastModified:localsave.lastModified,
          },
        )
        console.log('hello', file);
        // return file from localStorage
        return file
      }

      // return file from the file.js
      return f
    }
    async function fileCheck(){
      const newFiles = []
      for (var i = 0; i < files.length; i++) {
        const checkFile = await tryLocalFile(files[i])
        newFiles.push(checkFile)

      }
      setFiles(newFiles)
    }
    fileCheck()
  }, []);

  async function fileToObject(file){
    return {
      name:file.name,
      type:file.type,
      lastModified: file.lastModified,
      text:await file.text()
    }
  }
  const write = async (newFile)=> {

    const fileObject = await fileToObject(newFile)

    console.log('Writing file object... ', newFile.name,'file is',fileObject);
    localStorage.setItem(newFile.name, JSON.stringify(fileObject));

    const replaceFiles = []
    for (var i = 0; i < files.length; i++) {
      if(newFile.name === files[i].name){
        replaceFiles.push(newFile)
      }
      else {
        replaceFiles.push(files[i])
      }


    }
    setFiles(replaceFiles);

    // TODO: Write the file to the `files` array
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
    <Head>
    <title>Rethink Engineering Challenge</title>
    </Head>
    <aside>
    <header>
    <div className={css.tagline}>Rethink Engineering Challenge</div>
    <h1>Fun With Plaintext</h1>
    <div className={css.description}>
    Let{"'"}s explore files in JavaScript. What could be more fun than
    rendering and editing plaintext? Not much, as it turns out.
    </div>
    </header>

    <FilesTable
    files={files}
    activeFile={activeFile}
    setActiveFile={setActiveFile}
    />

    <div style={{ flex: 1 }}></div>

    <footer>
    <div className={css.link}>
    <a href="https://v3.rethink.software/jobs">Rethink Software</a>
    &nbsp;—&nbsp;Frontend Engineering Challenge
    </div>

    <div className={css.link}>
    Questions? Feedback? Email us at jobs@rethink.software
    </div>
    </footer>
    </aside>

    <main className={css.editorWindow}>


    {/* if the acitive is already in storage then use it  otherwise the active file in localstorage */}
    {activeFile && (
      <>
      {Editor && <Editor file={activeFile} write={write} />}
      {!Editor && <Previewer file={activeFile} />}
      </>
    )}

    {!activeFile && (
      <div className={css.empty}>Select a file to view or edit</div>
    )}
    </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
