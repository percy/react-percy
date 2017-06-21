export default function getRtlRegex(rtl, rtlRegex) {
    // If rtl is set, match all story names
    if (rtl) {
        return /.*/gim;
    }

    if (rtlRegex) {
        return new RegExp(rtlRegex);
    }

    return null;
}
