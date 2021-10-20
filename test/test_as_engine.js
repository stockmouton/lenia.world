const fs = require("fs");
const loader = require("@assemblyscript/loader");

WORLD_SIZE = 128
BUFFER_SIZE = WORLD_SIZE**2
nb_buffers = 9 + 1; // 9 image buffers + 1 table buffer
const byteSize = (BUFFER_SIZE * nb_buffers) << 2;
const nb_pages = ((byteSize + 0xffff) & ~0xffff) >>> 16;

const memory = new WebAssembly.Memory({
    initial: nb_pages,
});

const wasmConfig = { 
    env: {
        memory
    },
    engine: {
        WORLD_SIZE  : WORLD_SIZE,
        GF_ID       : 0,
        GF_M        : 0.15,
        GF_S        : 0.015,
        T           : 10,
    },
    Math
};

const wasmData = fs.readFileSync(__dirname + "/../static/untouched.wasm")
const wasmModule = loader.instantiateSync(wasmData, wasmConfig);
console.log(wasmModule)