// Configuration imported from JS
declare const WORLD_SIZE: u32;
declare const GF_ID: u32;
declare const GF_M: f32;
declare const GF_S: f32;
declare const T: f32;

const BUFFER_CELLS_IDX = 0;
const BUFFER_CELLS_OLD_IDX = 1;
const BUFFER_CELLS_IMAG_IDX = 2;
const BUFFER_FIELD_IDX = 3;
const BUFFER_POTENTIAL_REAL_IDX = 4;
const BUFFER_POTENTIAL_IMAG_IDX = 5;
const BUFFER_KERNEL_REAL_IDX = 6;
const BUFFER_KERNEL_IMAG_IDX = 7;
const BUFFER_CELLS_OUT_IDX = 8;
const BUFFER_TABLES_IDX = 9;

const BUFFER_COS_TABLE_IDX = 0;
const BUFFER_SIN_TABLE_IDX = 1;
const BUFFER_RBITS_TABLE_IDX = 2;

// Trigonometric tables
for (let i: u32 = 0; i < WORLD_SIZE / 2; i++) {
  let i_pi_2 = 2. * Math.PI * i;
  let cos: f32 = Math.cos(i_pi_2 / WORLD_SIZE) as f32;
  let sin: f32 = Math.sin(i_pi_2 / WORLD_SIZE) as f32;
  set(BUFFER_TABLES_IDX, i, BUFFER_COS_TABLE_IDX, cos);
  set(BUFFER_TABLES_IDX, i, BUFFER_SIN_TABLE_IDX, sin);
}

let WORLD_SIZE_LOG_2: u32 = 0;
for (let i: u32 = 0; i < 32; i++) {
  if (1 << i == WORLD_SIZE){
    WORLD_SIZE_LOG_2 = i;  
  }
}

// reverse bits table
for (let i: u32 = 0; i < WORLD_SIZE; i++) {
  let rbitIdx = reverseBits(i, WORLD_SIZE_LOG_2) as f32;
  set(BUFFER_TABLES_IDX, i, BUFFER_RBITS_TABLE_IDX, rbitIdx);
}

@inline
function get(idx: u32, x: u32, y: u32): f32 {
  return load<f32>((idx * WORLD_SIZE**2 + y * WORLD_SIZE + x) << 2);
}

@inline
function set(idx: u32, x: u32, y: u32, v: f32): void {
  store<f32>((idx * WORLD_SIZE**2 + y * WORLD_SIZE + x) << 2, v);
}

/** Performs one step. Called about 30 times a second from JS. */
export function updateFn(): void {
  memory.copy((BUFFER_CELLS_OLD_IDX * WORLD_SIZE**2) << 2, (BUFFER_CELLS_IDX * WORLD_SIZE**2) << 2, WORLD_SIZE**2 << 2)
  memory.fill((BUFFER_CELLS_IMAG_IDX * WORLD_SIZE**2) << 2, 0, WORLD_SIZE**2 << 2)

  // Change cells inplace
  applyKernel()

  for (let y: u32 = 0; y < WORLD_SIZE; y++) {
      for (let x: u32 = 0; x < WORLD_SIZE; x++) {
          let p = get(BUFFER_POTENTIAL_REAL_IDX, x, y);
          let g = growthFn(GF_ID, GF_M, GF_S, p);
          set(BUFFER_FIELD_IDX, x, y, g)
          let v = get(BUFFER_CELLS_OLD_IDX, x, y) + g / T;

          // Clip
          if (v < 0.) {
            v = 0.;
          } else if (v > 1.) {
            v = 1.
          };

          set(BUFFER_CELLS_OUT_IDX, x, y, v)
      }
  }
}

function applyKernel(): void {
  // f * g = F-1( F(f) dot F(g) )
  FFT2D(1, BUFFER_CELLS_IDX, BUFFER_CELLS_IMAG_IDX);
  complexMatrixDot(
    BUFFER_CELLS_IDX,
    BUFFER_CELLS_IMAG_IDX,
    BUFFER_KERNEL_REAL_IDX,
    BUFFER_KERNEL_IMAG_IDX,
    BUFFER_POTENTIAL_REAL_IDX,
    BUFFER_POTENTIAL_IMAG_IDX
  );
  FFT2D(-1, BUFFER_POTENTIAL_REAL_IDX, BUFFER_POTENTIAL_IMAG_IDX);
}  

export function FFT2D(dir: i8, idxReal: u32, idxImag: u32): void {
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
  for (let y: u32 = 0; y < WORLD_SIZE; y++) {
      for (let x: u32 = 0; x < y; x++) {
          const tmp_re = get(idx, x, y);
          set(idx, x, y, get(idx, y, x))
          set(idx, y, x, tmp_re)
      }
  }
}

