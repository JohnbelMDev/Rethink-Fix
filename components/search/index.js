import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';




var Typeahead = require('react-typeahead').Typeahead;

function Search(){
// I chose to go with type ahead, if we had a database 
  return(
    <Typeahead
    options={['John', 'Paul', 'George', 'Ringo']}
    maxVisible={2}
    />
  );


}

export default Search;
