// board squares
const a8 = 0,
  b8 = 1,
  c8 = 2,
  d8 = 3,
  e8 = 4,
  f8 = 5,
  g8 = 6,
  h8 = 7;
const a7 = 8,
  b7 = 9,
  c7 = 10,
  d7 = 11,
  e7 = 12,
  f7 = 13,
  g7 = 14,
  h7 = 15;
const a6 = 16,
  b6 = 17,
  c6 = 18,
  d6 = 19,
  e6 = 20,
  f6 = 21,
  g6 = 22,
  h6 = 23;
const a5 = 24,
  b5 = 25,
  c5 = 26,
  d5 = 27,
  e5 = 28,
  f5 = 29,
  g5 = 30,
  h5 = 31;
const a4 = 32,
  b4 = 33,
  c4 = 34,
  d4 = 35,
  e4 = 36,
  f4 = 37,
  g4 = 38,
  h4 = 39;
const a3 = 40,
  b3 = 41,
  c3 = 42,
  d3 = 43,
  e3 = 44,
  f3 = 45,
  g3 = 46,
  h3 = 47;
const a2 = 48,
  b2 = 49,
  c2 = 50,
  d2 = 51,
  e2 = 52,
  f2 = 53,
  g2 = 54,
  h2 = 55;
const a1 = 56,
  b1 = 57,
  c1 = 58,
  d1 = 59,
  e1 = 60,
  f1 = 61,
  g1 = 62,
  h1 = 63;

const WHITE = 0;
const BLACK = 1;

const SquareToBigInt = [
  0n,
  1n,
  2n,
  3n,
  4n,
  5n,
  6n,
  7n,
  8n,
  9n,
  10n,
  11n,
  12n,
  13n,
  14n,
  15n,
  16n,
  17n,
  18n,
  19n,
  20n,
  21n,
  22n,
  23n,
  24n,
  25n,
  26n,
  27n,
  28n,
  29n,
  30n,
  31n,
  32n,
  33n,
  34n,
  35n,
  36n,
  37n,
  38n,
  39n,
  40n,
  41n,
  42n,
  43n,
  44n,
  45n,
  46n,
  47n,
  48n,
  49n,
  50n,
  51n,
  52n,
  53n,
  54n,
  55n,
  56n,
  57n,
  58n,
  59n,
  60n,
  61n,
  62n,
  63n,
  64n,
];

// for future use
const SquareToCoordinates = [
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
  "a7",
  "b7",
  "c7",
  "d7",
  "e7",
  "f7",
  "g7",
  "h7",
  "a6",
  "b6",
  "c6",
  "d6",
  "e6",
  "f6",
  "g6",
  "h6",
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
  "f5",
  "g5",
  "h5",
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "h4",
  "a3",
  "b3",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "h3",
  "a2",
  "b2",
  "c2",
  "d2",
  "e2",
  "f2",
  "g2",
  "h2",
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1",
];

/*********************************************************\
===========================================================

                    Bit manipulations

===========================================================
\*********************************************************/

// Bit manipulation functions for bitboards
const getBit = (bitboard: bigint, square: number): bigint =>
  bitboard & (1n << SquareToBigInt[square]!);

const setBit = (bitboard: bigint, square: number): bigint =>
  bitboard | (1n << SquareToBigInt[square]!);

const popBit = (bitboard: bigint, square: number): bigint =>
  getBit(bitboard, square)
    ? bitboard ^ (1n << SquareToBigInt[square]!)
    : bitboard;

const countBits = (bitboard: bigint) => {
  let count = 0;

  while (bitboard > 0n) {
    // reset least significant first bit
    bitboard &= bitboard - 1n;
    count++;
  }
  return count;
};
const getLeastSignificantFirstBitIndex = (bitboard: bigint) => {
  if (bitboard === 0n) {
    return -1;
  }

  return countBits((bitboard & (~bitboard + 1n)) - 1n);
};
/*********************************************************\
===========================================================

                    Input/Output

===========================================================
\*********************************************************/

