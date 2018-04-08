/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require('path');

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators;

  createRedirect({
    fromPath: '/',
    isPermanent: true,
    toPath: '/0',
    redirectInBrowser: true,
  });

  const slideshowTemplate = path.resolve('src/templates/slideshow.js');

  return graphql(`
  {
    allFile(
      filter: {sourceInstanceName: {eq: "gallery"}},
      sort: {order: ASC, fields: [id]}
    ) {
      edges {
        node {
          id
          absolutePath
        }
      }
    }
  }
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const length = result.data.allFile.edges.length;

    result.data.allFile.edges.forEach(({ node }, index) => {
      createPage({
        path: `/${index}`,
        component: slideshowTemplate,
        context: { absolutePath: node.absolutePath, index, length }
      });
    });
  });
};
