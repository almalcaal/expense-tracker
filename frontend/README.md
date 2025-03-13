# React + Vite

## Known Bugs

- If I empty the amount and press save and then refresh it will cause the amount to be a null value which can cause a bug. Current solution: I went inside the transaction.resolver.js and filtered through all transactions who's values are null. not the best solution but i first gotta see how to prevent users from entering while the inputs are empty. i could consider a disable state of sorts while mandatory inputs are empty.
