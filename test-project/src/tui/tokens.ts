// haukTUI tokens configuration
// Customize your terminal UI theme here

import { createTokens, type TokenOverrides } from "@hauktui/tokens";

const customTokens: TokenOverrides = {
  // Override default colors here
  // colors: {
  //   accent: "#8b5cf6", // violet
  // },
};

export const tokens = createTokens(customTokens);
