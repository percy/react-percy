export default function escapePathForWindows(path) {
  return path.replace(/\\/g, '\\\\');
}
