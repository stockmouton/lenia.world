# Lenia.stockmouton.com

Welcome to our opensourced website! Feel free to have fun looking at our code and don't hesitate to do a pull request if you feel like something deserve to be changed!

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
yarn local-node
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
You can access the freshly baked website at http://localhost:8000 (for the production build) or http://localhost:8000/?staging=1 (for the staging build)

### Notes
If you have a problem with Gatsby cache, clean it:
```
yarn clean
```

You will need money in your local account to interact with the smart contract:
- Add one of the dev private keys to your Metamask wallet to enjoy those sweet default 10k ETH.

## Deployment

### Smart contract
Before deploying either on testnet or on mainnet, we need to set the owner private key but you will also need to create an account on Alchemy, which will give you an API key for their RPC.
```
RINKEBY_PRIVATE_KEY=xxxxxx # Your rinkeby wallet private key
MAINNET_PRIVATE_KEY=xxxxxx # Your mainnet wallet private key

RINKEBY_ALCHEMY_API_KEY=xxxxxxx
MAINNET_ALCHEMY_API_KEY=xxxxxxx
```

Then you can deploy the smart contract to a remote network (we use Rinkeby as a testnet): 
```
NETWORK=<rinkeby|mainnet> yarn sm-deploy
```

Now that the smart contract is deployed, we can finally deploy the website.

### Web
For deploying the website to Github Page, just type:
```
yarn deploy
```


## Smart contract interaction (once deployed)

It is super important to follow the current steps in order to successfully mint the Lenia and see the results in the LeniaDEX

### 1.Presale
In order to mint some Lenia for the presale, you will need to flip the `isPresaleActive` flag on the smart contract:
```
yarn sm-start-presale # Local node

NETWORK=rinkeby yarn sm-start-presale # Testnet
```

### 1bis.Public Sale
In order to mint some Lenia for the public sale, you will need to flip the `isSaleActive` flag on the smart contract:
```
yarn sm-start-sale # Local node

NETWORK=rinkeby yarn sm-start-sale # Testnet
```

### Minting
Before minting, please: 
- set the baseURI for fetching each NFT metadata.
```
yarn sm-set-baseuri --baseuri <http://localhost:8000/metadata/|https://lenia.world/metadata/> # Local node

NETWORK=rinkeby yarn sm-set-baseuri --baseuri <http://localhost:800/metadata/|https://lenia.world/metadata/> # Testnet
```
- run the long running script to upload the metadata to the `static` public folder so that your Lenia can be revealed.
```
yarn sm-reveal # Local node

NETWORK=rinkeby yarn sm-reveal # Rinkeby
```


## How to test on a mobile phone

We recommend to use Charles to proxy network requests, here is a good [tutorial](https://community.tealiumiq.com/t5/Tealium-for-Android/Setting-up-Charles-to-Proxy-your-Android-Device/ta-p/5121) to set it up.

To access localhost:8000 for example, you would need to access the following URL: http://localhost.charlesproxy.com:8000


## Utils
### Gas estimation
First, create an account on coinmarketcap and get your key, then define it in your `.env.development` file:
```
COINMARKETCAP=a317005e-ee9f-4e2a-89df-69ea7ac3dd45
```

Now you can estimate gas for the smart-contract by running the following command:
```
yarn sm-estimate-gas
```