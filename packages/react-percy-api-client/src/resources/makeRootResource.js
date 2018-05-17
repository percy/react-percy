import slugify from 'slugify';

export default function makeRootResource(percyClient, name, html, encodedResourceParams) {
  let slugified_name = slugify(name, { remove: /[$*_+~.()'"!\-:@]/g });
  let resourceUrl = `/${slugified_name.toLowerCase()}.html`;
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
