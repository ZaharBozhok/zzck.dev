mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn get_mandelbrot_pixels(
    boundsWidth: usize,
    boundsHeight: usize,
    upperLeftRe: f64,
    upperLeftIm: f64,
    lowerRightRe: f64,
    lowerRightIm: f64,
) -> Vec<u8> {
    generate_mandelbrot(
        (boundsWidth, boundsHeight),
        Complex::new(upperLeftRe, upperLeftIm),
        Complex::new(lowerRightRe, lowerRightIm)
    )
}

extern crate num;
use num::Complex;
use std::str::FromStr;
use std::sync::{Arc, Mutex};

fn generate_mandelbrot(
    bounds: (usize, usize),
    upper_left: Complex<f64>,
    lower_right: Complex<f64>,
) -> Vec<u8> {
    let mut pixels = vec![0; bounds.0 * bounds.1];
    let THREADS = 1;
    let rows_per_band = bounds.1 / THREADS + 1;
    let bands: Vec<&mut [u8]> = pixels.chunks_mut(rows_per_band * bounds.0).collect();
    //let r = crossbeam::scope(|spawner| {
        let mut statuses = Vec::new();
        for _ in 0..THREADS {
            statuses.push(Arc::new(Mutex::new((false, 0 as u32, 0 as usize))));
        }
        for (i, band) in bands.into_iter().enumerate() {
            let v_for_thread = statuses[i].clone();
            let top = rows_per_band * i;
            let height = band.len() / bounds.0;
            let band_bounds = (bounds.0, height);
            let band_upper_left = pixel_to_point(bounds, (0, top), upper_left, lower_right);
            let band_lower_right =
                pixel_to_point(bounds, (bounds.0, top + height), upper_left, lower_right);
            //spawner.spawn(move |_| {
                render(
                    band,
                    band_bounds,
                    band_upper_left,
                    band_lower_right,
                    v_for_thread,
                );
            //});
        }
        //spawner.spawn(move |_| {
        //    loop {
        //        let mut allDone = true;
        //        for not_locked_status in statuses.iter() {
        //            let mut status: (bool, u32, usize);
        //            {
        //                status = not_locked_status.lock().unwrap().clone();
        //            }
        //            allDone = allDone && status.0;
        //            println!(
        //                "Handled {} rows out of {}, {}",
        //                status.1,
        //                status.2,
        //                if status.0 { "done" } else { "not done" }
        //            );
        //        }
        //        println!(
        //            "All done: {}",
        //            //std::time::Instant::now() - start,
        //            allDone
        //        );
//
//                if allDone {
//                    return;
//                }
//                // sleep for half second
//                std::thread::sleep(std::time::Duration::from_millis(100));
//            }
//        });
    //});
    pixels
}

fn pixel_to_point(
    bounds: (usize, usize),
    pixel: (usize, usize),
    upper_left: Complex<f64>,
    lower_right: Complex<f64>,
) -> Complex<f64> {
    let (width, height) = (
        lower_right.re - upper_left.re,
        upper_left.im - lower_right.im,
    );
    Complex {
        re: upper_left.re + pixel.0 as f64 * width / bounds.0 as f64,
        im: upper_left.im - pixel.1 as f64 * height / bounds.1 as f64,
    }
}

fn render(
    pixels: &mut [u8],
    bounds: (usize, usize),
    upper_left: Complex<f64>,
    lower_right: Complex<f64>,
    not_locked_status: Arc<Mutex<(bool, u32, usize)>>,
) {
    assert!(pixels.len() == bounds.0 * bounds.1);
    {
        let mut status = not_locked_status.lock().unwrap();
        status.2 = bounds.1
    }
    for row in 0..bounds.1 {
        for column in 0..bounds.0 {
            let point = pixel_to_point(bounds, (column, row), upper_left, lower_right);
            pixels[row * bounds.0 + column] = match escape_time(point, 255) {
                None => 0,
                Some(count) => 255 - count as u8,
            };
        }
        let mut status = not_locked_status.lock().unwrap();
        status.1 = row as u32;
    }
    let mut status = not_locked_status.lock().unwrap();
    status.0 = true;
}

fn escape_time(c: Complex<f64>, limit: u32) -> Option<u32> {
    let mut z = Complex { re: 0.0, im: 0.0 };
    for i in 0..limit {
        z = z * z + c;
        if z.norm_sqr() > 4.0 {
            return Some(i);
        }
    }
    None
}