function FFT1D(dir: i8, y: u32, idxReal: u32, idxImag: u32): void {
  /* Compute the FFT */
  if (dir == -1){
    FFT1DRadix2(y, idxReal, idxImag)

    let scale_f: f32 = (1.0 / (WORLD_SIZE as f32));
    for (let x: u32 = 0; x < WORLD_SIZE; x++) {
      set(idxReal, x, y, get(idxReal, x, y) * scale_f);
      set(idxImag, x, y, get(idxImag, x, y) * scale_f);
    }
  } else {
    FFT1DRadix2(y, idxImag, idxReal)
  }

}

function FFT1DRadix2(y: u32, idxReal: u32, idxImag: u32): void {
  for (let x: u32 = 0; x < WORLD_SIZE; x++) {
		let x1 = get(BUFFER_TABLES_IDX, x, BUFFER_RBITS_TABLE_IDX) as u32;
		if (x1 > x) {
			let tmp = get(idxReal, x, y);
      set(idxReal, x, y, get(idxReal, x1, y));
      set(idxReal, x1, y, tmp);

      tmp = get(idxImag, x, y);
      set(idxImag, x, y, get(idxImag, x1, y));
      set(idxImag, x1, y, tmp);
		}
	}

	// Cooley-Tukey decimation-in-time radix-2 FFT
	for (let size: u32 = 2; size <= WORLD_SIZE; size *= 2) {
		let halfsize = size / 2;
		let tablestep = WORLD_SIZE / size;
		for (let i: u32 = 0; i < WORLD_SIZE; i += size) {
			for (let x: u32 = i, k = 0; x < i + halfsize; x++, k += tablestep) {
				let x2 = x + halfsize;
				let tpre =  get(idxReal, x2, y) * get(BUFFER_TABLES_IDX, k, 0) + get(idxImag, x2, y) * get(BUFFER_TABLES_IDX, k, 1);
				let tpim = -get(idxReal, x2, y) * get(BUFFER_TABLES_IDX, k, 1) + get(idxImag, x2, y) * get(BUFFER_TABLES_IDX, k, 0);
				set(idxReal, x2, y, get(idxReal, x, y) - tpre);
				set(idxImag, x2, y, get(idxImag, x, y) - tpim);
				set(idxReal, x, y, get(idxReal, x, y) + tpre);
        set(idxImag, x, y, get(idxImag, x, y) + tpim);
			}
		}
	}
}

function reverseBits(val: u32, width: u32): u32 {
  var result = 0;
  for (var i: u32 = 0; i < width; i++) {
    result = (result << 1) | (val & 1);
    val >>>= 1;
  }
  return result;
}

function complexMatrixDot(
  leftsideIdxReal: u32,
  leftsideIdxImag: u32,
  rightsideIdxReal: u32,
  rightsideIdxImag: u32,
  outputIdxReal: u32,
  outputIdxImag: u32
): void {

  for (let y: u32 = 0; y < WORLD_SIZE; y++) {
      for (let x: u32 = 0; x < WORLD_SIZE; x++) {
        let ls_r = get(leftsideIdxReal, x, y);
        let ls_i = get(leftsideIdxImag, x, y);
        let rs_r = get(rightsideIdxReal, x, y);
        let rs_i = get(rightsideIdxImag, x, y);

        let t0 = ls_r * (rs_r + rs_i);
        let t1 = rs_i * (ls_r + ls_i)
        let t2 = rs_r * (ls_i - ls_r)

        let o_r = t0 - t1;
        let o_i = t0 + t2;

        set(outputIdxReal, x, y, o_r);
        set(outputIdxImag, x, y, o_i);
      }
  }
}

function growthFn(gf_id: u32, gf_m: f32, gf_s: f32, x: f32): f32 {
  x = abs(x - gf_m) as f32;
  x = x * x;

  let s_2: f32;
  let tmp: f32;
  switch (gf_id) {
      case 0:
          s_2 = 9 * gf_s * gf_s;
          tmp = (max(1. - x / s_2, 0) ** 4) as f32
          return tmp * 2. - 1.;
      case 1:
          s_2 = 2 * gf_s * gf_s;
          tmp = Math.exp(-x / s_2) as f32
          return tmp * 2. - 1.;
      case 2:
          s_2 = 2. * gf_s * gf_s;
          tmp = Math.exp(-x / s_2) as f32;
          return tmp;
      case 3:
          return (x <= gf_s ? 1. : 0.) * 2. - 1.;
  }
  return 0.
}