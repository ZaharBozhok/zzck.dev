---
layout: post
title:  "Mandelbrot wasm rust"
date:   2022-03-29
last_modified_at: 2022-03-29
categories: [JS, Rust, wasm]
tags: [JS, Rust, wasm]
---
<p>Press ↑↓→← to move, and '-'/'=' to zoom out/in</p>
<style>
    canvas {
      border: 1px solid #000;
    }
</style>
<canvas id='canvas'></canvas>
<script type="module">
      import go_mandelbrot from "/assets/script/wasm-test.js";
      import init, {get_mandelbrot_pixels} from "/assets/script/pkg/wasm_test.js";
      init()
        .then(() => {
          go_mandelbrot({get_mandelbrot_pixels: get_mandelbrot_pixels});
        });
</script>