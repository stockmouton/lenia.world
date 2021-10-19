(() => {
    // Most problematic functions: FFT1D, transpose2D, complexMatrixDot
    // Those are problematic because they are called all the time

    ///////////////////////////////
    // Globals
    ///////////////////////////////
    const NB_CHARS =
        ord("Z") - ord("A") + (ord("z") - ord("a")) + (ord("þ") - ord("À"));
    const PRECISION = 1000000;
    const EPSILON = 1 / PRECISION; // machine epsilon
    const π = Math.PI;
    let R = 13;
    let T = 10;

    let gf_id = 0;
    let gf_m = 0.14;
    let gf_s = 0.015;

    let ADD_LENIA = false;
    let INIT_CELLS; let INIT_CELLS_X = 0; let INIT_CELLS_Y = 0;
    let SCALE;
    let ZOOM;

    let cells = null;
    let cellsIm = null;

    let kernelRe = null;
    let kernelIm = null;

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

    let WORLD_SIZE = 1;
    let BUFFER_SIZE = 1;
    let PIXEL = 1;
    let CANVAS_SIZE = 1;
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
        "river-Leaf": hex_to_palette_rgba("80ab82", [
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
    let colorName = "msdos";

    ///////////////////////////////
    // Loader
    ///////////////////////////////
    let roundFn;
    let exportsUpdateFn;
    function init(metadata, zoom=1, fps=30) {
        ZOOM = parseInt(Math.min(Math.max(zoom, 1), 5), 10);

        let scale = metadata["config"]["world_params"]["scale"];
        SCALE = parseInt(Math.min(Math.max(scale, 1), 4), 10);
        let size_power2;
        if (SCALE <= 1) {
            size_power2 = 7;
        } else if (SCALE <= 2) {
            size_power2 = 8;
        } else {
            size_power2 = 9;
        }
        resizeAll(size_power2, ZOOM - 1);

        BUFFER_SIZE = WORLD_SIZE**2
        nb_buffers = 9 + 1; // 9 image buffers + 1 table buffer
        const byteSize = (BUFFER_SIZE * nb_buffers) << 2;
        const nb_pages = ((byteSize + 0xffff) & ~0xffff) >>> 16;
        // Shared memory does not work on Safari
        // Shared memory are needed for workers
        // but you need some fancy CORS configuration to make it work.
        // Overall, it's probably better to look at GPU support.
        const memory = new WebAssembly.Memory({
            initial: nb_pages,
            // maximum: nb_pages,
            // shared: true
        });
        const wasmConfig = {
            env: {
                memory
            },
            engine: {  // Name of the file
                WORLD_SIZE  : WORLD_SIZE,
                GF_ID       : gf_id,
                GF_M        : gf_m,
                GF_S        : gf_s,
                T           : T,
            },
            Math
        };
        const wasmFilename = '/optimized.wasm';
        WebAssembly.instantiateStreaming(fetch(wasmFilename), wasmConfig)
        // WebAssembly.instantiateStreaming(fetch('untouched.wasm'), wasmConfig)
            .then( ({ instance }) => {
                exports = instance.exports

                roundFn = exports.round
                exportsUpdateFn = exports.updateFn
                let buffer = new Float32Array(memory.buffer);

                initWithProgressiveScaling(metadata, buffer, exports)

                update(buffer, fps);
                render(buffer)

                setListener(buffer)
            })
            .catch( (error) => {
                console.log(error);
            });
    }

    function initWithProgressiveScaling(metadata, buffer, exports) {
        const config = metadata["config"]
        const attributes = metadata["attributes"]

        setParameters(config["world_params"], config["kernels_params"], attributes);

        let cellsSt = config["cells"];
        let initCells = decompressArray(cellsSt);
        let initDone = false
        while (SCALE > 1 || !initDone) {
            initDone = true
            let currentScale = Math.min(SCALE, 2.)
        
            if (SCALE != 1) {
                R = Math.round(Bound(R * currentScale, 2, WORLD_SIZE));
            }
            setKernel(buffer, exports.FFT2D, config["kernels_params"]);
            let x1 = Math.floor(WORLD_SIZE / 2 - (initCells.shape[2] / 2) * SCALE);
            let y1 = Math.floor(WORLD_SIZE / 2 - (initCells.shape[1] / 2) * SCALE);
            const angle = 0;
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
            SCALE /= currentScale
        }

        INIT_CELLS = initCells
    }

    function setListener(buffer){
        document.body.addEventListener("keydown", (e) => {
            if (e.keyCode == 32) {
                ClearCells(buffer, 0);
            }
        });
        document.getElementById("RENDERING_CANVAS").addEventListener("click", onClick);
    }

    function crop(buffer){
        let bounds = {'x': WORLD_SIZE, 'y': WORLD_SIZE, 'xm': 0, 'ym': 0}
        for (let y = 0; y < WORLD_SIZE; y++) {
            for (let x = 0; x < WORLD_SIZE; x++) {
                let v = buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + y * WORLD_SIZE + x]
                if(v > 0) {
                    bounds.x = Math.min(x, bounds.x)
                    bounds.y = Math.min(y, bounds.y)
                    bounds.xm = Math.max(x, bounds.xm)
                    bounds.ym = Math.max(y, bounds.ym)
                }
            }
        }
        let cells = {
            "arr": [[]],
            "shape": [1, bounds.ym - bounds.y, bounds.xm - bounds.x]
        } 

        for (let y = bounds.y; y < bounds.ym; y++) {
            let subarray = new Float32Array(cells.shape[2])
            for (let x = bounds.x, i = 0; x < bounds.xm; x++, i++) {
                subarray[i] = buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + y * WORLD_SIZE + x]
            }
            cells.arr[0].push(subarray)
        }
        
        return cells
    }

    function decompressArray(string_cells) {
        let string_array = string_cells.split("::");

        console.assert(
            string_array.length == 2 && string_array[0].length % 2 == 0
        );

        let max_val = NB_CHARS ** 2 - 1;
        let raw_shape = string_array[1].split(";");
        let cells_shape = [];
        for (let index = 0; index < raw_shape.length; index++) {
            cells_shape.push(parseInt(raw_shape[index], 10));
        }
        let cells_val_l = [];
        for (let index = 0; index < string_array[0].length; index += 2) {
            let val_i = ch2val(
                string_array[0][index] + string_array[0][index + 1]
            );
            let val_f = val_i / max_val;
            cells_val_l.push(val_f);
        }
        let cellsMat = createArray(cells_val_l, cells_shape);

        return cellsMat;
    }

    function ch2val(c) {
        console.assert(c.length == 2);

        let first_char = c[0];
        let second_char = c[1];

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

        return first_char_idx * NB_CHARS + second_char_idx;
    }

    function createArray(flat_data, shape) {
        console.assert(shape.length == 3);

        let nb_channels = shape[0];
        let nb_rows = shape[1];
        let nb_cols = shape[2];

        let arr = new Array(nb_channels);
        for (let i = 0; i < nb_channels; i++) {
            let channel = new Array(nb_rows);
            for (let j = 0; j < nb_rows; j++) {
                let row = new Array(nb_cols);
                for (let k = 0; k < nb_cols; k++) {
                    row[k] =
                        flat_data[i * (nb_rows + nb_cols) + j * nb_cols + k];
                }
                channel[j] = row;
            }
            arr[i] = channel;
        }

        let arr_data = {
            arr: arr,
            shape: shape,
        };
        return arr_data;
    }

    function setParameters(leniax_world_params, kernels_params, attributes) {
        for (let index = 0; index < attributes.length; index++) {
            const attribute = attributes[index];
            if (attribute["trait_type"] === "Colormap") {
                colorName = attribute["value"]
                    .trim()
                    .toLocaleLowerCase()
                    .replace(" ", "-");
            }
        }

        R = leniax_world_params["R"];
        T = leniax_world_params["T"];

        gf_id = kernels_params[0]["gf_id"];
        gf_m = kernels_params[0]["m"];
        gf_s = kernels_params[0]["s"];
    }

    function resizeAll(size_power2, zoom_power2=0) {
        WORLD_SIZE = 1 << size_power2;
        PIXEL = 1 << zoom_power2;
        CANVAS_SIZE = Math.round(WORLD_SIZE * PIXEL);

        InitAllArrays(WORLD_SIZE);
        CANVAS_CELLS = InitCanvas(null, CANVAS_SIZE);
        RENDERING_CANVAS = InitCanvas("RENDERING_CANVAS", CANVAS_SIZE * CANVAS_SCALING)
        RENDERING_CANVAS.ctx.scale(CANVAS_SCALING, CANVAS_SCALING)
    }

    function InitAllArrays(world_size) {
        cells = null;
        cells = createDataArray(world_size);
        cellsOld = null;
        cellsOld = createDataArray(world_size);
        cellsIm = null;
        cellsIm = createDataArray(world_size);

        kernelRe = null;
        kernelRe = createDataArray(world_size);
        kernelIm = null;
        kernelIm = createDataArray(world_size);

        potentialRe = null;
        potentialRe = createDataArray(world_size);
        potentialIm = null;
        potentialIm = createDataArray(world_size);
    }

    function createDataArray(world_size) {
        let arr = Array(world_size);
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
        let ctx = canvas.getContext("2d");
        let img = ctx.createImageData(canvas.width, canvas.height);
        let rect = canvas.getBoundingClientRect();

        return {
            can: canvas,
            ctx: ctx,
            img: img,
            left: rect.left,
            top: rect.top,
        };
    }

    function copyInitCells(buffer, newCells, x1, y1, scale, angle) {
        let arr = newCells.arr[0];
        let h = newCells.shape[1];
        let w = newCells.shape[2];

        let sin = Math.sin((angle / 180) * π);
        let cos = Math.cos((angle / 180) * π);
        let fh = (Math.abs(h * cos) + Math.abs(w * sin) + 1) * scale - 1;
        let fw = (Math.abs(w * cos) + Math.abs(h * sin) + 1) * scale - 1;
        for (let fi = 0; fi < fh; fi++) {
            for (let fj = 0; fj < fw; fj++) {
                let i = Math.round(
                    (-(fj - fw / 2) * sin + (fi - fh / 2) * cos) / scale + h / 2
                );
                let j = Math.round(
                    (+(fj - fw / 2) * cos + (fi - fh / 2) * sin) / scale + w / 2
                );
                let x = Mod(fj + x1, WORLD_SIZE);
                let y = Mod(fi + y1, WORLD_SIZE);

                let inBounds = (i >= 0 && j >= 0 && i < h && j < arr[i].length)
                let c = inBounds ? arr[i][j] : 0.;
                if (c > 0) {
                    buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + y * WORLD_SIZE + x] = c
                };
            }
        }
    }

    ///////////////////////////////
    // Renderer
    ///////////////////////////////
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
                    INIT_CELLS_X / PIXEL - (INIT_CELLS.shape[2] / 2) / SCALE
                );
                const y1 = Math.floor(
                    INIT_CELLS_Y / PIXEL - (INIT_CELLS.shape[1] / 2) / SCALE
                );
                copyInitCells(buffer, INIT_CELLS, x1, y1, SCALE, 0);

                ADD_LENIA = false;
            }
        })();
    }

    function render(buffer) {
        (function loop() {
            window.requestAnimationFrame(loop);
            DrawArray(CANVAS_CELLS, buffer, 1);
        })();
    }

    function DrawArray(canvas, buffer, max_val) {
        const nb_colors = COLORS[colorName].length;
        let buf = canvas.img.data;

        let p = 0;
        let rgba;
        for (let i = 0; i < CANVAS_SIZE; i++) {
            let ii = Math.floor(i / PIXEL);
            for (let j = 0; j < CANVAS_SIZE; j++) {
                let jj = Math.floor(j / PIXEL);
                let outBufPos = BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + ii * WORLD_SIZE + jj;

                let v = buffer[outBufPos] * max_val;
                let c = Math.floor(v * nb_colors);
                c = Math.max(c, 0);
                c = Math.min(c, nb_colors - 1);
                rgba = COLORS[colorName][c];

                for (let n = 0; n < 3; n++) {
                    buf[p++] = rgba[n];
                }
                buf[p++] = 255;
            }
        }

        canvas.ctx.putImageData(canvas.img, 0, 0);
        RENDERING_CANVAS.ctx.drawImage(canvas.can, 0, 0);
    }

    ///////////////////////////////
    // Kernels
    ///////////////////////////////
    function setKernel(buffer, fft2dFn, kernels_params) {
        let k_id = kernels_params[0]["k_id"];
        let k_q = kernels_params[0]["q"];
        let k_r = kernels_params[0]["r"];
        let tmp_bs = kernels_params[0]["b"];
        let bs;
        if (typeof tmp_bs == "string") {
            bs = [];
            let tmp_bs_arr = tmp_bs.split(",");
            for (let index = 0; index < tmp_bs_arr.length; index++) {
                const split = tmp_bs_arr[index].split("/");
                if (split.length == 2) {
                    bs.push(parseInt(split[0], 10) / parseInt(split[1], 10));
                } else {
                    bs.push(parseFloat(split[0]));
                }
            }
        } else {
            bs = kernels_params[0]["b"];
        }

        let weight = 0.0;
        const world_size_center = WORLD_SIZE / 2;
        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                let ii =
                    ((i + world_size_center) % WORLD_SIZE) - world_size_center;
                let jj =
                    ((j + world_size_center) % WORLD_SIZE) - world_size_center;
                let r = Math.sqrt(ii * ii + jj * jj) / R;
                let v = kernelShell(k_id, k_q, bs, k_r, r);
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
        }
        fft2dFn(1, BUFFER_KERNEL_REAL_IDX, BUFFER_POTENTIAL_IMAG_IDX)
    }

    function kernelShell(k_id, k_q, bs, k_r, dist) {
        let nb_b = bs.length;
        let b_dist = nb_b * dist;
        let b_threshold =
            bs[Math.min(parseInt(Math.floor(b_dist), 10), nb_b - 1)];

        let k_val = (dist < 1) * kernelFn(k_id, k_q, b_dist % 1) * b_threshold;

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

    ///////////////////////////
    // Math
    ///////////////////////////
    function Bound(x, min, max) {
        let v = Math.round(x * PRECISION) / PRECISION;
        return v < min ? min : v > max ? max : v;
    }
    function Mod(x, n) {
        return ((x % n) + n) % n;
    }
    function Random() {
        return genrand_real2();
    }
    function RandomInt(min, max) {
        return Math.floor(Random() * (max + 1 - min) + min);
    }

    ///////////////////////////
    // Utils
    ///////////////////////////
    function ord(letter) {
        return letter.charCodeAt(0);
    }

    function chr(code) {
        return String.fromCharCode(code);
    }

    function getCells() {
        return {real: cells, imag: cellsIm};
    }

    function getKernel() {
        return {real: kernelRe, imag: kernelIm};
    }

    function ClearCells(buffer, x) {
        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                buffer[BUFFER_CELLS_OUT_IDX * BUFFER_SIZE + i * WORLD_SIZE + j] = x;
            }
        }
    }

    function onClick(e) {
        let rect = e.target.getBoundingClientRect();
        INIT_CELLS_X = (e.clientX - rect.left) / CANVAS_SCALING; //x position within the element.
        INIT_CELLS_Y = (e.clientY - rect.top) / CANVAS_SCALING;  //y position within the element.
        ADD_LENIA = true;
    }

    ///////////////////////////
    // Colors
    ///////////////////////////
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
        } else {
            return colors1 * (1 - frac) + colors2 * frac;
        }
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

    ///////////////////////////
    // Setting public functions
    ///////////////////////////
    window.leniaEngine = {
        init,
        getCells,
    };
})();
