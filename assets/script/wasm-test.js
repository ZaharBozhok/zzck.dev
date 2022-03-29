function go_mandelbrot(wasm) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    if (window.innerWidth > window.innerHeight)
        canvas.width = canvas.height = window.innerHeight;
    else
        canvas.width = canvas.height = window.innerWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function fillCanvasWithMandelbrot(width, height, c1, c2, ctx) {
        let grayscaleOnly = wasm.get_mandelbrot_pixels(width, height, c1.re, c1.im, c2.re, c2.im);
        var id = ctx.getImageData(0, 0, width, height);
        var pixels = id.data;
        for (let i = 0; i < pixels.length / 4; i++) {
            pixels[i * 4 + 0] = grayscaleOnly[i];
            pixels[i * 4 + 1] = grayscaleOnly[i];
            pixels[i * 4 + 2] = grayscaleOnly[i];
            pixels[i * 4 + 3] = 255;
        }
        ctx.putImageData(id, 0, 0);
    }
    window.onload = (event) => {
        let c1 = { re: -1.0, im: 1.0 }
        let c2 = { re: 1.0, im: -1.0 }
        fillCanvasWithMandelbrot(canvas.width, canvas.height, c1, c2, ctx);
        // handle arrows keys
        window.onkeydown = (event) => {
            let move_real = (c1.re - c2.re) / 10.0;
            let move_imaginary = (c1.im - c2.im) / 10.0;
            let zoom_constant = 0.1;
            let key = event.key;
            if (key == "ArrowLeft") {
                event.preventDefault();
                c1.re += move_real;
                c2.re += move_real;
            }
            else if (key == "ArrowRight") {
                event.preventDefault();
                c1.re -= move_real;
                c2.re -= move_real;
            }
            else if (key == "ArrowUp") {
                event.preventDefault();
                c1.im += move_imaginary;
                c2.im += move_imaginary;
            }
            else if (key == "ArrowDown") {
                event.preventDefault();
                c1.im -= move_imaginary;
                c2.im -= move_imaginary;
            }
            else if (key == "-") {
                event.preventDefault();
                c1.re += zoom_constant * (c1.re - c2.re);
                c2.re -= zoom_constant * (c1.re - c2.re);
                c1.im += zoom_constant * (c1.im - c2.im);
                c2.im -= zoom_constant * (c1.im - c2.im);
            }
            else if (key == "=") {
                event.preventDefault();
                c1.re -= zoom_constant * (c1.re - c2.re);
                c2.re += zoom_constant * (c1.re - c2.re);
                c1.im -= zoom_constant * (c1.im - c2.im);
                c2.im += zoom_constant * (c1.im - c2.im);
            }
            fillCanvasWithMandelbrot(canvas.width, canvas.height, c1, c2, ctx);
        }
    }

}

export default go_mandelbrot;