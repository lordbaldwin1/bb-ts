// board squares
const a8 = 0n,
  b8 = 1n,
  c8 = 2n,
  d8 = 3n,
  e8 = 4n,
  f8 = 5n,
  g8 = 6n,
  h8 = 7n;
const a7 = 8n,
  b7 = 9n,
  c7 = 10n,
  d7 = 11n,
  e7 = 12n,
  f7 = 13n,
  g7 = 14n,
  h7 = 15n;
const a6 = 16n,
  b6 = 17n,
  c6 = 18n,
  d6 = 19n,
  e6 = 20n,
  f6 = 21n,
  g6 = 22n,
  h6 = 23n;
const a5 = 24n,
  b5 = 25n,
  c5 = 26n,
  d5 = 27n,
  e5 = 28n,
  f5 = 29n,
  g5 = 30n,
  h5 = 31n;
const a4 = 32n,
  b4 = 33n,
  c4 = 34n,
  d4 = 35n,
  e4 = 36n,
  f4 = 37n,
  g4 = 38n,
  h4 = 39n;
const a3 = 40n,
  b3 = 41n,
  c3 = 42n,
  d3 = 43n,
  e3 = 44n,
  f3 = 45n,
  g3 = 46n,
  h3 = 47n;
const a2 = 48n,
  b2 = 49n,
  c2 = 50n,
  d2 = 51n,
  e2 = 52n,
  f2 = 53n,
  g2 = 54n,
  h2 = 55n;
const a1 = 56n,
  b1 = 57n,
  c1 = 58n,
  d1 = 59n,
  e1 = 60n,
  f1 = 61n,
  g1 = 62n,
  h1 = 63n;

const WHITE = 0;
const BLACK = 1;

// for future use
/*
"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
"a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
"a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
"a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
"a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
"a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
"a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
"a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
*/

// bitboard data type - using bigint for 64-bit unsigned integers
type Bitboard = bigint;

function createBitboard(value: bigint | number): Bitboard {
  if (typeof value === "number") {
    return BigInt.asUintN(64, BigInt(value));
  }
  return BigInt.asUintN(64, value);
}

/*********************************************************\
===========================================================

                    Bit manipulations

===========================================================
\*********************************************************/

// Bit manipulation functions for bitboards
const getBit = (bitboard: Bitboard, square: bigint): Bitboard =>
  bitboard & (1n << square);
const setBit = (bitboard: Bitboard, square: bigint): Bitboard =>
  bitboard | (1n << square);
const popBit = (bitboard: Bitboard, square: bigint): Bitboard =>
  getBit(bitboard, square) ? bitboard ^ (1n << square) : bitboard;

/*********************************************************\
===========================================================

                    Input/Output

===========================================================
\*********************************************************/

function printBitboard(bitboard: Bitboard) {
  console.log("\n");

  for (let rank = 0n; rank < 8n; rank++) {
    for (let file = 0n; file < 8n; file++) {
      // convert file & rank into square index
      const square = rank * 8n + file;

      // print ranks
      if (!file) {
        process.stdout.write(`  ${8n - rank}  `);
      }
      // print bit state (either 1 or 0)
      process.stdout.write(` ${getBit(bitboard, square) ? 1 : 0} `);
    }
    console.log("");
  }

  // print board files
  console.log("\n      a  b  c  d  e  f  g  h \n");

  // print bitboard as unsigned decimal number
  console.log("      Bitboard:", bitboard);
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

// pawn attacks table [side][square]
const pawnAttacks = [
  new Array<bigint>(64).fill(0n),
  new Array<bigint>(64).fill(0n),
] as const;

// knight attacks table [square]
const knightAttacks = new Array<bigint>(64).fill(0n);

// king attacks table [square]
const kingAttacks = new Array<bigint>(64).fill(0n);

function maskPawnAttacks(side: number, square: bigint) {
  // result attacks bitboard
  let attacks = createBitboard(0n);
  // piece bitboard
  let bitboard = createBitboard(0n);
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

  return attacks;
}

function maskKnightAttacks(square: bigint) {
  let attacks = createBitboard(0n);
  let bitboard = createBitboard(0n);
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

  return attacks;
}

function maskKingAttacks(square: bigint) {
  let attacks = createBitboard(0n);
  let bitboard = createBitboard(0n);
  bitboard = setBit(bitboard, square);

  if ((bitboard >> 1n) & NOT_H_FILE) attacks |= bitboard >> 1n;
  if ((bitboard >> 7n) & NOT_A_FILE) attacks |= bitboard >> 7n;
  if ((bitboard >> 9n) & NOT_H_FILE) attacks |= bitboard >> 9n;
  attacks |= bitboard >> 8n;

  if ((bitboard << 1n) & NOT_A_FILE) attacks |= bitboard << 1n;
  if ((bitboard << 7n) & NOT_H_FILE) attacks |= bitboard << 7n;
  if ((bitboard << 9n) & NOT_A_FILE) attacks |= bitboard << 9n;
  attacks |= bitboard << 8n;

  return attacks;
}

function initLeapersAttacks() {
  for (let square = 0; square < 64; square++) {
    // init pawn attacks
    pawnAttacks[WHITE][square] = maskPawnAttacks(WHITE, BigInt(square));
    pawnAttacks[BLACK][square] = maskPawnAttacks(BLACK, BigInt(square));

    // init knight attacks
    knightAttacks[square] = maskKnightAttacks(BigInt(square));

    // init king attacks
    kingAttacks[square] = maskKingAttacks(BigInt(square));
  }
}

/*********************************************************\
===========================================================

                        Main driver

===========================================================
\*********************************************************/

function main() {
  initLeapersAttacks();

  for (let square = 0; square < 64; square++) {
    printBitboard(kingAttacks[square]!);
  }

  return 0;
}

main();
