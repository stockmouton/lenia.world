///////////////////////////
// Globals
///////////////////////////
(() => {
    const NB_CHARS = (ord('Z') - ord('A')) + (ord('z') - ord('a')) + (ord('þ') - ord('À'))
    const PRECISION = 1000000;
    const EPSILON = 1/PRECISION;  // machine epsilon
    const π = Math.PI;
    let R = 13;
    let T = 10;

    let gen = 0;
    let runGen = null;

    let IS_RUNNING = true;

    let centerID = 0;  const CENTER_OFF = 0;
    const Flip_H = 1, Flip_V = 2, Flip_HV = 3, Mirror_H = 4, Mirror_X = 5, Mirror_D = 6;
    let transA = null;
    let transS = null;


    let WORLD_SIZE = 1;
    let PIXEL = 1;
    let P_SIZE = 1;
    const COLORS = {
        'blackwhite': hex_to_palette_rgba('#000000', ['#000000', '#ffffff']),
        'carmine-blue': hex_to_palette_rgba('#006eb8', ['#006eb8', '#fff200', '#cc1236']),
        'carmine-green': hex_to_palette_rgba('#1a7444', ['#1a7444', '#fff200', '#cc1236']),
        'cinnamon': hex_to_palette_rgba('#a7d4e4', ['#a7d4e4', '#71502f', '#fdc57e']),
        'golden': hex_to_palette_rgba('#b6bfc1', ['#b6bfc1', '#253122', '#f3a257']),
        'msdos': hex_to_palette_rgba('#0c0786', ['#0c0786', '#7500a8', '#c03b80', '#f79241', '#fcfea4']),
        'rainbow': hex_to_palette_rgba('#000000', ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#2E2B5F', '#8B00FF']),
        'salvia': hex_to_palette_rgba('#b6bfc1', ['#b6bfc1', '#051230', '#97acc8']),
        'whiteblack': hex_to_palette_rgba('#ffffff', ['#ffffff', '#000000']),
    };
    let colorName = 'blackwhite';

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
    let CANVAS_FIELD = null;
    let CANVAS_POTENTIAL = null;
    let CANVAS_HIDDEN = null;


    let shiftX, shiftY;
    let oldmX, oldmY;

    function ResizeAll(size_power2) {
        // This fix the global canvas size to 256x256
        let min = -2
        let max = 3
        let pixel_size_power2 = Bound(8 - size_power2, min, max);
        ResizeField(size_power2, pixel_size_power2);
    }

    function ResizeField(size_power2, pixel_size_power2) {
        WORLD_SIZE = 1 << size_power2;
        PIXEL = (pixel_size_power2>=0) ? 1 << pixel_size_power2 : Round(Math.pow(2, pixel_size_power2));
        P_SIZE = Math.round(WORLD_SIZE * PIXEL);

        InitAllArrays(WORLD_SIZE);
        InitAllCanvas(P_SIZE);
    }

    function InitAllArrays(world_size) {
        cells = null;      cells = InitArray(world_size);
        cellsOld = null;   cellsOld = InitArray(world_size);
        cellsTx = null;    cellsTx = InitArray(world_size);
        cellsIm = null;    cellsIm = InitArray(world_size);

        kernel = null;     kernel = InitArray(world_size);
        kernelRe = null;   kernelRe = InitArray(world_size);
        kernelIm = null;   kernelIm = InitArray(world_size);

        potential = null;      potential = InitArray(world_size);
        potentialRe = null;    potentialRe = InitArray(world_size);
        potentialIm = null;    potentialIm = InitArray(world_size);

        field = null;      field = InitArray(world_size);
    }

    function InitArray(world_size) {
        let arr = [];
        for (let i=0; i<world_size; i++)
            arr.push(new Array(world_size).fill(0));
        return arr;
    }

    function InitAllCanvas(world_nb_pixels) {
        CANVAS_CELLS = InitCanvas("CANVAS_CELLS", world_nb_pixels);
        CANVAS_FIELD = InitCanvas("CANVAS_FIELD", world_nb_pixels);
        CANVAS_POTENTIAL = InitCanvas("CANVAS_POTENTIAL", world_nb_pixels);
        CANVAS_HIDDEN = InitCanvas("CANVAS_HIDDEN", world_nb_pixels);
    }

    function InitCanvas(id, world_nb_pixels) {
        let canvas = document.getElementById(id);
        canvas.width = canvas.height = world_nb_pixels;
        canvas.style.width = canvas.width+"px"; canvas.style.height = canvas.height+"px";
        let ctx = canvas.getContext("2d");
        let img = ctx.createImageData(canvas.width, canvas.height);
        let rect = canvas.getBoundingClientRect();

        return { can: canvas, ctx: ctx, img: img, left: rect.left, top: rect.top };
    }

    function run() {
        let fps = 30;
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
                    update_fn();
                    DrawAllPanels();

                    if (runGen==0) {
                        runGen = null;
                        IS_RUNNING = false;
                    }
                }
            }
        }
        loop()
    }


    function Round(x) { return Math.round(x * PRECISION) / PRECISION; }
    function Bound(x, min, max) { let v = Math.round(x * PRECISION) / PRECISION; return v<min ? min : v>max ? max : v; }
    function Mod(x, n) { return ((x % n) + n) % n; }


    //**random
    function Random() { return genrand_real2(); }
    function RandomInt(min, max) { return Math.floor(Random() * (max + 1 - min) + min); }

    function get_kernel(kernels_params) {
        let k_id = kernels_params[0]['k_id']
        let k_q = kernels_params[0]['q']
        let k_r = kernels_params[0]['r']
        let tmp_bs = kernels_params[0]['b']
        let bs
        if (typeof(tmp_bs) == "string") {
            bs = []
            let tmp_bs_arr = tmp_bs.split(',')
            for (let index = 0; index < tmp_bs_arr.length; index++) {
                const split = tmp_bs_arr[index].split('/');
                if (split.length == 2) {
                    bs.push(parseInt(split[0], 10) / parseInt(split[1], 10))
                } else {
                    bs.push(parseFloat(split[0]))
                }
            }
        } else {
            bs = kernels_params[0]['b']
        }

        let weight = 0.0;
        const world_size_center = WORLD_SIZE/2
        for (let i=0; i<WORLD_SIZE; i++) {
            for (let j=0; j<WORLD_SIZE; j++) {
                let ii = ((i + world_size_center) % WORLD_SIZE) - world_size_center;
                let jj = ((j + world_size_center) % WORLD_SIZE) - world_size_center;
                let r = Math.sqrt(ii*ii + jj*jj) / R;
                let v = kernelShell(k_id, k_q, bs, k_r, r);
                weight += v;
                kernelRe[i][j] = v;
                ii = WORLD_SIZE - ((i + WORLD_SIZE/2) % WORLD_SIZE) - 1;
                jj = ((j + WORLD_SIZE/2) % WORLD_SIZE);
                kernel[ii][jj] = v;
            }
        }

        for (let i=0; i<WORLD_SIZE; i++) {
            for (let j=0; j<WORLD_SIZE; j++) {
                kernelRe[i][j] /= weight;
                kernelIm[i][j] /= weight;
            }
        }

        FFT2D(1, kernelRe, kernelIm);

    }

    function update_fn(isUpdate) {
        if (isUpdate==null) isUpdate = true;
        for (let i=0; i<WORLD_SIZE; i++)
            for (let j=0; j<WORLD_SIZE; j++)
                cellsOld[i][j] = cells[i][j];
        for (let i=0; i<WORLD_SIZE; i++)
            cellsIm[i].fill(0);

        // f * g = F-1( F(f) dot F(g) )
        FFT2D(1, cells, cellsIm);
        ComplexMatrixDot(cells, cellsIm, kernelRe, kernelIm, potentialRe, potentialIm);
        FFT2D(-1, potentialRe, potentialIm);

        shiftX = (centerID === CENTER_OFF) ? 0 : Math.floor(mX - WORLD_SIZE/2);
        shiftY = (centerID === CENTER_OFF) ? 0 : Math.floor(mY - WORLD_SIZE/2);

        for (let i=0; i<WORLD_SIZE; i++) {
            for (let j=0; j<WORLD_SIZE; j++) {
                let ii = (centerID === CENTER_OFF) ? i : Mod(i - shiftY, WORLD_SIZE);
                let jj = (centerID === CENTER_OFF) ? j : Mod(j - shiftX, WORLD_SIZE);

                let p = potential[ii][jj] = potentialRe[i][j];
                let d = field[ii][jj] = growthFn(gf_id, gf_m, gf_s, p);
                let v = cellsOld[i][j] + d / T;
                
                // Clip
                if (v < 0) v = 0; else if (v > 1.) v = 1.;

                if (isUpdate) {
                    cells[ii][jj] = v;
                } else {
                    cells[i][j] = cellsOld[i][j]
                };
            }
        }
    }

    function DrawAllPanels() {
        DrawArray(CANVAS_CELLS, cells, 1);
        DrawArray(CANVAS_FIELD, field, 1);
        DrawArray(CANVAS_POTENTIAL, potential, 0.5 / gf_m);
    }

    function DrawArray(canvas, arr, max_val) {
        const nb_colors = COLORS[colorName].length
        let isAutoCenter = (centerID != CENTER_OFF) && (R != 2);
        let buf = isAutoCenter ? CANVAS_HIDDEN.img.data : canvas.img.data;
        let p = 0, rgba;
        for (let i=0; i<P_SIZE; i++) {
            let ii = Math.floor(i / PIXEL);
            for (let j=0; j<P_SIZE; j++) {
                let jj = Math.floor(j / PIXEL);

                let v = arr[ii][jj] * max_val;
                let c = Math.floor(v * nb_colors)
                c = Math.max(c, 0);
                c = Math.min(c, nb_colors - 1);
                rgba = COLORS[colorName][c];
                for (let n=0; n<3; n++){
                    buf[p++] = rgba[n];
                }

                buf[p++] = 255;
            }
        }

        let canvas0 = isAutoCenter ? CANVAS_HIDDEN : canvas;
        canvas0.ctx.putImageData(canvas0.img, 0, 0);


        if (isAutoCenter) {
            let tX = oldmX * PIXEL;
            let tY = oldmY * PIXEL;
            canvas.ctx.save();
            canvas.ctx.fillStyle = 'rgb(255, 255, 255)'
            canvas.ctx.fillRect(0, 0, P_SIZE, P_SIZE);

            canvas.ctx.translate(P_SIZE/2, P_SIZE/2);
            canvas.ctx.drawImage(canvas0.can, -tX, -tY, P_SIZE, P_SIZE);
            canvas.ctx.restore();
        }
    }


    ///////////////////////////////
    // Loader
    ///////////////////////////////
    function init(metadata) {
        // Set world
        let size_power2 = 7
        ResizeAll(size_power2);

        const config = metadata["config"]
        const attributes = metadata["attributes"]

        let scale = config["world_params"]["scale"]
        scale = parseInt(Math.min(Math.max(scale, 1), 10), 10)

        let cellsSt = config["cells"]
        let init_cells = decompress_array(cellsSt)

        SetRule(config["world_params"], config["kernels_params"], attributes);
        get_kernel(config["kernels_params"]);

        let x1 = Math.floor(WORLD_SIZE / 2 - init_cells.shape[2] / 2 * scale)
        let y1 = Math.floor(WORLD_SIZE / 2 - init_cells.shape[1] / 2 * scale)
        console.log(init_cells)
        if (scale > 2) { 
            update_fn()
        }
        AddCellArray(init_cells, x1, y1, 0, 0, scale, 0, 0);
    }

    function SetRule(leniax_world_params, kernels_params, attributes) {
        for (let index = 0; index < attributes.length; index++) {
            const attribute = attributes[index];
            if(attribute["trait_type"] === 'Colormap') {
                colorName = attribute["value"]
            }
        }
        
        R = leniax_world_params["R"]
        T = leniax_world_params["T"]

        gf_id = kernels_params[0]['gf_id']
        gf_m = kernels_params[0]['m']
        gf_s = kernels_params[0]['s']

        let scale = leniax_world_params["scale"]
        if (scale!=1) {
            R = Math.round(Bound(R * scale, 2, WORLD_SIZE));
        }
    }

    function decompress_array(string_cells) {
        let string_array = string_cells.split('::')

        console.assert(string_array.length == 2 && string_array[0].length % 2 == 0)

        let max_val = NB_CHARS**2 - 1
        let raw_shape = string_array[1].split(";")
        let cells_shape = []
        for (let index = 0; index < raw_shape.length; index++) {
            cells_shape.push(parseInt(raw_shape[index], 10));
        }
        let cells_val_l = []
        for (let index = 0; index < string_array[0].length; index += 2) {
            let val_i = ch2val(string_array[0][index] + string_array[0][index + 1])
            let val_f = val_i / max_val
            cells_val_l.push(val_f)

        }
        let cells = createArray(cells_val_l, cells_shape)

        return cells
    }

    function ch2val(c) {
        console.assert(c.length == 2)

        let first_char = c[0]
        let second_char = c[1]

        let first_char_idx
        let second_char_idx
        if(ord(first_char) >= ord('À')){
            first_char_idx = ord(first_char) - ord('À') + (ord('Z') - ord('A')) + (ord('z') - ord('a'))
        } else if(ord(first_char) >= ord('a')){
            first_char_idx = ord(first_char) - ord('a') + (ord('Z') - ord('A'))
        } else {
            first_char_idx = ord(first_char) - ord('A')
        }

        if(ord(second_char) >= ord('À')){
            second_char_idx = ord(second_char) - ord('À') + (ord('Z') - ord('A')) + (ord('z') - ord('a'))
        } else if(ord(second_char) >= ord('a')){
            second_char_idx = ord(second_char) - ord('a') + (ord('Z') - ord('A'))
        } else {
            second_char_idx = ord(second_char) - ord('A')
        }

        return first_char_idx * NB_CHARS + second_char_idx
    }

    function createArray(flat_data, shape) {
        console.assert(shape.length == 3)

        let nb_channels = shape[0]
        let nb_rows = shape[1]
        let nb_cols = shape[2]

        let arr = new Array(nb_channels)
        for (let i = 0; i < nb_channels; i++) {
            let channel = new Array(nb_rows)
            for (let j = 0; j < nb_rows; j++) {
                let row = new Array(nb_cols)
                for (let k = 0; k < nb_cols; k++) {
                    row[k] = flat_data[i * (nb_rows + nb_cols) + j * nb_cols + k]
                }
                channel[j] = row
            }
            arr[i] = channel
        }

        let arr_data = {
            arr: arr,
            shape: shape
        }
        return arr_data
    }

    function AddCellArray(newCells, x1, y1, x2, y2, scale, angle, flip) {
        let arr = newCells.arr[0]
        let h = newCells.shape[1]
        let w = newCells.shape[2]

        let sin = Math.sin(angle / 180 * π);
        let cos = Math.cos(angle / 180 * π);
        let fh = ( Math.abs(h*cos) + Math.abs(w*sin) + 1) * scale - 1;
        let fw = ( Math.abs(w*cos) + Math.abs(h*sin) + 1) * scale - 1;
        let fi0 = (y2<=0) ? y1 : RandomInt(y1, y2 - fh);
        let fj0 = (x2<=0) ? x1 : RandomInt(x1, x2 - fw);
        for (let fi=0; fi<fh; fi++) {
            for (let fj=0; fj<fw; fj++) {
                let i = Math.round( (- (fj-fw/2)*sin + (fi-fh/2)*cos) / scale + h/2 );
                let j = Math.round( (+ (fj-fw/2)*cos + (fi-fh/2)*sin) / scale + w/2 );
                let fii = Mod(fi+fi0, WORLD_SIZE);
                let fjj = Mod(fj+fj0, WORLD_SIZE);
                if (flip==2||flip==3) i = h - 1 - i;
                if (flip==1||flip==3) j = w - 1 - j;
                let c = (i>=0 && j>=0 && i<h && j<arr[i].length) ? arr[i][j] : 0;
                let v = (c!="") ? parseFloat(c) : 0;
                if (v>0) cells[fii][fjj] = v;
            }
        }
    }

    ///////////////////////////
    // Kernels
    ///////////////////////////
    function kernelShell(k_id, k_q, bs, k_r, dist) {
        let nb_b = bs.length
        let b_dist = nb_b * dist
        let b_threshold = bs[Math.min(parseInt(Math.floor(b_dist), 10), nb_b - 1)]

        let k_val = (dist < 1) * kernelFn(k_id, k_q, b_dist % 1) * b_threshold

        return k_val
    }

    function kernelFn(k_id, k_q, x) {
        let out;
        switch (k_id) {
            case 0: return (4 * x * (1 - x))**k_q
            case 1: out = k_q - (1 / (x * (1 - x))); return Math.exp(k_q * out)
            case 2: return (x >= k_q && x <= 1 - k_q) ? 1 : 0;
            case 3: return ((x >= k_q && x <= 1 - k_q) ? 1 : 0) + (x < k_q) * 0.5
            case 4: out = ((x - k_q) / (0.3 * k_q))**2; return Math.exp(- out / 2)
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
            case 0: s_2 = 9 * gf_s * gf_s; return Math.max(1 - x / s_2, 0)**4 * 2 -1
            case 1: s_2 = 2 * gf_s * gf_s; return Math.exp(- x / s_2) * 2 -1
            case 2: s_2 = 2 * gf_s * gf_s; return Math.exp(- x / s_2)
            case 3: return ((x_abs <= gf_s) ? 1 : 0) * 2 -1
        }
    }

    ///////////////////////////
    // Maths
    ///////////////////////////
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

        transpose2D(re2)
        transpose2D(im2)

        for (let i = 0; i < nb_rows; i++) {
            FFT1D(dir, re2[i], im2[i]);
        }
    }

    function FFT1D(dir, re1, im1) {
        const nb_rows = re1.length;
        const nb_rows_by_2 = nb_rows >> 1
        let m = Round(Math.log2(nb_rows))
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
        let c1 = -1.0, c2 = 0.0, l2 = 1;
        for (let l=0; l<m; l++) {
            let l1 = l2;
            l2 <<= 1;
            let u1 = 1.0, u2 = 0.0;
            for (let i=0; i<l1; i++) {
                for (let j=i; j<nb_rows; j+=l2) {
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
            if (dir == 1)
                c2 = -c2;
            c1 = Math.sqrt((1.0 + c1) / 2.0);
        }

        /* Scaling for forward transform */
        if (dir == -1) {
            let scale_f = 1.0 / nb_rows;
            for (let j=0; j<nb_rows; j++) {
                re1[j] *= scale_f;
                im1[j] *= scale_f;
            }
        }
    }

    function ComplexMatrixDot(leftside_re, leftside_im, rightside_re, rightside_im, output_re, output_im) {
        const nb_rows = leftside_re.length;
        for (let i=0; i < nb_rows; i++) {
            for (let j=0; j < nb_rows; j++) {
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

    function ClearCells(x) {
        for (let i=0; i<WORLD_SIZE; i++) {
            for (let j=0; j<WORLD_SIZE; j++) {
                cells[i][j] = x;
            }
        }

        update_fn(false);
    }

    function TransformField(dX, dY, dS, dA, flip) {

        if (dS!=1) {
            R = Math.round(Bound(R * dS, 2, WORLD_SIZE));
            get_kernel();
        }

        if ((dA == 0 || transA == null) && (dS == 1 || transS == null)) {
            for (let i=0; i<WORLD_SIZE; i++)
                for (let j=0; j<WORLD_SIZE; j++)
                    cellsTx[i][j] = cells[i][j];
        }

        if (dA == 0) {
            transA = null;
        } else {
            if (transA == null) transA = 0;
            dA = transA = transA + dA;
        }
        if (dS == 1) {
            transS = null;
        } else {
            if (transS == null) transS = 1;
            transS = transS * dS;
            dS = Round(transS);
        }
        for (let i=0; i<WORLD_SIZE; i++)
            cells[i].fill(0);

        let sin = Math.sin(dA / 180 * π);
        let cos = Math.cos(dA / 180 * π);
        let S = (dS<1) ? Math.round(WORLD_SIZE*dS) : WORLD_SIZE;
        let D = (dS<1) ? Math.round(WORLD_SIZE*(1-dS)/2) : 0;
        for (let i=D; i<S+D; i++) {
            for (let j=D; j<S+D; j++) {
                let ii = Math.round( (- (j-WORLD_SIZE/2)*sin + (i-WORLD_SIZE/2)*cos) / dS + WORLD_SIZE/2 - dY);
                let jj = Math.round( (+ (j-WORLD_SIZE/2)*cos + (i-WORLD_SIZE/2)*sin) / dS + WORLD_SIZE/2 - dX);
                ii = Mod(ii, WORLD_SIZE);
                jj = Mod(jj, WORLD_SIZE);
                if (flip==Flip_V||flip==Flip_HV||(flip==Mirror_X&&j>S/2)) ii = WORLD_SIZE-1-ii;
                if (flip==Flip_H||flip==Flip_HV||(flip==Mirror_H&&j>S/2)||(flip==Mirror_X&&j>S/2)) jj = WORLD_SIZE-1-jj;
                if (flip==Mirror_D&&ii+jj>WORLD_SIZE) { let tmp = ii; ii = WORLD_SIZE-1-jj; jj = WORLD_SIZE-1-tmp; }
                cells[i][j] = cellsTx[ii][jj];
            }
        }
        update_fn(false);
    }

    ///////////////////////////
    // Utils
    ///////////////////////////
    function ord(letter) {
        return letter.charCodeAt(0);

    }
    function chr(code){
        return String.fromCharCode(code);
    }

    function hex_to_palette_rgba(hex_bg_color, hex_colors){
        const steps = Math.floor(254 / (hex_colors.length - 1))
        let palette_rgb_uint8 = [];
        for (let i = 0; i < hex_colors.length - 1; i++) {
            const rgb1_uint8 = hex_to_rgba_uint8(hex_colors[i]).slice(0, 3);
            const rgb2_uint8 = hex_to_rgba_uint8(hex_colors[i + 1]).slice(0, 3)
    
            const colors_list = perceptualSteps(rgb1_uint8, rgb2_uint8, steps)
            palette_rgb_uint8 = palette_rgb_uint8.concat(colors_list)
        }
        let bg_rgba_uint8;
        if (hex_bg_color === '') {
            bg_rgba_uint8 = [0, 0, 0, 0]
        } else{
            bg_rgba_uint8 = hex_to_rgba_uint8(hex_bg_color)
        }
        const bg_rgb_uint8 = bg_rgba_uint8.splice(0, 3)
        palette_rgb_uint8.unshift(bg_rgb_uint8)    
    
        return palette_rgb_uint8
    }
    
    function hex_to_rgba_uint8(hex){
        hex = hex.replace('#', '');
    
        rgbaList = [];
        [0, 2, 4].forEach(i => {
            const hexColor = hex.substring(i, i + 2)
            rgbaList.push(parseInt(hexColor, 16))
        });
        rgbaList.push(255)
    
        return rgbaList;
    }
    
    function perceptualSteps(color1, color2, steps){
        const gamma = .43;
    
        const rgbFloat1 = fromSRGB(color1)
        const bright1 = bright(rgbFloat1, gamma)
        const rgbFloat2 = fromSRGB(color2)
        const bright2 = bright(rgbFloat2, gamma)
    
        const colors = []
        for (let step = 0; step < steps; step++) {
            const intensity = lerp(bright1, bright2, step / steps)**(1 / gamma)   
            let color = lerp(rgbFloat1, rgbFloat2, step / steps)
    
            let colorSum = 0;
            for (let i = 0; i < color.length; i++) {
                colorSum += color[i];
            }
            if (colorSum !== 0){
                const tmpColor = [];
                for (let i = 0; i < color.length; i++) {
                    const c = color[i];
                    tmpColor.push(c * intensity / colorSum)
                }
                color = tmpColor
            }
            color = toSRGB(color)
            colors.push(color)
        }
    
        return colors
    }
    
    function lerp(colors1, colors2, frac){
        if (colors1 instanceof Array) {
            const colors = [];
            for (let i = 0; i < colors1.length; i++) {
                const color1 = colors1[i];
                const color2 = colors2[i];
                colors.push(color1 * (1 - frac) + color2 * frac)
            }
            return colors
        }else {
            return colors1 * (1 - frac) + colors2 * frac
        }
    }
    
    function fromSRGB(rgbUINT8){
        const rgbFloat = []
        for (let i = 0; i < rgbUINT8.length; i++) {
            const x = rgbUINT8[i];
            const x_f = x / 255.0
            let y;
            if (x_f <= 0.04045){
                y = x_f / 12.92
            } else{
                y = ((x_f + 0.055) / 1.055)**2.4  
            }
    
            rgbFloat.push(y)
        }
        
        return rgbFloat
    }
    
    function toSRGBFloat(x){
        if (x <= 0.0031308) {
            x = 12.92 * x
        } else {
            x = (1.055 * (x**(1 / 2.4))) - 0.055
        }
        return x
    }
        
    function toSRGB(rgb){
        const rgbUINT8 = []
        for (let i = 0; i < rgb.length; i++) {
            const c = rgb[i];
            rgbUINT8.push(parseInt(255.9999 * toSRGBFloat(c), 10))
        }
        return rgbUINT8
    }
        
    
    function bright(rgbFloat, gamma) {
        let sum = 0;
        for (let i = 0; i < rgbFloat.length; i++) {
            sum += rgbFloat[i];
        }
    
        return sum ** gamma;
    }
    
    window.leniaEngine = {init, run}
})()

