# Liberdus Setup Guide for GOAT Royalties Integration

This guide provides step-by-step instructions for completing the Phase 5 Liberdus account setup tasks.

---

## 1. Join Liberdus Discord Community

**Invite Link:** https://discord.gg/2cpJzFnwCR

**Steps:**
1. Click the invite link above
2. Accept the Discord invite
3. Complete any verification steps (captcha, rules acceptance)
4. Introduce yourself in the #introductions channel
5. Check #announcements for latest updates
6. Visit #ambassador-program for application details

**Alternative Community Links:**
- Twitter: https://x.com/liberdus
- Telegram: https://t.me/LiberdusOfficial

---

## 2. Purchase/Claim LIB Tokens

**Token Information:**
- **Total Supply:** 210 million (fixed)
- **Token Symbol:** LIB
- **Use Cases:** Transaction fees, governance voting, validator staking

**How to Get LIB Tokens:**

### Option A: Claim from Liberdus Wallet
1. Download the Liberdus wallet from https://liberdus.com
2. Create a new wallet or import existing
3. Navigate to the "Claim" section
4. Follow the instructions to claim your initial LIB tokens

### Option B: Purchase from Exchanges
Check the Liberdus Discord for current exchange listings and liquidity pools.

### Option C: Bridge from Other Chains
Liberdus supports bridged tokens from:
- Ethereum
- Polygon
- BNB Chain

Use the built-in bridge feature in the Liberdus wallet.

---

## 3. Set Up Validator Node

**Hardware Requirements:**
- **CPU:** 2 cores minimum
- **RAM:** 2GB minimum
- **Storage:** 256GB SSD
- **Network:** 1Gbps connection
- **OS:** Linux Ubuntu LTS (recommended)

**Estimated Cost:** ~$30/month for VPS

**Minimum Stake:** 1,250 LIB

### Installation Steps:

1. **Rent a VPS** (recommended providers: DigitalOcean, Linode, Vultr, Hetzner)

2. **Connect to your VPS via SSH:**
   ```bash
   ssh root@your-vps-ip
   ```

3. **Run the validator installer:**
   ```bash
   curl -O https://raw.githubusercontent.com/liberdus/validator-dashboard/main/installer.sh && chmod +x installer.sh && ./installer.sh
   ```

4. **Access the validator dashboard:**
   - URL: https://localhost:8080
   - Follow the on-screen setup wizard

5. **Stake your LIB tokens:**
   - Transfer at least 1,250 LIB to your validator wallet
   - Confirm the stake transaction in the dashboard

6. **Monitor your validator:**
   - Check status regularly in the dashboard
   - Join the #validator-discussion channel on Discord for support

**Support Resources:**
- GitHub: https://github.com/Liberdus/validator-dashboard
- Discord: #validator-support channel

---

## 4. Apply for Ambassador Program

**Where to Find It:** Liberdus Discord #ambassador-program channel

**Typical Requirements:**
- Active community participation
- Social media presence
- Content creation ability (optional but helpful)
- Knowledge of Liberdus and Shardus technology

**Application Process:**
1. Join Discord (see step 1)
2. Navigate to #ambassador-program channel
3. Read the program requirements and benefits
4. Fill out the application form (usually linked in the channel)
5. Wait for review and approval

**Ambassador Benefits May Include:**
- LIB token rewards
- Early access to features
- Community recognition
- Governance influence

---

## Quick Reference Links

| Resource | Link |
|----------|------|
| Liberdus Website | https://liberdus.com |
| Discord | https://discord.gg/2cpJzFnwCR |
| Twitter | https://x.com/liberdus |
| Telegram | https://t.me/LiberdusOfficial |
| Validator GitHub | https://github.com/Liberdus/validator-dashboard |
| Wallet Download | https://liberdus.com |

---

## Support

If you encounter any issues:
1. Check the Liberdus Discord for community support
2. Review the documentation on the official website
3. Ask in the #help channel on Discord

---

*This guide was generated for the GOAT Royalties app integration with Liberdus.*