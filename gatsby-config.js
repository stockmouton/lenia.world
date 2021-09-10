module.exports = {
  siteMetadata: {
    title: `Lenia - A NFT collection of artificial life-forms`,
    description: `Enter the metaverse of Lenia, a collection of 1337 artificial life-forms discovered via evolutionary computation. They live as unique digital collectibles (NFT) on the Ethereum blockchain.`,
    author: `@lenia_nft`,
    siteUrl: `https://lenia.stockmouton.com/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `lenia`,
        short_name: `lenia`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/orbium.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ['STAGING']
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
