import interpret from 'interpret';

const extensions = Object.keys(interpret.extensions).filter(ext => ext !== '.js');

export default function getExtension(configPath) {
  for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i];
    if (configPath.indexOf(extension, configPath.length - extension.length) > -1) {
      return extension;
    }
  }

  // Treat .js files as .babel.js files so interpret loads babel-register.
  // This allows webpack configs to use ES6 syntax even if they don't end
  // with a .babel.js extension.
  return '.babel.js';
}