function printBitboard(bitboard: bigint) {
  console.log("\n");

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      // convert file & rank into square index
      const square = rank * 8 + file;

      // print ranks
      if (!file) {
        process.stdout.write(`  ${8 - rank}  `);
      }
      // print bit state (either 1 or 0)
      process.stdout.write(` ${getBit(bitboard, square) ? 1 : 0} `);
    }
    console.log("");
  }

  // print board files
  console.log("\n      a  b  c  d  e  f  g  h \n");

  // print bitboard as unsigned decimal number
  console.log("      Bitboard:", BigInt.asUintN(64, bitboard));
}

/*********************************************************\
===========================================================

                        Attacks

===========================================================
\*********************************************************/

/*
          not A file

  8   0  1  1  1  1  1  1  1 
  7   0  1  1  1  1  1  1  1 
  6   0  1  1  1  1  1  1  1 
  5   0  1  1  1  1  1  1  1 
  4   0  1  1  1  1  1  1  1 
  3   0  1  1  1  1  1  1  1 
  2   0  1  1  1  1  1  1  1 
  1   0  1  1  1  1  1  1  1 

      a  b  c  d  e  f  g  h 

          not H file

  8   1  1  1  1  1  1  1  0 
  7   1  1  1  1  1  1  1  0 
  6   1  1  1  1  1  1  1  0 
  5   1  1  1  1  1  1  1  0 
  4   1  1  1  1  1  1  1  0 
  3   1  1  1  1  1  1  1  0 
  2   1  1  1  1  1  1  1  0 
  1   1  1  1  1  1  1  1  0 

      a  b  c  d  e  f  g  h 


          not HG file
  8   1  1  1  1  1  1  0  0 
  7   1  1  1  1  1  1  0  0 
  6   1  1  1  1  1  1  0  0 
  5   1  1  1  1  1  1  0  0 
  4   1  1  1  1  1  1  0  0 
  3   1  1  1  1  1  1  0  0 
  2   1  1  1  1  1  1  0  0 
  1   1  1  1  1  1  1  0  0 

      a  b  c  d  e  f  g  h 

          not AB file

  8   0  0  1  1  1  1  1  1 
  7   0  0  1  1  1  1  1  1 
  6   0  0  1  1  1  1  1  1 
  5   0  0  1  1  1  1  1  1 
  4   0  0  1  1  1  1  1  1 
  3   0  0  1  1  1  1  1  1 
  2   0  0  1  1  1  1  1  1 
  1   0  0  1  1  1  1  1  1 

      a  b  c  d  e  f  g  h 
*/

// All zero file constants
const NOT_A_FILE = 18374403900871474942n;
const NOT_H_FILE = 9187201950435737471n;
const NOT_HG_FILE = 4557430888798830399n;
const NOT_AB_FILE = 18229723555195321596n;

// Relevant occupancy bit count for every square on board
const bishopRelevantBits = [
  6, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7, 5, 5, 5, 5,
  7, 9, 9, 7, 5, 5, 5, 5, 7, 9, 9, 7, 5, 5, 5, 5, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 6,
];

const rookRelevantBits = [
  12, 11, 11, 11, 11, 11, 11, 12, 11, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10,
  10, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10,
  10, 11, 11, 10, 10, 10, 10, 10, 10, 11, 11, 10, 10, 10, 10, 10, 10, 11, 12,
  11, 11, 11, 11, 11, 11, 12,
];

// pawn attacks table [side][square]
const pawnAttacks = [
  new Array<bigint>(64).fill(0n),
  new Array<bigint>(64).fill(0n),
] as const;

// knight attacks table [square]
const knightAttacks = new Array<bigint>(64).fill(0n);

// king attacks table [square]
const kingAttacks = new Array<bigint>(64).fill(0n);

function maskPawnAttacks(side: number, square: number) {
  // result attacks bitboard
  let attacks = 0n;
  // piece bitboard
  let bitboard = 0n;
  // set piece on board
  bitboard = setBit(bitboard, square);

  if (side === WHITE) {
    if ((bitboard >> 7n) & NOT_A_FILE) attacks |= bitboard >> 7n;
    if ((bitboard >> 9n) & NOT_H_FILE) attacks |= bitboard >> 9n;
  } else {
    // a8
    if ((bitboard << 7n) & NOT_H_FILE) attacks |= bitboard << 7n;
    if ((bitboard << 9n) & NOT_A_FILE) attacks |= bitboard << 9n;
  }

  return BigInt.asUintN(64, attacks);
}

