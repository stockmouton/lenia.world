## The Lenia on-chain adventure

### Context
- We decided of a launch date believing we were fine
- Of course we were not fine but couldn't step backwards (we met in real life for that moment, the date has been announcedm no way we postpone)
- So we end up in a rush and of course, we decides to improve the whole collections colors right before the sale start... And of course, we introduced bugs in a smart contract... bugs that can't be updated at all... Hooo geez!

### Bugs
- Bug 1: in the rush, we forgot about hardcoded color names in teh smart contrat
- Bug 2: We also forgot to remove some `onlyOwners` statement
- So the leniaLibrariries can't be used
- So nobody outside of the owner can retrieve its metadata
- But we didn't fucked up all the fields! The field made for the rendering engine is working as expected. How to use that to save ourselves?

### Taking inspiration from the best: EIP-2535
- The diamond idea: Maybe you don't know but there is EIP called [Diamonds (EIP-2535: Diamonds, Multi-Facet Proxy)](https://eips.ethereum.org/EIPS/eip-2535) which represents a multi-faceted proxy. To make simple, a main smart contract contains some fields which contains address to other smart contracts.
Those other smart contracts must satisfy an interface but as long as it is true, the main smart contract pwner can change the address and switch the pointed smart contract.
This allows to link smart contract together, and allows for udpate of pointed smart contract!
A good practice for us would have been to create a simple ERC721 smart contract without any added functionnalities. We woudl then just add a simple field pointing to a metadata smart contract.
In this case, we could just have updated th subsequent smart contract and that would have been much easier!
- Metadata smart contract
Based on this diamond idea, we decided to create a new smart contract, and link to it in the main one. (Just to be clear, this is not following EIP-2535 but it's perfectly fine for our usecase)
So, again the goal was to replace the dead functions while maintaining a low transaction fees. 

### Any drawbacks?
In terms of functionnality, no. The data is stored as callData in the blockchain logs forever and we ensure stability through time.
In tern of code beauty, we fucked up. This is not beautiful, this is hideous and even if my little heart bleed for that. This was a very good blockchain learning experence.

Have a nice day folks, take care!