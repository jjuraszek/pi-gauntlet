import { sha256 } from '../eval/lib/checks.mjs';

// Pre-move replies were judged against command-based handoffs. Never attribute those judgments to the new file-based handoffs.
const archived = new Map([
  ['cf5100e9bf6d944d7fdb41923673fb6bcacc604d63b84148171e5ae96a26e291/engine-waves', 'ade9f8cb4f05e912f417f51aefc38b76fe225d66d6861ee6e6f5c6f4a11754ad'],
  ['df8a3021dbf793bad56b4e06f74b8d59708e6f5d2bbc9ac33e3146f4c8c1b1d6/flag-replies', 'cd02b4a2116463e69ab09b753eb208fda1cafb001fc4758e7200e2879cb31e89'],
  ['65abe58528f169348439b67695efa230f2300fdcc1a132548d4ce2ee6976dcb1/grant-budget-reply', '63afdc443e64d621088010149b8d7eee258a60e25549d3017ffb4da8f0138248'],
  ['e8ab5556a4cca257f116a712c71023e89a4f871d2073ecc15b17a4918a1a6074/loop-funded-reply', 'eb17e539b5a5ad91b1eba11d1729b97d943ee5d132f95fc7d39fd4153f4ea946'],
  ['7efb9ac0a0d2a253ed835d9f2cdd56ee6127637c0e7bc6994b1650247b62edd2/loop-gate', 'fe3291a6962e5cd51334456a331d8f41778d95c85412256f0d270dc4d11ac4a1'],
  ['00ffb96aad45185044a68a33577f880a5d2c5409567da0c221e79d37e4103124/spec-pr-regate', '3b87ccd294a244d5c599e68d8f98e1755a3b6921231989149e5afcadf3c9b0ff'],
]);

export function replayFactsSha(record, expected) {
  return archived.get(`${record.skillSha}/${record.sample}`) ?? sha256(expected);
}
