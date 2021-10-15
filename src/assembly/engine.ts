// Configuration imported from JS
declare const WORLD_SIZE: u32;
declare const GF_ID: u32;
declare const GF_M: f32;
declare const GF_S: f32;
declare const T: f32;

const CELLS_IDX = 0;
const CELLS_OLD_IDX = 1;
const CELLS_IMAG_IDX = 2;
const FIELD_IDX = 3;
const POTENTIAL_REAL_IDX = 4;
const POTENTIAL_IMAG_IDX = 5;
const KERNEL_REAL_IDX = 6;
const KERNEL_IMAG_IDX = 7;
const CELLS_OUT_IDX = 8;

const PRECISION: f32 = 1000000;

@inline
function get(idx: u32, x: u32, y: u32): f32 {
  return load<f32>((idx * WORLD_SIZE**2 + y * WORLD_SIZE + x) << 2);
}

@inline
function set(idx: u32, x: u32, y: u32, v: f32): void {
  store<f32>((idx * WORLD_SIZE**2 + y * WORLD_SIZE + x) << 2, v);
}

/** Performs one step. Called about 30 times a second from JS. */
export function update_fn(isUpdate: bool): void {
  for (let i: u32 = 0; i < WORLD_SIZE; i++){
    for (let j: u32 = 0; j < WORLD_SIZE; j++) {
        let x = j;
        let y = i;
        set(CELLS_OLD_IDX, x, y, get(CELLS_IDX, x, y))
        set(CELLS_IMAG_IDX, x, y, 0)
    };
  }

  // Change cells inplace
  applyKernel()

  for (let y: u32 = 0; y < WORLD_SIZE; y++) {
      for (let x: u32 = 0; x < WORLD_SIZE; x++) {
          let p = get(POTENTIAL_REAL_IDX, x, y);
          let g = growthFn(GF_ID, GF_M, GF_S, p);
          set(FIELD_IDX, x, y, g)
          let v = get(CELLS_OLD_IDX, x, y) + g / T;

          // Clip
          if (v < 0.) {
            v = 0;
          } else if (v > 1.) {
            v = 1
          };

          if (isUpdate) {
            set(CELLS_OUT_IDX, x, y, v)
          } else {
            set(CELLS_OUT_IDX, x, y, get(CELLS_OLD_IDX, x, y))
          }
      }
  }
}

export function applyKernel(): void {
  // f * g = F-1( F(f) dot F(g) )
  FFT2D(1, CELLS_IDX, CELLS_IMAG_IDX);
  complexMatrixDot(
    CELLS_IDX,
    CELLS_IMAG_IDX,
    KERNEL_REAL_IDX,
    KERNEL_IMAG_IDX,
    POTENTIAL_REAL_IDX,
    POTENTIAL_IMAG_IDX
  );
  FFT2D(-1, POTENTIAL_REAL_IDX, POTENTIAL_IMAG_IDX);
}  

function FFT2D(dir: i8, idxReal: u32, idxImag: u32): void {
  for (let y: u32 = 0; y < WORLD_SIZE; y++) {
    FFT1D(dir, y, idxReal, idxImag);
  }

  transpose2D(idxReal);
  transpose2D(idxImag);

  for (let y: u32 = 0; y < WORLD_SIZE; y++) {
    FFT1D(dir, y, idxReal, idxImag);
  }
}

function transpose2D(idx: u32): void {
  for (let i: u32 = 0; i < WORLD_SIZE; i++) {
      for (let j: u32 = 0; j < i; j++) {
          let x = j;
          let y = i;

          const tmp_re = get(idx, x, y);
          set(idx, x, y, get(idx, y, x))
          set(idx, y, x, tmp_re)
      }
  }
}

