(() => {
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

    let RUN_GEN = null;
    let ADD_LENIA = false;
    let INIT_CELLS; let INIT_CELLS_X = 0; let INIT_CELLS_Y = 0;
    let SCALE;
    let IS_RUNNING = true;

    let CENTER = false;

    let WORLD_SIZE = 1;
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

    let cells = null;
    let cellsOld = null;
    let cellsTx = null;
    let cellsIm = null;

    let kernel = null;
    let kernelRe = null;
    let kernelIm = null;

    let potential = null;
    let potentialRe = null;
    let potentialIm = null;

    let field = null;

    let CANVAS_CELLS = null;
    let CANVAS_HIDDEN = null;

    let shiftX, shiftY;
    let oldmX, oldmY;

    ///////////////////////////////
    // Loader
    ///////////////////////////////
    function init(metadata) {
        const config = metadata["config"];
        const attributes = metadata["attributes"];

        let scale = config["world_params"]["scale"];
        SCALE = parseInt(Math.min(Math.max(scale, 1), 10), 10);
        let size_power2;
        if (SCALE <= 1) {
            size_power2 = 7;
        } else if (SCALE <= 2) {
            size_power2 = 8;
        } else if (SCALE <= 4) {
            size_power2 = 9;
        } else if (SCALE <= 8) {
            size_power2 = 10;
        } else {
            size_power2 = 11;
        }
        resizeAll(size_power2);

        let cellsSt = config["cells"];
        let initCells = decompressArray(cellsSt);
        // Scale it slowly to ensure stability
        // console.log(initCells)
        // if (SCALE > 2) {
        //     update_fn()
        // }
        INIT_CELLS = initCells;

        setParameters(
            config["world_params"],
            config["kernels_params"],
            attributes
        );
        setKernel(config["kernels_params"]);

        let x1 = Math.floor(WORLD_SIZE / 2 - (initCells.shape[2] / 2) * SCALE);
        let y1 = Math.floor(WORLD_SIZE / 2 - (initCells.shape[1] / 2) * SCALE);
        initCellsArray(initCells, x1, y1, 0, 0, SCALE, 0);

        document.body.addEventListener("keydown", onKeyDown);
        document.getElementById("CANVAS_CELLS").addEventListener("click", onClick);
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
        let cells = createArray(cells_val_l, cells_shape);

        return cells;
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

        if (SCALE != 1) {
            R = Math.round(Bound(R * SCALE, 2, WORLD_SIZE));
        }
    }

    function resizeAll(size_power2) {
        // This fix the global canvas size to 256x256
        let min = -2;
        let max = 3;
        let pixel_size_power2 = Bound(8 - size_power2, min, max);

        WORLD_SIZE = 1 << size_power2;
        PIXEL =
            pixel_size_power2 >= 0
                ? 1 << pixel_size_power2
                : Round(Math.pow(2, pixel_size_power2));
        CANVAS_SIZE = Math.round(WORLD_SIZE * PIXEL);

        InitAllArrays(WORLD_SIZE);
        InitAllCanvas(CANVAS_SIZE);
    }

    function InitAllArrays(world_size) {
        cells = null;
        cells = createDataArray(world_size);
        cellsOld = null;
        cellsOld = createDataArray(world_size);
        cellsTx = null;
        cellsTx = createDataArray(world_size);
        cellsIm = null;
        cellsIm = createDataArray(world_size);

        kernel = null;
        kernel = createDataArray(world_size);
        kernelRe = null;
        kernelRe = createDataArray(world_size);
        kernelIm = null;
        kernelIm = createDataArray(world_size);

        potential = null;
        potential = createDataArray(world_size);
        potentialRe = null;
        potentialRe = createDataArray(world_size);
        potentialIm = null;
        potentialIm = createDataArray(world_size);

        field = null;
        field = createDataArray(world_size);
    }

    function createDataArray(world_size) {
        let arr = [];
        for (let i = 0; i < world_size; i++)
            arr.push(new Array(world_size).fill(0));
        return arr;
    }

    function InitAllCanvas(canvas_size) {
        CANVAS_CELLS = InitCanvas("CANVAS_CELLS", canvas_size);
        CANVAS_HIDDEN = InitCanvas("CANVAS_HIDDEN", canvas_size);
    }

    function InitCanvas(id, canvas_size) {
        let canvas = document.getElementById(id);
        canvas.width = canvas.height = canvas_size;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
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

    function initCellsArray(newCells, x1, y1, x2, y2, scale, angle) {
        let arr = newCells.arr[0];
        let h = newCells.shape[1];
        let w = newCells.shape[2];

        let sin = Math.sin((angle / 180) * π);
        let cos = Math.cos((angle / 180) * π);
        let fh = (Math.abs(h * cos) + Math.abs(w * sin) + 1) * scale - 1;
        let fw = (Math.abs(w * cos) + Math.abs(h * sin) + 1) * scale - 1;
        let fi0 = y2 <= 0 ? y1 : RandomInt(y1, y2 - fh);
        let fj0 = x2 <= 0 ? x1 : RandomInt(x1, x2 - fw);
        for (let fi = 0; fi < fh; fi++) {
            for (let fj = 0; fj < fw; fj++) {
                let i = Math.round(
                    (-(fj - fw / 2) * sin + (fi - fh / 2) * cos) / scale + h / 2
                );
                let j = Math.round(
                    (+(fj - fw / 2) * cos + (fi - fh / 2) * sin) / scale + w / 2
                );
                let fii = Mod(fi + fi0, WORLD_SIZE);
                let fjj = Mod(fj + fj0, WORLD_SIZE);
                let c =
                    i >= 0 && j >= 0 && i < h && j < arr[i].length
                        ? arr[i][j]
                        : 0;
                let v = c != "" ? parseFloat(c) : 0;

                if (v > 0) cells[fii][fjj] = v;
            }
        }
    }

    ///////////////////////////////
    // Runner
    ///////////////////////////////
    function run(fps = 30) {
        fps = parseInt(Math.min(Math.max(fps, 1), 60), 10);
        let fpsInterval = 1000 / fps;
        let startTime, now, then, elapsed;

        then = Date.now();
        startTime = then;
        function loop() {
            window.requestAnimationFrame(loop);

            now = Date.now();
            elapsed = now - then;
            if (elapsed > fpsInterval) {
                then = now - (elapsed % fpsInterval);
                if (IS_RUNNING) {
                    if (ADD_LENIA) {
                        const x = Math.floor(
                            INIT_CELLS_X - (INIT_CELLS.shape[2] / 2) * SCALE
                        );
                        const y = Math.floor(
                            INIT_CELLS_Y - (INIT_CELLS.shape[1] / 2) * SCALE
                        );
                        initCellsArray(INIT_CELLS, x, y, 0, 0, SCALE, 0);

                        ADD_LENIA = false;
                    }
                    update_fn();
                    DrawArray(CANVAS_CELLS, cells, 1);

                    if (RUN_GEN == 0) {
                        RUN_GEN = null;
                        IS_RUNNING = false;
                    }
                }
            }
        }
        loop();
    }

    function update_fn(isUpdate) {
        if (isUpdate == null) isUpdate = true;
        for (let i = 0; i < WORLD_SIZE; i++)
            for (let j = 0; j < WORLD_SIZE; j++) cellsOld[i][j] = cells[i][j];
        for (let i = 0; i < WORLD_SIZE; i++) cellsIm[i].fill(0);

        // f * g = F-1( F(f) dot F(g) )
        FFT2D(1, cells, cellsIm);
        ComplexMatrixDot(
            cells,
            cellsIm,
            kernelRe,
            kernelIm,
            potentialRe,
            potentialIm
        );
        FFT2D(-1, potentialRe, potentialIm);

        shiftX = CENTER ? Math.floor(mX - WORLD_SIZE / 2) : 0;
        shiftY = CENTER ? Math.floor(mY - WORLD_SIZE / 2) : 0;

        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                let ii = CENTER ? Mod(i - shiftY, WORLD_SIZE) : i;
                let jj = CENTER ? Mod(j - shiftX, WORLD_SIZE) : j;

                let p = (potential[ii][jj] = potentialRe[i][j]);
                let d = (field[ii][jj] = growthFn(gf_id, gf_m, gf_s, p));
                let v = cellsOld[i][j] + d / T;

                // Clip
                if (v < 0) v = 0;
                else if (v > 1) v = 1;

                if (isUpdate) {
                    cells[ii][jj] = v;
                } else {
                    cells[i][j] = cellsOld[i][j];
                }
            }
        }
    }

    function DrawArray(canvas, arr, max_val) {
        const nb_colors = COLORS[colorName].length;
        let currentCanvas = CENTER ? CANVAS_HIDDEN : canvas;
        let buf = currentCanvas.img.data;

        let p = 0;
        let rgba;
        for (let i = 0; i < CANVAS_SIZE; i++) {
            let ii = Math.floor(i / PIXEL);
            for (let j = 0; j < CANVAS_SIZE; j++) {
                let jj = Math.floor(j / PIXEL);

                let v = arr[ii][jj] * max_val;
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

        currentCanvas.ctx.putImageData(currentCanvas.img, 0, 0);

        if (CENTER) {
            let tX = oldmX * PIXEL;
            let tY = oldmY * PIXEL;
            canvas.ctx.save();
            canvas.ctx.fillStyle = "rgb(255, 255, 255)";
            canvas.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

            canvas.ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
            canvas.ctx.drawImage(
                currentCanvas.can,
                -tX,
                -tY,
                CANVAS_SIZE,
                CANVAS_SIZE
            );
            canvas.ctx.restore();
        }
    }

    ///////////////////////////////
    // Kernels
    ///////////////////////////////
    function setKernel(kernels_params) {
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
                kernel[ii][jj] = v;
            }
        }

        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                kernelRe[i][j] /= weight;
                kernelIm[i][j] /= weight;
            }
        }

        FFT2D(1, kernelRe, kernelIm);
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

    let gf_id = 0;
    let gf_m = 0.14;
    let gf_s = 0.015;
    function growthFn(gf_id, gf_m, gf_s, x) {
        x = Math.abs(x - gf_m);
        x = x * x;

        let s_2;
        switch (gf_id) {
            case 0:
                s_2 = 9 * gf_s * gf_s;
                return Math.max(1 - x / s_2, 0) ** 4 * 2 - 1;
            case 1:
                s_2 = 2 * gf_s * gf_s;
                return Math.exp(-x / s_2) * 2 - 1;
            case 2:
                s_2 = 2 * gf_s * gf_s;
                return Math.exp(-x / s_2);
            case 3:
                return (x_abs <= gf_s ? 1 : 0) * 2 - 1;
        }
    }

    ///////////////////////////
    // Math
    ///////////////////////////
    function Round(x) {
        return Math.round(x * PRECISION) / PRECISION;
    }
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

    function transpose2D(mat) {
        const nb_rows = mat.length;

        for (let i = 0; i < nb_rows; i++) {
            for (let j = 0; j < i; j++) {
                const tmp_re = mat[i][j];
                mat[i][j] = mat[j][i];
                mat[j][i] = tmp_re;
            }
        }
    }

    function FFT2D(dir, re2, im2) {
        const nb_rows = re2.length;

        for (let i = 0; i < nb_rows; i++) {
            FFT1D(dir, re2[i], im2[i]);
        }

        transpose2D(re2);
        transpose2D(im2);

        for (let i = 0; i < nb_rows; i++) {
            FFT1D(dir, re2[i], im2[i]);
        }
    }

    function FFT1D(dir, re1, im1) {
        const nb_rows = re1.length;
        const nb_rows_by_2 = nb_rows >> 1;
        let m = Round(Math.log2(nb_rows));
        let j1 = 0;
        for (let j = 0; j < nb_rows - 1; j++) {
            if (j < j1) {
                let tmp = re1[j];
                re1[j] = re1[j1];
                re1[j1] = tmp;

                tmp = im1[j];
                im1[j] = im1[j1];
                im1[j1] = tmp;
            }

            let j2 = nb_rows_by_2;
            while (j2 <= j1) {
                j1 -= j2;
                j2 >>= 1;
            }

            j1 += j2;
        }

        /* Compute the FFT */
        let c1 = -1.0,
            c2 = 0.0,
            l2 = 1;
        for (let l = 0; l < m; l++) {
            let l1 = l2;
            l2 <<= 1;
            let u1 = 1.0,
                u2 = 0.0;
            for (let i = 0; i < l1; i++) {
                for (let j = i; j < nb_rows; j += l2) {
                    let j2 = j + l1;
                    let t1 = u1 * re1[j2] - u2 * im1[j2];
                    let t2 = u1 * im1[j2] + u2 * re1[j2];
                    re1[j2] = re1[j] - t1;
                    im1[j2] = im1[j] - t2;
                    re1[j] += t1;
                    im1[j] += t2;
                }
                let z = u1 * c1 - u2 * c2;
                u2 = u1 * c2 + u2 * c1;
                u1 = z;
            }
            c2 = Math.sqrt((1.0 - c1) / 2.0);
            if (dir == 1) c2 = -c2;
            c1 = Math.sqrt((1.0 + c1) / 2.0);
        }

        /* Scaling for forward transform */
        if (dir == -1) {
            let scale_f = 1.0 / nb_rows;
            for (let j = 0; j < nb_rows; j++) {
                re1[j] *= scale_f;
                im1[j] *= scale_f;
            }
        }
    }

    function ComplexMatrixDot(
        leftside_re,
        leftside_im,
        rightside_re,
        rightside_im,
        output_re,
        output_im
    ) {
        const nb_rows = leftside_re.length;
        for (let i = 0; i < nb_rows; i++) {
            for (let j = 0; j < nb_rows; j++) {
                let a = leftside_re[i][j];
                let b = leftside_im[i][j];
                let c = rightside_re[i][j];
                let d = rightside_im[i][j];

                let t = a * (c + d);
                output_re[i][j] = t - d * (a + b);
                output_im[i][j] = t + c * (b - a);
            }
        }
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
        return cells;
    }

    function ClearCells(x) {
        for (let i = 0; i < WORLD_SIZE; i++) {
            for (let j = 0; j < WORLD_SIZE; j++) {
                cells[i][j] = x;
            }
        }

        update_fn(false);
    }

    function onKeyDown(e) {
        if (e.keyCode == 32) {
            ClearCells(0);
        }
    }
    
    function onClick(e) {
        console.log(e)
        INIT_CELLS_X = e.clientX;
        INIT_CELLS_Y = e.clientY;
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
        run,
        getCells,
    };
})();
