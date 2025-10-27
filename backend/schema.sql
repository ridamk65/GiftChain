-- GiftChain Database Schema for Supabase

-- Gifts table
CREATE TABLE gifts (
  id SERIAL PRIMARY KEY,
  gift_id VARCHAR(66) UNIQUE NOT NULL,
  creator VARCHAR(42) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  expiry BIGINT NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  recipient_email VARCHAR(255),
  claimed BOOLEAN DEFAULT FALSE,
  claimed_by VARCHAR(42),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  tx_hash VARCHAR(66)
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group gifts table
CREATE TABLE group_gifts (
  id SERIAL PRIMARY KEY,
  group_id VARCHAR(66) UNIQUE NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  total_amount VARCHAR(50) NOT NULL,
  message TEXT,
  created_by VARCHAR(42) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_gifts_creator ON gifts(creator);
CREATE INDEX idx_gifts_claimed_by ON gifts(claimed_by);
CREATE INDEX idx_gifts_gift_id ON gifts(gift_id);
CREATE INDEX idx_users_email ON users(email);