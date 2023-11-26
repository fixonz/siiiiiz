import { request } from "undici";

const userAddress = "0x0000c3Caa36E2d9A8CD5269C976eDe05018f0000";
const collectionContractAddress = "0xcd77d8ca8c6d148060480fa11762630465211bf8";

export default async function getTotaltokens(Useraddress, nftAddress) {
  try {
    const { body } = await request(
      `https://api.reservoir.tools/users/${Useraddress}/tokens/v6`
    );
    const responseJSON = await body.json();

    // Check if responseJSON.data is defined before accessing the 'tokens' property
    const tokens = responseJSON.data?.tokens;

    if (!tokens) {
      console.error("Tokens not found in the response data.");
      return 0; // or handle the absence of tokens in the way that makes sense for your application
    }

    // Filter tokens based on the provided NFT address
    const filteredTokens = tokens.filter(
      (token) => token.token.contract === nftAddress
    );

    // Sum the tokenCount for the filtered tokens
    const totalTokensOwned = filteredTokens.reduce(
      (sum, token) => sum + parseInt(token.ownership.tokenCount),
      0
    );

    return totalTokensOwned;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Example usage
try {
  const totalTokensOwned = await getTotaltokens(userAddress, collectionContractAddress);
  console.log(`Total tokens owned: ${totalTokensOwned}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
