// Returns true if executing in the Percy rendering environment
export default function inPercy() {
    if (typeof window !== 'object') return false;
    if (!window.location || !window.location.hostname) return false;
    return window.location.hostname.match('proxyme.percy.io');
}
