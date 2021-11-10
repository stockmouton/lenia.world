task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
  
    accounts.forEach(account => {
      console.log(account.address);
    });
})