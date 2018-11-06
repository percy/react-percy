import PropTypes from 'prop-types';
import React from 'react';

export default class Refs extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['string', 'function', 'createRef']).isRequired,
  };

  ref = React.createRef();

  render() {
    switch (this.props.type) {
      case 'string':
        return (
          // eslint-disable-next-line react/no-string-refs
          <div ref="test">
            {this.props.children}
          </div>
        );

      case 'function':
        return (
          <div
            ref={el => {
              this.el = el;
            }}
          >
            {this.props.children}
          </div>
        );

      case 'createRef':
        return (
          <div ref={this.ref}>
            {this.props.children}
          </div>
        );
    }
  }
}
