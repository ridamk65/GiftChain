// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library GiftErrors {
    // Relayer & Access
    error ONLY_RELAYER_HAS_ACCESS();
    error ONLY_CONTRACT_HAS_ACCESS();
    error NOT_AUTHORIZE_TO_RECLAIM_GIFT();
    error NOT_AUTHORIZE_TO_WITHDRAW();

    // Gift Validations
    error INVALID_ADDRESS();
    error INVALID_AMOUNT();
    error EXPIRY_CAN_ONLY_BE_IN_FUTURE();
    error EXPECT_3_TO_50_MESSAGE_CHARACTER();
    error CARD_ALREADY_EXIST();
    error TRANSFER_FAILED();
    error INVALID_GIFTID();
    error GIFT_NOT_CLAIMABLE();
    error GIFT_CLAIMED();
    error GIFT_EXPIRED();
    error CREATOR_CANNOT_CLAIM_GIFT();
    error GiftNotFound();
    error GiftAlreadyRedeemed();
    error GiftAlreadyReclaimed();
    error GIFT_NOT_EXPIRED_YET();

    // Bulk Creation
    error BULK_CREATION_MUST_BE_AT_LEAST_5();
    error ARRAY_LENGTH_MISMATCH();
    error CREATOR_MISMATCH();
    error BULK_CREATION_FAILED();

    // Campaigns
    error INVALID_TITLE();
    error INVALID_DESCRIPTION();
    error CAMPAIGN_ALREADY_EXIST();
    error CAMPAIGN_NOT_FOUND();
    error CAMPAIGN_EXPIRED();
    error EXCEEDS_CAMPAIGN_GOAL();
    error CAMPAIGN_NOT_ENDED();
    error FUNDS_ALREADY_WITHDRAWN();
    error NO_FUNDS_TO_WITHDRAW();
}
