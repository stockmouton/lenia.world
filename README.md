# Lenia.stockmouton.com

Welcome to our opensourced website! Feel free to have fun looking at our code and don't hesitate to do a pull request if you feel like something deserve to be changed!

## Install
As easy as typing: `yarn`

## Development

### Deps
Before starting development, it is recommended to:
- install the latest dependencies:
```
yarn
```

Before starting the web server, we need to compile and deploy the smart contract locally.

### Smart contract
- start a local network node (for smart contract interactions)
```
yarn sm-local-node
```

- deploy the current smart contract version to the local node and export the artifacts file for the Frontend.
```
yarn sm-deploy
```

Make sure everything is all right by testing it:
```
yarn test
```

### Web
- spin up a development web server (Gatsby)
```
yarn develop
```
Got check the website at the URL provided by Gatsby

### Notes
If you have a problem with Gatsby cache, clean it:
```
yarn clean
```

You will need money in your local account to interact with the smart contract:
- Add one of the dev private keys to your Metamask wallet to enjoy those sweet default 10k ETH.

## Deployment

### Smart contract
Before deploying either on testnet or on mainnet, we need to set the owner private key. (If you deploy on testnet, you also need to create an account on alchemy and set you alchemy_API_KEY)
```
RINKEBY_PRIVATE_KEY=xxxxxx # Your rinkeby wallet private key
PRIVATE_KEY=xxxxxx # Your mainnet wallet private key
ALCHEMY_API_KEY=xxxxxxx
```

hen you can deploy the smart contract to a remote network (we use Rinkeby as a testnet): 
```
NETWORK=<rinkeby|mainnet> yarn sm-deploy
```

Now that the smart contract is deployed, we can finally deploy the website.

### Web
For deploying the website to Github Page, just type:
```
STAGING=true yarn deploy # When the smart contract is still deployed to testnet

yarn deploy # When the smart contract is deployed to mainnet
```


## Smart contract interaction (once deployed)

In order to mint some Lenia, you will need to flip the `hasSaleStarted` flag on the smart contract:
```
yarn sm-start-sale # Local node

NETWORK=rinkeby yarn sm-start-sale # Testnet
```