import React from 'react';
import Refs from '../Refs';

suite('Refs', () => {
  percySnapshot('components with string refs work', () => {
    return <Refs type="string">This is some text</Refs>;
  });

  percySnapshot('components with function refs work', () => {
    return <Refs type="function">This is some text</Refs>;
  });

  percySnapshot('components using createRef work', () => {
    return <Refs type="createRef">This is some text</Refs>;
  });
});
