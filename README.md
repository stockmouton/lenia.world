# Lenia.stockmouton.com

Welcome to our opensourced website! Feel free to have fun looking at our code and don't hesitate to do a pull request if you feel like something deserve to be changed!

## Install
As easy as typing: `yarn`

## Run locally

It's alright, just run:
```
yarn start
``` 
It will:
- spin up a development web server (Gatsby)
- start a local network node (for smart contract interactions)
- compile the smart contract
- deploy the smart contract to the local node

At this point you can connect your wallet. Add one of the dev private keys to your wallet to enjoy those sweet 10k ETH.

If you want more granular control over the development experience:
- Launch the localhost webserver: `yarn develop`
- Launch a localhost network node: `yarn sm-serve`
- Compile the smart contract: `yarn sm-compile`
- Deploy the smart contract to the local node: `yarn sm-deploy`

## Deployment

For deploying the website to Github Page, you won't believe it, just type:
```
STAGING=true yarn deploy # When the smart contract is still deployed to testnet

yarn deploy # When the smart contract is deployed to mainnet
```

Other commands that can be useful before deployment:
- For deploying the smart contract to a remote network (we use Rinkeby as a testnet): `NETWORK=<rinkeby|mainnet> yarn sm-deploy`
- Compile the website: `STAGING=true yarn build` or `yarn build`
- Spin up a local web server: `yarn serve`

## Smart contract operations

In order to mint some Lenia, you will need to flip the `hasSaleStarted` flag on the smart contract:
```
yarn sm-start-sale # Local node

NETWORK=rinkeby yarn sm-start-sale # Testnet
```