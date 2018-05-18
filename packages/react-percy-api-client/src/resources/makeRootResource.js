import slugify from 'slugify';

export default function makeRootResource(percyClient, name, html, encodedResourceParams) {
  let slugifiedName = slugify(name);
  let resourceUrl = `/${encodeURI(slugifiedName.toLowerCase())}.html`;
  if (encodedResourceParams) {
    resourceUrl = `${resourceUrl}?${encodedResourceParams}`;
  }

  return percyClient.makeResource({
    resourceUrl,
    content: html,
    isRoot: true,
    mimetype: 'text/html',
  });
}
