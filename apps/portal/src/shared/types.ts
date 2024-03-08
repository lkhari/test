export type NN<P> = P extends undefined ? NonNullable<P> : P;
