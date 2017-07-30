import Example from '../Example';
import React from 'react';

suite('Example', () => {
  snapshot('basic components work', () => {
    return <Example>This is some text</Example>;
  });

  snapshot(
    'components with custom dimensions work',
    () => {
      return <Example>This is some text</Example>;
    },
    [320, 768],
  );
});
