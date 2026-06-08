import type { MSG_TO_L1, PROOF, PROOF_FACTS } from '../api/components.js'

/**
 * The result of proving a transaction
 */
export type PROVE_TRANSACTION_RESULT = {
  proof: PROOF
  proof_facts: PROOF_FACTS
  l2_to_l1_messages: MSG_TO_L1[]
}
