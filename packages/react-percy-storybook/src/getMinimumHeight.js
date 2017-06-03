export default function getMinimumHeight(minimumHeightString) {
    if (!(/^[0-9]*$/.test(minimumHeightString))) {
        throw new Error(
            `Minimum Height must be an integers. Received: ${minimumHeightString}`,
        );
    }

    return parseInt(minimumHeightString, 10);
}
