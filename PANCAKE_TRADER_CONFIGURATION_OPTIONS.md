# Pancake Trader Configuration Options

Specify the following as environment variables when running `pancake-trader`.

```
POLL_BALANCE_EVERY  - Poll the exchange ETH balance every Xms             | default: 60000
BALANCE_TIMEOUT     - Stop polling the exchange ETH balance after Xms     | default: 100
```

e.g.

```
POLL_BALANCE_EVERY=1000 BALANCE_TIMEOUT=10000 yarn dev
```
