export const CONTRACT_ADDRESSES = {
  GIFT_CHAIN: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", // Updated with deployed address
  MOCK_ERC20: "0x0165878A594ca255338adfa4d48449f69242Eb8F" // MockERC20 token address
};

export const NETWORK_CONFIG = {
  chainId: 31337, // Hardhat local network
  chainName: "Hardhat Local",
  rpcUrl: "http://127.0.0.1:8545",
  blockExplorer: ""
};

export const GIFT_CHAIN_ABI = [
  "function createGift(address _token, uint256 _amount, uint256 _expiry, string memory _message, bytes32 _giftID, bytes32 _creator) external",
  "function claimGift(bytes32 giftID) external",
  "function reclaimGift(bytes32 giftID) external",
  "function validateGift(bytes32 giftID) external view returns (bool isValid, string memory message)",
  "function gifts(bytes32) external view returns (address token, bool claimed, uint256 expiry, uint256 timeCreated, uint256 amount, string memory message, uint8 status, bytes32 creator)",
  "event GiftCreated(bytes32 indexed giftID, bytes32 indexed creator, address indexed token, string message, uint256 amount, uint256 expiry, uint256 timeCreated, string status)",
  "event GiftClaimed(bytes32 indexed giftID, address indexed recipient, uint256 amount, string status)",
  "event GiftReclaimed(bytes32 indexed giftID, address indexed recipient, uint256 amount, string status)"
];

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function mint(address to, uint256 amount) returns (bool)"
];