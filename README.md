# Lenia.stockmouton.com

Welcome to our opensourced website! Feel free to have fun looking at our code and don't hesitate to do a pull request if you feel like something deserve to be changed!

## Install
As easy as typing: `yarn`

## Development

Before starting development, it is recommended to:
- install the latest dependencies:
```
yarn
```
- start a local network node (for smart contract interactions)
```
yarn local-node
```
- deploy the current smart contract version to the local node and export the artifacts file for the Frontend.
```
yarn sm-deploy --export src/artifacts.json
```
- spin up a development web server (Gatsby)
```
yarn develop
```

At this point you can connect your wallet. Add one of the dev private keys to your Metamask wallet to enjoy those sweet 10k ETH.

## Deployment

For deploying the website to Github Page, you won't believe it, just type:
```
STAGING=true yarn deploy # When the smart contract is still deployed to testnet

yarn deploy # When the smart contract is deployed to mainnet
```

Other commands that can be useful before deployment:
- For deploying the smart contract to a remote network (we use Rinkeby as a testnet): `NETWORK=<rinkeby|mainnet> yarn sm-deploy`
- Compile the website: `STAGING=true yarn build` or `yarn build`
- Spin up a local web server to show the compiled website: `yarn serve`

For deploying the smart contract to a remote network (we use Rinkeby as a testnet):
```
NETWORK=<rinkeby|mainnet> yarn sm-deploy
```

You will also need to setup some environment variables beforehand:
```
RINKEBY_PRIVATE_KEY=xxxxxx # Your wallet private key
ALCHEMY_API_KEY=xxxxxxx
```

## Smart contract operations

In order to mint some Lenia, you will need to flip the `hasSaleStarted` flag on the smart contract:
```
yarn sm-start-sale # Local node

NETWORK=rinkeby yarn sm-start-sale # Testnet
```