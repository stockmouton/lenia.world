# The Lenia on-chain adventure

Welcome to this little "behind the scene" story and very first Lenia blog post! 🔥
 
In our effort for being transparent, let's not only share success but also drawbacks, sweats, and tears that fill this Lenia journey!

![No pain no gain](./no-pain-no-gain.gif)

## TL;DR
- We set a release date a little bit too early and due to the team organization and some surprises, we were struggling to stay on time.
- In the rush, we introduces 2 bugs in the smart contract which we deployed (remember that a smart contract cannot be changed once it is deployed on the blockchain)
- Taking inspiration from the Diamond architecture (EIP-2535), we built a solution by adding a new smart contract and linking them together.

You can find the 2 smart contracts here:
- [Lenia NFT](https://etherscan.io/address/0xe95004c7f061577df60e9e46c1e724cc75b01850)
- [Metadata](https://etherscan.io/address/0xb95e8487b8Df34f30e363681242b8d4a0661F785)

## Back in time
It's Wednesday, September 22, 2021. Alex and I have a call with the rest of the team (NfTribe). Everything is smooth so far, we feel confident in choosing a date for the launch. We chose Thursday, October 7, 2021, and take the time for the team to meet IRL. Traveling tickets are taken, everything is scheduled. Let's go!

Fast forward 2 weeks. Alex and I are sleep-deprived, sweating, and writing code like some frenetic monkeys who don't know what they are doing. Of course, the launch of the Lenia NFT collection must be done in pain, what did you expect? 

But why though? Well, 2 weeks before the launch, when we decided the launch date, we hadn't done a quite important step: estimating the gas of deploying our work on the Ethereum. 
And we finally did it only 10 days before. And this is when we discovered we had to optimize many things to make the launch acceptable financially.

On top of that, we still had the website to finish, the smart contract to polish, and wanted to review all the Lenia color palettes. One thing after another, we finally review those color palettes just a few days before the launch. But then you have to render all the assets (it takes time), make sure the metadata and the assets are synchronized, shuffle them, etc.

So we end up rushing through those last-minute changes until we were ready. Focus is quite hard to summon at that point, remember that we are also sleep-deprived, stressed, and over-excited at the same time. During that work, the clock was ticking and we were already 30 minutes late! 

Outside of the automated test, we did a final human check and then, we decided to deploy... without seeing that bugs were lurking... in a smart contract... which cannot be updated...

![Oups](./oups.gif)

## Bugs

### Bug 1
To optimize the overall cost of our smart contract, we decided to create a smart contract library with a lot of hardcoded values. This would allow us to pay once for the library and then be able to use it with a minimal amount of data for all the different Lenia. In doing so, we hardcoded the name of the color palettes.

But we changed some of those color palettes in the last few days, meaning some of them were removed and others were added. And we didn't reflect the change in the [smart contract library](https://etherscan.io/address/0xe95004c7f061577df60e9e46c1e724cc75b01850#code), dooming the library to be unusable.

You can see below that the colors do not match the actual colors of the collection.
![Hardcoded colormaps](./colormap.png)

BUT, we had enough room in the smart contract to circumvent the library and find a solution. At least, we thought until we discover the second bug.

### Bug 2
Let me warn you, this one is fairly stupid.

While we were developing the smart contract, we were pondering the following feature: should we let owners update their Lenia metadata?

At first, it sounded cool but then we started to worry about bad actors which could start to point a Lenia to anything by changing its metadata. So we concluded to limit that feature to the Lenia smart contract owner. 

A copy/paste action later, the little keyword **onlyOwner** was added to some of the smart contract functions. The goal was to protect the capacity to update those metadata not to limit access to it.

But this is what we did, this little keyword, **onlyOwner** ends up being added to the wrong function, the one which should be used to retrieve the data. We doomed another chance to solve our problem.
![Hardcoded onlyOwner](./metadata-2.png)

## Hope
In all those bad news, we still had done one thing well! 

Putting Lenia on-chain requires two parts:
- The first one is to put Lenia data on-chain.
- The second one is to upload the JavaScript rendering engine on-chain too.

And we didn't blow up that second part. This means that we had at least one field, which could be set by the owner and read by everyone inside our smart contract. 🎉

How to use that for our salvation?

### Taking inspiration from the best: EIP-2535
[EIP-2535 called "Diamonds, Multi-Facet Proxy"](https://eips.ethereum.org/EIPS/eip-2535) describe a standard for building modular smart contract systems that can be extended (or updated) in production.

The best feature of this standard is the following: **Diamonds can be upgraded without having to redeploy existing functionality. Parts of a diamond can be added/replaced/removed while leaving other parts alone.**

How does that work? The main contract is called a diamond and it contains external functions that are supplied by other independent smart contracts. The only thing you need to store in the diamond is the mapping of functions to the other smart contract.

This means that as long as you put your custom features outside of your main smart contract, you will be able to update them by deploying a new smart contract and updating the mapping of your diamond

And right here was the key for us. We won't implement a diamond but we can use the same logic and use our free field to set the address of another smart contract!

### Metadata smart contract
Following the diamond logic, we decided to create a new smart contract, and link our NFT contract to this new contract using the empty engine field. 

We kept the new smart contract very concise to minimize errors, it only contains needed functions to store the rendering engine (Javascript) and Lenia metadata (JSON).

Just to be crystal clear, this is not following EIP-2535 but it's perfectly fine for our use case 👍

## Why is it so important to be on-chain?
Outside of purity and beauty consideration (Hi fellow nerds and hackers!). The main goal of being on-chain is to ensure that the data won't disappear anywhere unless the chain itself disappears. Quite improbable for Ethereum now.

I believe this has a lot of value. It satisfies the promise of Ethereum itself: an immutable and timeless safe for your money, app, and data.

> Note: Since the data is quite big, it is currently stored as `callData`, meaning it's in the logs of the blockchain. If you want to know more, come to speak with us in the discord!

So did we alter anything?
- In terms of functionality, no. The data is stored as `callData` in the blockchain logs forever.
- In terms of code beauty, yes. This is not beautiful and my little heart bleeds every time I'm looking at it.

----

Hope you enjoyed this little "behind the scene" story! Have a nice day and take care!

![Cheers](./cheers.gif)