function maskKnightAttacks(square: number) {
  let attacks = 0n;
  let bitboard = 0n;
  bitboard = setBit(bitboard, square);

  // up1 right2
  if ((bitboard >> 6n) & NOT_AB_FILE) attacks |= bitboard >> 6n;
  // up2 right1
  if ((bitboard >> 15n) & NOT_A_FILE) attacks |= bitboard >> 15n;
  // up2 left1
  if ((bitboard >> 17n) & NOT_H_FILE) attacks |= bitboard >> 17n;
  // up1 left2
  if ((bitboard >> 10n) & NOT_HG_FILE) attacks |= bitboard >> 10n;

  // down1 left2
  if ((bitboard << 6n) & NOT_HG_FILE) attacks |= bitboard << 6n;
  // down2 left1
  if ((bitboard << 15n) & NOT_H_FILE) attacks |= bitboard << 15n;
  // down2 right1
  if ((bitboard << 17n) & NOT_A_FILE) attacks |= bitboard << 17n;
  //down1 right 2
  if ((bitboard << 10n) & NOT_AB_FILE) attacks |= bitboard << 10n;

  return BigInt.asUintN(64, attacks);
}

function maskKingAttacks(square: number) {
  let attacks = 0n;
  let bitboard = 0n;
  bitboard = setBit(bitboard, square);

  if ((bitboard >> 1n) & NOT_H_FILE) attacks |= bitboard >> 1n;
  if ((bitboard >> 7n) & NOT_A_FILE) attacks |= bitboard >> 7n;
  if ((bitboard >> 9n) & NOT_H_FILE) attacks |= bitboard >> 9n;
  if (bitboard >> 8n) attacks |= bitboard >> 8n;

  if ((bitboard << 1n) & NOT_A_FILE) attacks |= bitboard << 1n;
  if ((bitboard << 7n) & NOT_H_FILE) attacks |= bitboard << 7n;
  if ((bitboard << 9n) & NOT_A_FILE) attacks |= bitboard << 9n;
  if (bitboard << 8n) attacks |= bitboard << 8n;

  return BigInt.asUintN(64, attacks);
}

function maskBishopAttacks(square: number) {
  let attacks = 0n;

  // init ranks & files
  let r, f;

  // init target rank & files
  let tr = Math.trunc(square / 8);
  let tf = square % 8;

  // mask relevant bishop occupancy bits
  for (r = tr + 1, f = tf + 1; r <= 6 && f <= 6; r++, f++) {
    attacks |= 1n << BigInt(r * 8 + f);
  }
  for (r = tr + 1, f = tf - 1; r <= 6 && f >= 1; r++, f--) {
    attacks |= 1n << BigInt(r * 8 + f);
  }
  for (r = tr - 1, f = tf - 1; r >= 1 && f >= 1; r--, f--) {
    attacks |= 1n << BigInt(r * 8 + f);
  }
  for (r = tr - 1, f = tf + 1; r >= 1 && f <= 6; r--, f++) {
    attacks |= 1n << BigInt(r * 8 + f);
  }

  return BigInt.asUintN(64, attacks);
}

function maskRookAttacks(square: number) {
  let attacks = 0n;

  // rank & file
  let r, f;

  // target rank & file
  let tr = Math.trunc(square / 8);
  let tf = square % 8;

  // mask relevant rook occupancy bits
  for (r = tr + 1; r <= 6; r++) {
    attacks |= 1n << BigInt(r * 8 + tf);
  }
  for (r = tr - 1; r >= 1; r--) {
    attacks |= 1n << BigInt(r * 8 + tf);
  }
  for (f = tf + 1; f <= 6; f++) {
    attacks |= 1n << BigInt(tr * 8 + f);
  }
  for (f = tf - 1; f >= 1; f--) {
    attacks |= 1n << BigInt(tr * 8 + f);
  }

  return BigInt.asUintN(64, attacks);
}

