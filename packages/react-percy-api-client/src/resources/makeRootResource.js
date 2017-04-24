import slugify from 'slugify';

export default function makeRootResource(percyClient, testName, html, encodedResourceParams) {
    let resourceUrl = `/${slugify(testName).toLowerCase()}.html`;
    if (encodedResourceParams) {
        resourceUrl = `${resourceUrl}?${encodedResourceParams}`;
    }

    return percyClient.makeResource({
        resourceUrl,
        content: html,
        isRoot: true,
        mimetype: 'text/html'
    });
}
