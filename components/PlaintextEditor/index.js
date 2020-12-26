import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import css from './style.css';

function PlaintextEditor({ file, write }) {
  const [input, setInput] = useState('')
  // const [writeinput, setwrite] = useState('')


  useEffect(() => {
    (async () => {
      // using set input to pass in the file
      setInput(await file.text());
    })();
  }, [file]);

  // useEffect(() => {
  //   (async () => {
  //     // using set input to pass in the file
  //     setwrite(await write);
  //   })();
  // }, [file]);


  function handleSave(e) {
      e.preventDefault();
      console.log('content of the text area',input);
      const newFile = new File(
        [
          input,
        ],
         file.name,
        {
          type: file.type,
          lastModified: new Date()
        }
      );
      write(newFile)
      console.log();
      console.log(newFile.text());
      console.log('save button was clicked');
    }


  // console.log(file, write);
  return (
    <div className={css.editor}>

    <textarea onChange={(e)=>setInput(e.target.value)} value={input} />
      <button onClick={handleSave}> Save</button>
 {/*  <input onChange={(e)=>setwrite(e.target.value)} value={input} /> */}


      <h3>TOhhDO</h3>
      <i>text/plain</i>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
