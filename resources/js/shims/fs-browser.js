// Browser shim for Node's "fs" used internally by overpy.
// Purpose:
// - avoid runtime crashes in browser bundles (existsSync/readFileSync/writeFileSync),
// - allow translation directives to run without local .po filesystem access.

function emptyRead(options) {
  if (typeof options === 'string') return '';
  if (options && typeof options === 'object' && options.encoding) return '';
  return new Uint8Array();
}

function fakeStat() {
  return {
    isDirectory: () => false,
    isFile: () => false,
  };
}

export function existsSync() {
  return false;
}

export function readFileSync(_path, options) {
  return emptyRead(options);
}

export function writeFileSync() {
  // no-op in browser
}

export function readdirSync() {
  return [];
}

export function lstatSync() {
  return fakeStat();
}

export const promises = {
  readFile: async () => '',
  writeFile: async () => {},
};

export default {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  lstatSync,
  promises,
};
