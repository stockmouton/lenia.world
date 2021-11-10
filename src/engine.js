/* eslint-disable */
window.leniaEngine = {}
window.leniaEngine.init = (WASMSource, WASMKey, metadata, zoom=1, fps=30) => {
    // Most problematic functions: FFT1D, transpose2D, complexMatrixDot
    // Those are problematic because they are called all the time

    /// ////////////////////////////
    // Globals
    /// ////////////////////////////
    let ADD_LENIA = false;
    let INIT_CELLS; 
    let INIT_CELLS_X = 0; 
    let INIT_CELLS_Y = 0;

    let CANVAS_CELLS = null;
    let RENDERING_CANVAS = null;
    const CANVAS_SCALING = 2. 
    
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
    
    let SCALE;
    let WORLD_SIZE = 1;
    let BUFFER_SIZE = 1;
    let PIXEL_SIZE = 1;
    let CANVAS_SIZE = 1;

    /// ////////////////////////////
    // Loader
    /// ////////////////////////////
    let exportsUpdateFn;
    function init(metadata, zoom, fps) {
        zoom = parseInt(Math.min(Math.max(zoom - 1, 0), 5), 10);
        PIXEL_SIZE = 1 << zoom;
        
        metadata.config.world_params.scale = parseInt(Math.min(Math.max(metadata.config.world_params.scale, 1), 4), 10);

        const memory = createWASMMemory(metadata.config.world_params.scale)
        const wasmConfig = {
            env: {
                memory
            },
            Math
        };
        wasmConfig[WASMKey] = {  // Name of the file
            GF_ID       : metadata.config.kernels_params[0].gf_id,
            GF_M        : metadata.config.kernels_params[0].m,
            GF_S        : metadata.config.kernels_params[0].s,
            T           : metadata.config.world_params.T,
        };
        // const module = WebAssembly.compile(WASMSource)
        WebAssembly.instantiate(WASMSource, wasmConfig)
            .then( ({ instance }) => {
                exports = instance.exports

                exportsUpdateFn = exports.updateFn
                const buffer = new Float32Array(memory.buffer);

                initWithProgressiveScaling(buffer, metadata, exports)

                update(buffer, fps);
                render(buffer, metadata.attributes)

                setListener(buffer)
            })
            .catch( (error) => {
                console.log(error);
            });
    }
    init(metadata, zoom, fps)

    function initWithProgressiveScaling(buffer, metadata, exports) {
        const {config} = metadata

        let {R} = config.world_params;

        SCALE = 1.
        const cellsSt = config.cells;
        let initCells = decompressArray(cellsSt);
        let initDone = false
        let {scale} = config.world_params
        while (scale > 1 || !initDone) {
            initDone = true
            const currentScale = Math.min(scale, 2.)

            setGlobals(SCALE * currentScale)
            exports.setWorldSize(WORLD_SIZE)

            R = Math.round(R * currentScale);
            setKernel(buffer, exports.FFT2D, R, config.kernels_params);

            const x1 = Math.floor(WORLD_SIZE / 2 - (initCells.shape[2] / 2) * currentScale);
            const y1 = Math.floor(WORLD_SIZE / 2 - (initCells.shape[1] / 2) * currentScale);
            const angle = 0;
            clearCells(buffer, 0)
            copyInitCells(buffer, initCells, x1, y1, currentScale, angle);

            const nbStepsForStabilization = 20;
            for (let index = 0; index < nbStepsForStabilization; index++) {
                buffer.copyWithin(
                    BUFFER_CELLS_IDX * BUFFER_SIZE, // dest
                    BUFFER_CELLS_OUT_IDX * BUFFER_SIZE,  // src
                    (BUFFER_CELLS_OUT_IDX + 1) * BUFFER_SIZE
                );
                exportsUpdateFn()
            }
            initCells = crop(buffer)
            scale /= currentScale
        }

        INIT_CELLS = initCells
    }

    function setListener(buffer){
        document.body.addEventListener("keydown", (e) => {
            if (e.keyCode == 32) {
                clearCells(buffer, 0);
            }
        });
        document.getElementById("RENDERING_CANVAS").addEventListener("click", onClick);
    }

    function decompressArray(string_cells) {
        const nbChars = ord("Z") - ord("A") + (ord("z") - ord("a")) + (ord("þ") - ord("À"));

        const string_array = string_cells.split("::");

        console.assert(
            string_array.length == 2 && string_array[0].length % 2 == 0
        );

        const max_val = nbChars ** 2 - 1;
        const raw_shape = string_array[1].split(";");
        const cells_shape = [];
        for (let index = 0; index < raw_shape.length; index++) {
            cells_shape.push(parseInt(raw_shape[index], 10));
        }
        const cells_val_l = [];
        for (let index = 0; index < string_array[0].length; index += 2) {
            const val_i = ch2val(
                string_array[0][index] + string_array[0][index + 1],
                nbChars
            );
            const val_f = val_i / max_val;
            cells_val_l.push(val_f);
        }
        const cellsMat = createMat(cells_val_l, cells_shape);

        return cellsMat;
    }

    function ch2val(c, nbChars) {
        console.assert(c.length == 2);

        const first_char = c[0];
        const second_char = c[1];

        let first_char_idx;
        let second_char_idx;
        if (ord(first_char) >= ord("À")) {
            first_char_idx =
                ord(first_char) -
                ord("À") +
                (ord("Z") - ord("A")) +
                (ord("z") - ord("a"));
        } else if (ord(first_char) >= ord("a")) {
            first_char_idx = ord(first_char) - ord("a") + (ord("Z") - ord("A"));
        } else {
            first_char_idx = ord(first_char) - ord("A");
        }

        if (ord(second_char) >= ord("À")) {
            second_char_idx =
                ord(second_char) -
                ord("À") +
                (ord("Z") - ord("A")) +
                (ord("z") - ord("a"));
        } else if (ord(second_char) >= ord("a")) {
            second_char_idx =
                ord(second_char) - ord("a") + (ord("Z") - ord("A"));
        } else {
            second_char_idx = ord(second_char) - ord("A");
        }

        return first_char_idx * nbChars + second_char_idx;
    }

    function createMat(flat_data, shape) {
        console.assert(shape.length == 3);

        const nb_channels = shape[0];
        const nb_rows = shape[1];
        const nb_cols = shape[2];

        const arr = new Array(nb_channels);
        for (let i = 0; i < nb_channels; i++) {
            const channel = new Array(nb_rows);
            for (let j = 0; j < nb_rows; j++) {
                const row = new Float32Array(nb_cols);
                for (let k = 0; k < nb_cols; k++) {
                    row[k] =
                        flat_data[i * (nb_rows + nb_cols) + j * nb_cols + k];
                }
                channel[j] = row;
            }
            arr[i] = channel;
        }

        const arr_data = {
            arr,
            shape,
        };
        return arr_data;
    }

    function createDataArray(world_size) {
        const arr = Array(world_size);
        for (let i = 0; i < world_size; i++)
            arr[i] = new Float32Array(world_size).fill(0);
        return arr;
    }

    function InitCanvas(id, canvas_size) {
        let canvas;
        if (id == null){
            canvas = document.createElement('canvas');
        } else {
            canvas = document.getElementById(id);
        }
        canvas.width = canvas.height = canvas_size;
        const ctx = canvas.getContext("2d");
        const img = ctx.createImageData(canvas.width, canvas.height);
        const rect = canvas.getBoundingClientRect();

        return {
            can: canvas,
            ctx,
            img,
            left: rect.left,
            top: rect.top,
        };
    }

    function copyInitCells(buffer, newCells, x1, y1, scale, angle) {
        const arr = newCells.arr[0];
        const h = newCells.shape[1];
        const w = newCells.shape[2];

        const sin = Math.sin((angle / 180) * Math.PI);
        const cos = Math.cos((angle / 180) * Math.PI);
        const fh = (Math.abs(h * cos) + Math.abs(w * sin) + 1) * scale - 1;
        const fw = (Math.abs(w * cos) + Math.abs(h * sin) + 1) * scale - 1;
        for (let fi = 0; fi < fh; fi++) {
            for (let fj = 0; fj < fw; fj++) {
                const i = Math.round(
                    (-(fj - fw / 2) * sin + (fi - fh / 2) * cos) / scale + h / 2
                );
                const j = Math.round(
                    (+(fj - fw / 2) * cos + (fi - fh / 2) * sin) / scale + w / 2
                );
                const x = Mod(fj + x1, WORLD_SIZE);
                const y = Mod(fi + y1, WORLD_SIZE);

                const inBounds = (i >= 0 && j >= 0 && i < h && j < arr[i].length)
                const c = inBounds ? arr[i][j] : 0.;
                if (c > 0) {
                    buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + y * WORLD_SIZE + x] = c
                };
            }
        }
    }

    /// ////////////////////////////
    // Renderer
    /// ////////////////////////////
    function update(buffer, fps) {
        (function loop() {
            setTimeout(loop, 1000 / fps);
            
            buffer.copyWithin(
                BUFFER_CELLS_IDX * BUFFER_SIZE, // dest
                BUFFER_CELLS_OUT_IDX * BUFFER_SIZE,  // src
                (BUFFER_CELLS_OUT_IDX + 1) * BUFFER_SIZE
            );
            exportsUpdateFn()

            if (ADD_LENIA) {
                const x1 = Math.floor(
                    INIT_CELLS_X / PIXEL_SIZE - (INIT_CELLS.shape[2] / 2)
                );
                const y1 = Math.floor(
                    INIT_CELLS_Y / PIXEL_SIZE - (INIT_CELLS.shape[1] / 2)
                );
                copyInitCells(buffer, INIT_CELLS, x1, y1, 1, 0);

                ADD_LENIA = false;
            }
        })();
    }

    function render(buffer, attributes) {
        let colorName;
        for (let index = 0; index < attributes.length; index++) {
            const attribute = attributes[index];
            if (attribute.trait_type === "Colormap") {
                colorName = attribute.value
                    .trim()
                    .toLocaleLowerCase()
                    .replace(" ", "-");
            }
        }
        (function loop() {
            window.requestAnimationFrame(loop);
            DrawArray(CANVAS_CELLS, buffer, 1, colorName);
        })();
    }

    function DrawArray(canvas, buffer, max_val, colorName) {
        const nb_colors = COLORS[colorName].length;
        const imgData = canvas.img.data;

        let p = 0;
        let rgba;
        for (let i = 0; i < CANVAS_SIZE; i++) {
            const ii = Math.floor(i / PIXEL_SIZE);
            for (let j = 0; j < CANVAS_SIZE; j++) {
                const jj = Math.floor(j / PIXEL_SIZE);
                const outBufPos = BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + ii * WORLD_SIZE + jj;

                const v = buffer[outBufPos] * max_val;
                let c = Math.floor(v * nb_colors);
                c = Math.max(c, 0);
                c = Math.min(c, nb_colors - 1);
                rgba = COLORS[colorName][c];

                for (let n = 0; n < 3; n++) {
                    imgData[p++] = rgba[n];
                }
                imgData[p++] = 255;
            }
        }
        canvas.ctx.putImageData(canvas.img, 0, 0);

        RENDERING_CANVAS.ctx.drawImage(canvas.can, 0, 0);
    }

    /// ////////////////////////////
    // Kernels
    /// ////////////////////////////
    function setKernel(buffer, fft2dFn, R, kernels_params) {
        const {k_id} = kernels_params[0];
        const k_q = kernels_params[0].q;
        const k_r = kernels_params[0].r;
        const tmp_bs = kernels_params[0].b;
        let bs;

        const kernelRe = createDataArray(WORLD_SIZE);
        if (typeof tmp_bs === "string") {
            bs = [];
            const tmp_bs_arr = tmp_bs.split(",");
            for (let index = 0; index < tmp_bs_arr.length; index++) {
                const split = tmp_bs_arr[index].split("/");
                if (split.length == 2) {
                    bs.push(parseInt(split[0], 10) / parseInt(split[1], 10));
                } else {
                    bs.push(parseFloat(split[0]));
                }
            }
        } else {
            bs = kernels_params[0].b;
        }

        let weight = 0.0;
        const world_size_center = WORLD_SIZE / 2;
        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                let ii =
                    ((i + world_size_center) % WORLD_SIZE) - world_size_center;
                let jj =
                    ((j + world_size_center) % WORLD_SIZE) - world_size_center;
                const r = Math.sqrt(ii * ii + jj * jj) / R;
                const v = kernelShell(k_id, k_q, bs, k_r, r);
                weight += v;
                kernelRe[i][j] = v;
                ii = WORLD_SIZE - ((i + WORLD_SIZE / 2) % WORLD_SIZE) - 1;
                jj = (j + WORLD_SIZE / 2) % WORLD_SIZE;
            }
        }

        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                kernelRe[i][j] /= weight;
            }
        }

        
        for (let rowIdx = 0; rowIdx < WORLD_SIZE; rowIdx++) {
            buffer.set(kernelRe[rowIdx], BUFFER_KERNEL_REAL_IDX * BUFFER_SIZE + rowIdx * WORLD_SIZE);
            const tmpArr = new Float32Array(WORLD_SIZE).fill(0)
            buffer.set(tmpArr, BUFFER_KERNEL_IMAG_IDX * BUFFER_SIZE + rowIdx * WORLD_SIZE);
        }
        fft2dFn(1, BUFFER_KERNEL_REAL_IDX, BUFFER_KERNEL_IMAG_IDX)
    }

    function kernelShell(k_id, k_q, bs, k_r, dist) {
        const nb_b = bs.length;
        const b_dist = nb_b * dist;
        const b_threshold =
            bs[Math.min(parseInt(Math.floor(b_dist), 10), nb_b - 1)];

        const k_val = (dist < 1) * kernelFn(k_id, k_q, b_dist % 1) * b_threshold;

        return k_val;
    }

    function kernelFn(k_id, k_q, x) {
        let out;
        switch (k_id) {
            case 0:
                return (4 * x * (1 - x)) ** k_q;
            case 1:
                out = k_q - 1 / (x * (1 - x));
                return Math.exp(k_q * out);
            case 2:
                return x >= k_q && x <= 1 - k_q ? 1 : 0;
            case 3:
                return (x >= k_q && x <= 1 - k_q ? 1 : 0) + (x < k_q) * 0.5;
            case 4:
                out = ((x - k_q) / (0.3 * k_q)) ** 2;
                return Math.exp(-out / 2);
        }
    }

    /// ////////////////////////
    // Math
    /// ////////////////////////
    function Mod(x, n) {
        return ((x % n) + n) % n;
    }
    function Random() {
        return genrand_real2();
    }
    function RandomInt(min, max) {
        return Math.floor(Random() * (max + 1 - min) + min);
    }

    /// ////////////////////////
    // Utils
    /// ////////////////////////
    function setGlobals(scale) {
        SCALE = parseInt(Math.min(Math.max(scale, 1), 4), 10);
        WORLD_SIZE = computeWorldSize(SCALE);
        BUFFER_SIZE = WORLD_SIZE**2;
        CANVAS_SIZE = Math.round(WORLD_SIZE * PIXEL_SIZE);

        CANVAS_CELLS = InitCanvas(null, CANVAS_SIZE);
        RENDERING_CANVAS = InitCanvas("RENDERING_CANVAS", CANVAS_SIZE * CANVAS_SCALING)
        RENDERING_CANVAS.ctx.scale(CANVAS_SCALING, CANVAS_SCALING)
    }

    function createWASMMemory(scale){
        const worldSize = computeWorldSize(scale)
        const bufferSize = worldSize**2

        const nb_buffers = 9 + 1; // 9 image buffers + 1 table buffer
        const byteSize = (bufferSize * nb_buffers) << 2;
        const nb_pages = ((byteSize + 0xffff) & ~0xffff) >>> 16;
        // Shared memory does not work on Safari
        // Shared memory are needed for workers
        // but you need some fancy CORS configuration to make it work.
        // Overall, it's probably better to look at GPU support.
        return new WebAssembly.Memory({
            initial: nb_pages,
            // maximum: nb_pages,
            // shared: true
        });
    }
    
    function computeWorldSize(scale) {
        let size_power2;
        if (scale <= 1) {
            size_power2 = 7;
        } else if (scale <= 2) {
            size_power2 = 8;
        } else {
            size_power2 = 9;
        }

        return 1 << size_power2
    }

    function ord(letter) {
        return letter.charCodeAt(0);
    }

    function chr(code) {
        return String.fromCharCode(code);
    }

    function clearCells(buffer, x) {
        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + i * WORLD_SIZE + j] = x;
            }
        }
    }

    function crop(buffer){
        const bounds = {'x': WORLD_SIZE, 'y': WORLD_SIZE, 'xm': 0, 'ym': 0}
        for (let y = 0; y < WORLD_SIZE; y++) {
            for (let x = 0; x < WORLD_SIZE; x++) {
                const v = buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + y * WORLD_SIZE + x]
                if(v > 0) {
                    bounds.x = Math.min(x, bounds.x)
                    bounds.y = Math.min(y, bounds.y)
                    bounds.xm = Math.max(x, bounds.xm)
                    bounds.ym = Math.max(y, bounds.ym)
                }
            }
        }
        const cells = {
            "arr": [[]],
            "shape": [1, bounds.ym - bounds.y, bounds.xm - bounds.x]
        } 

        for (let {y} = bounds; y < bounds.ym; y++) {
            const subarray = new Float32Array(cells.shape[2])
            for (let {x} = bounds, i = 0; x < bounds.xm; x++, i++) {
                subarray[i] = buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + y * WORLD_SIZE + x]
            }
            cells.arr[0].push(subarray)
        }
        
        return cells
    }

    function onClick(e) {
        const rect = e.target.getBoundingClientRect();
        INIT_CELLS_X = (e.clientX - rect.left) / CANVAS_SCALING; // x position within the element.
        INIT_CELLS_Y = (e.clientY - rect.top) / CANVAS_SCALING;  // y position within the element.
        ADD_LENIA = true;
    }

    /// ////////////////////////
    // Colors
    /// ////////////////////////
    const COLORS = {
        alizarin: hex_to_palette_rgba("d6c3c9", [
            "f9c784",
            "e7e7e7",
            "485696",
            "19180a",
            "3f220f",
            "772014",
            "af4319",
            "e71d36",
        ]),
        "black-white": hex_to_palette_rgba("000000", [
            "1f2123",
            "393b41",
            "555860",
            "737780",
            "9497a1",
            "b6b9c1",
            "d9dbe1",
            "ffffff",
        ]),
        "carmine-blue": hex_to_palette_rgba("#006eb8", [
            "#006eb8",
            "#fff200",
            "#cc1236",
        ]),
        cinnamon: hex_to_palette_rgba("#a7d4e4", [
            "#a7d4e4",
            "#71502f",
            "#fdc57e",
        ]),
        city: hex_to_palette_rgba("F93943", [
            "23005c",
            "3a0099",
            "66daff",
            "e6f9ff",
            "004b63",
            "ffca66",
            "fff6e6",
            "ffa600",
        ]),
        golden: hex_to_palette_rgba("#b6bfc1", [
            "#b6bfc1",
            "#253122",
            "#f3a257",
        ]),
        laurel: hex_to_palette_rgba("381d2a", [
            "60b9bf",
            "bffbff",
            "96ff80",
            "eaffe6",
            "71bf60",
            "ff80b0",
            "ffe6ef",
            "ffbfd7",
        ]),
        msdos: hex_to_palette_rgba("#0c0786", [
            "#0c0786",
            "#7500a8",
            "#c03b80",
            "#f79241",
            "#fcfea4",
        ]),
        "pink-beach": hex_to_palette_rgba("f4777f", [
            "93003a",
            "cf3759",
            "ffbcaf",
            "ffffe0",
            "a5d5d8",
            "73a2c6",
            "4771b2",
            "00429d",
        ]),
        rainbow: hex_to_palette_rgba("#000000", [
            "#FF0000",
            "#FF7F00",
            "#FFFF00",
            "#00FF00",
            "#0000FF",
            "#2E2B5F",
            "#8B00FF",
        ]),
        "river-leaf": hex_to_palette_rgba("80ab82", [
            "7dcd85",
            "c5d6d8",
            "99f7ab",
            "2f52e0",
            "bced09",
            "f9cb40",
            "ff715b",
            "4c5b5c",
        ]),
        salvia: hex_to_palette_rgba("#b6bfc1", [
            "#b6bfc1",
            "#051230",
            "#97acc8",
        ]),
        summer: hex_to_palette_rgba("ffe000", [
            "ffbf66",
            "fff4e6",
            "995900",
            "ff9400",
            "6695ff",
            "e6edff",
            "002577",
            "003dc7",
        ]),
        "white-black": hex_to_palette_rgba("#ffffff", ["#ffffff", "#000000"]),
    };

    function hex_to_palette_rgba(hex_bg_color, hex_colors) {
        const steps = Math.floor(254 / (hex_colors.length - 1));
        let palette_rgb_uint8 = [];
        for (let i = 0; i < hex_colors.length - 1; i++) {
            const rgb1_uint8 = hex_to_rgba_uint8(hex_colors[i]).slice(0, 3);
            const rgb2_uint8 = hex_to_rgba_uint8(hex_colors[i + 1]).slice(0, 3);

            const colors_list = perceptualSteps(rgb1_uint8, rgb2_uint8, steps);
            palette_rgb_uint8 = palette_rgb_uint8.concat(colors_list);
        }
        let bg_rgba_uint8;
        if (hex_bg_color === "") {
            bg_rgba_uint8 = [0, 0, 0, 0];
        } else {
            bg_rgba_uint8 = hex_to_rgba_uint8(hex_bg_color);
        }
        const bg_rgb_uint8 = bg_rgba_uint8.splice(0, 3);
        palette_rgb_uint8.unshift(bg_rgb_uint8);

        return palette_rgb_uint8;
    }

    function hex_to_rgba_uint8(hex) {
        hex = hex.replace("#", "");

        rgbaList = [];
        [0, 2, 4].forEach((i) => {
            const hexColor = hex.substring(i, i + 2);
            rgbaList.push(parseInt(hexColor, 16));
        });
        rgbaList.push(255);

        return rgbaList;
    }

    function perceptualSteps(color1, color2, steps) {
        const gamma = 0.43;

        const rgbFloat1 = fromSRGB(color1);
        const bright1 = bright(rgbFloat1, gamma);
        const rgbFloat2 = fromSRGB(color2);
        const bright2 = bright(rgbFloat2, gamma);

        const colors = [];
        for (let step = 0; step < steps; step++) {
            const intensity =
                lerp(bright1, bright2, step / steps) ** (1 / gamma);
            let color = lerp(rgbFloat1, rgbFloat2, step / steps);

            let colorSum = 0;
            for (let i = 0; i < color.length; i++) {
                colorSum += color[i];
            }
            if (colorSum !== 0) {
                const tmpColor = [];
                for (let i = 0; i < color.length; i++) {
                    const c = color[i];
                    tmpColor.push((c * intensity) / colorSum);
                }
                color = tmpColor;
            }
            color = toSRGB(color);
            colors.push(color);
        }

        return colors;
    }

    function lerp(colors1, colors2, frac) {
        if (colors1 instanceof Array) {
            const colors = [];
            for (let i = 0; i < colors1.length; i++) {
                const color1 = colors1[i];
                const color2 = colors2[i];
                colors.push(color1 * (1 - frac) + color2 * frac);
            }
            return colors;
        } 
            return colors1 * (1 - frac) + colors2 * frac;
        
    }

    function fromSRGB(rgbUINT8) {
        const rgbFloat = [];
        for (let i = 0; i < rgbUINT8.length; i++) {
            const x = rgbUINT8[i];
            const x_f = x / 255.0;
            let y;
            if (x_f <= 0.04045) {
                y = x_f / 12.92;
            } else {
                y = ((x_f + 0.055) / 1.055) ** 2.4;
            }

            rgbFloat.push(y);
        }

        return rgbFloat;
    }

    function toSRGBFloat(x) {
        if (x <= 0.0031308) {
            x = 12.92 * x;
        } else {
            x = 1.055 * x ** (1 / 2.4) - 0.055;
        }
        return x;
    }

    function toSRGB(rgb) {
        const rgbUINT8 = [];
        for (let i = 0; i < rgb.length; i++) {
            const c = rgb[i];
            rgbUINT8.push(parseInt(255.9999 * toSRGBFloat(c), 10));
        }
        return rgbUINT8;
    }

    function bright(rgbFloat, gamma) {
        let sum = 0;
        for (let i = 0; i < rgbFloat.length; i++) {
            sum += rgbFloat[i];
        }

        return sum ** gamma;
    }

    /// ////////////////////////
    // Setting public functions
    /// ////////////////////////
    
};
