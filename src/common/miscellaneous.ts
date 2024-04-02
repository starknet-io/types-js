// TODO: To be resolved in future revisions
export type FELT = string;

export type Call = {
  contract_address: FELT;
  entrypoint: string;
  calldata?: FELT[];
};

export type SIERRA_ENTRY_POINT = {
  selector: FELT;
  function_idx: number;
};
