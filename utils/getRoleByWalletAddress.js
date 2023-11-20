const conf = require('ocore/conf');

const { isValidAddress } = require('ocore/validation_utils');

async function getRoleByWalletAddress(address) {
  
  if (isValidAddress(address)) {
    const donationList = await fetch(`${conf.kivach_backend_api_url}/donations?donor=${address}`).then(data => data.json()).then(data => data.data);

    const totalDonated = donationList.reduce((acc, donation) => acc + donation.usd_amount, 0);

    const sortedRoles = conf.discordRoles.sort((a, b) => b.minimum_usd_donation - a.minimum_usd_donation);

    return sortedRoles.find(role => totalDonated >= role.minimum_usd_donation);
  }
}

exports.getRoleByWalletAddress = getRoleByWalletAddress;