function FFT1D(dir: i8, y: u32, idxReal: u32, idxImag: u32): void {
  const nb_rows = WORLD_SIZE;
  const nb_rows_by_2 = nb_rows >> 1;
  let m = round(Math.log2(nb_rows) as f32);
  let x1: u32 = 0;
  for (let x: u32 = 0; x < nb_rows - 1; x++) {
      if (x < x1) {
          let tmp = get(idxReal, x, y);
          set(idxReal, x, y, get(idxReal, x1, y));
          set(idxReal, x1, y, tmp);

          tmp = get(idxImag, x, y);
          set(idxImag, x, y, get(idxImag, x1, y));
          set(idxImag, x1, y, tmp);
      }

      let x2 = nb_rows_by_2;
      while (x2 <= x1) {
          x1 -= x2;
          x2 >>= 1;
      }

      x1 += x2;
  }

  /* Compute the FFT */
  let c1: f32 = -1.0,
      c2: f32 = 0.0,
      l2: u32 = 1;
  for (let l: u32 = 0; l < m; l++) {
      let l1 = l2;
      l2 <<= 1;
      let u1: f32 = 1.0,
          u2: f32 = 0.0;
      for (let i: u32 = 0; i < l1; i++) {
          for (let x = i; x < nb_rows; x += l2) {
              let x2 = x + l1;
              let t1 = (u1 * get(idxReal, x2, y) - u2 * get(idxImag, x2, y)) as f32;
              let t2 = (u1 * get(idxImag, x2, y) + u2 * get(idxReal, x2, y)) as f32;
              set(idxReal, x2, y, get(idxReal, x, y) - t1);
              set(idxImag, x2, y, get(idxImag, x, y) - t2);
              set(idxReal, x, y, get(idxReal, x, y) + t1);
              set(idxImag, x, y, get(idxImag, x, y) + t2);
          }
          let z = u1 * c1 - u2 * c2;
          u2 = u1 * c2 + u2 * c1;
          u1 = z;
      }
      c2 = (Math.sqrt((1.0 - c1) / 2.0)) as f32;
      if (dir == 1) c2 = -c2;
      c1 = (Math.sqrt((1.0 + c1) / 2.0)) as f32;
  }

  /* Scaling for forward transform */
  if (dir == -1) {
      let scale_f = (1.0 / (nb_rows as f32)) as f32;
      for (let x: u32 = 0; x < nb_rows; x++) {
          set(idxReal, x, y, get(idxReal, x, y) * scale_f);
          set(idxImag, x, y, get(idxImag, x, y) * scale_f);
      }
  }
}

export function complexMatrixDot(
  leftsideIdxReal: u32,
  leftsideIdxImag: u32,
  rightsideIdxReal: u32,
  rightsideIdxImag: u32,
  outputIdxReal: u32,
  outputIdxImag: u32
): void {

  for (let i: u32 = 0; i < WORLD_SIZE; i++) {
      for (let j: u32 = 0; j < WORLD_SIZE; j++) {
        let x = j;
        let y = i;

        let a = get(leftsideIdxReal, x, y);
        let b = get(leftsideIdxImag, x, y);
        let c = get(rightsideIdxReal, x, y);
        let d = get(rightsideIdxImag, x, y);

        let t = a * (c + d);
        set(outputIdxReal, x, y, t - d * (a + b));
        set(outputIdxImag, x, y, t + c * (b - a));
      }
  }
}

function growthFn(gf_id: u32, gf_m: f32, gf_s: f32, x: f32): f32 {
  x = Math.abs(x - gf_m) as f32;
  x = x * x;

  let s_2: f32;
  let tmp: f32;
  switch (gf_id) {
      case 0:
          s_2 = 9 * gf_s * gf_s;
          tmp = Math.max(1 - x / s_2, 0) as f32
          return tmp ** 4 * 2 - 1;
      case 1:
          s_2 = 2 * gf_s * gf_s;
          tmp = Math.exp(-x / s_2) as f32
          return tmp * 2 - 1;
      case 2:
          s_2 = 2 * gf_s * gf_s;
          tmp = Math.exp(-x / s_2) as f32;
          return tmp;
      case 3:
          return (x <= gf_s ? 1 : 0) * 2 - 1;
  }
  return 0.
}


export function round(x: f32): u32 {
  return Math.round(x * PRECISION) / PRECISION as u32;
}