// generate bishop attacks on the fly
function bishopAttacksOnTheFly(square: number, block: bigint) {
  let attacks = 0n;

  let r, f;

  let tr = Math.trunc(square / 8);
  let tf = square % 8;

  // mask attacks, if we hit a blocker, don't go any further
  for (r = tr + 1, f = tf + 1; r <= 7 && f <= 7; r++, f++) {
    attacks |= 1n << BigInt(r * 8 + f);
    if ((1n << BigInt(r * 8 + f)) & block) break;
  }
  for (r = tr + 1, f = tf - 1; r <= 7 && f >= 0; r++, f--) {
    attacks |= 1n << BigInt(r * 8 + f);
    if ((1n << BigInt(r * 8 + f)) & block) break;
  }
  for (r = tr - 1, f = tf - 1; r >= 0 && f >= 0; r--, f--) {
    attacks |= 1n << BigInt(r * 8 + f);
    if ((1n << BigInt(r * 8 + f)) & block) break;
  }
  for (r = tr - 1, f = tf + 1; r >= 0 && f <= 7; r--, f++) {
    attacks |= 1n << BigInt(r * 8 + f);
    if ((1n << BigInt(r * 8 + f)) & block) break;
  }

  return BigInt.asUintN(64, attacks);
}

function rookAttacksOnTheFly(square: number, block: bigint) {
  let attacks = 0n;

  let r, f;

  let tr = Math.trunc(square / 8);
  let tf = square % 8;

  // mask attacks, if we hit a blocker, don't go any further
  for (r = tr + 1; r <= 7; r++) {
    attacks |= 1n << BigInt(r * 8 + tf);
    if ((1n << BigInt(r * 8 + tf)) & block) break;
  }
  for (r = tr - 1; r >= 0; r--) {
    attacks |= 1n << BigInt(r * 8 + tf);
    if ((1n << BigInt(r * 8 + tf)) & block) break;
  }
  for (f = tf + 1; f <= 7; f++) {
    attacks |= 1n << BigInt(tr * 8 + f);
    if ((1n << BigInt(tr * 8 + f)) & block) break;
  }
  for (f = tf - 1; f >= 0; f--) {
    attacks |= 1n << BigInt(tr * 8 + f);
    if ((1n << BigInt(tr * 8 + f)) & block) break;
  }

  return BigInt.asUintN(64, attacks);
}

function initLeapersAttacks() {
  for (let square = 0; square < 64; square++) {
    // init pawn attacks
    pawnAttacks[WHITE][square] = maskPawnAttacks(WHITE, square);
    pawnAttacks[BLACK][square] = maskPawnAttacks(BLACK, square);

    // init knight attacks
    knightAttacks[square] = maskKnightAttacks(square);

    // init king attacks
    kingAttacks[square] = maskKingAttacks(square);
  }
}

// index = 1, bitsInMask = 10, attackMask = rook d4
// square idx = 11

// Index is the configuration, if bitsInMask = 10, there are 2**10 - 1 = 1023 combinations
// of variations in bits set for a 10 bit number. If we iterate 1...1023,
// index will represent every combination by which bits are on/off. count helps us
// "loop" over and check each bit of Index. If that bit is set, we set our occupancy bit on at
// the associated square. We get the LS1B index so we know the offset for index->square.
// We pop the bit because otherwise we would be trying to place each square in the same
// place regardless of it's association with a particular index bit.
function setOccupancy(
  occupancyVariation: number,
  bitsInMask: number,
  attackMask: bigint
) {
  // occupancy map
  let occupancy = 0n;

  for (let idx = 0; idx < bitsInMask; idx++) {
    // get LS1B index of attack mask
    const square = getLeastSignificantFirstBitIndex(attackMask);

    // pop LS1B in attack mask
    attackMask = popBit(attackMask, square);

    // check if bit in variation at idx offset is turned on
    if (occupancyVariation & (1 << idx)) {
      // populate occupancy map
      occupancy |= 1n << BigInt(square);
    }
  }

  return BigInt.asUintN(64, occupancy);
}

/*********************************************************\
===========================================================

                        Main driver

===========================================================
\*********************************************************/

function main() {
  initLeapersAttacks();

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = rank * 8 + file;

      process.stdout.write(` ${countBits(maskRookAttacks(square))}, `);
    }

    console.log();
  }

  return 0;
}

main();
