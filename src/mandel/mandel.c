typedef unsigned short ushort;
typedef unsigned int uint;
typedef unsigned long ulong;

#define ESCAPE_RADIUS 2
#define PIXEL_INDEX(x, y, width) (ulong)(width * y + x)
#define X_TO_COMPLEX_REAL(x, width, pixel_length) (((double)x - (double)width / 2.0) * pixel_length)
#define Y_TO_COMPLEX_IMAGINARY(y, height, pixel_length) (((double)height / 2.0 - (double)y) * pixel_length)

// primitive memory allocator
extern unsigned char __heap_base;
ulong* base_pointer = (ulong*)&__heap_base;

ulong pixel_index(uint x, uint y, uint width)
{
    return width * y + x;
}

// ulong size_of_long(void)
// {
//     return 124;
// }

// ulong* foo_bar(void)
// {
//     base_pointer[0] = 4278190080;
//     base_pointer[1] = 16711935;
//     base_pointer[2] = base_pointer[0] + base_pointer[1];
//     base_pointer[3] = base_pointer[0] | base_pointer[1];
//     base_pointer[4] = 0xFFFFFFFF;
//     return base_pointer;
// }

// void* bump_alloc(int n)
// {
//     unsigned int r = base_pointer;
//     base_pointer += n;
//     return (void*)r;
// }

// void bump_reset(void* p)
// {
//     base_pointer = &__heap_base;
// }

// find absolute value
union {
    long long i;
    double f;
} u;

long long d2l(double n)
{
    u.f = n;
    return u.i;
}

double l2d(long long n)
{
    u.i = n;
    return u.f;
}

double fabs(double x)
{
    return l2d(d2l(x) & ~d2l(-0.0));
}

// main code
ulong rgb_to_hex(short r, short g, short b)
{
    return 0xFF000000 + ((short)r << 16) | ((short)g << 8) | ((short)b);
}

ulong get_hex_color(double val)
{
    // config
    int min = 0;
    int max = 1;
    short colors[2][3] = { { 90, 0, 0 }, { 160, 230, 235 } };
    // algorithm
    double i_f = (val - (double)min) / ((double)max - (double)min) * (2 - 1); // number of colors - 1
    int i = (int)i_f;
    float f = i_f - (float)i;
    // if ((double)f < nextafter(0, INFINITY)) {
    if (f < 1E-37) {
        return rgb_to_hex(colors[i][0], colors[i][1], colors[i][2]);
    } else {
        short* color_1 = colors[i];
        short* color_2 = colors[i + 1];
        return rgb_to_hex((int)(color_1[0] + f * (color_2[0] - color_1[0])),
            (int)(color_1[1] + f * (color_2[1] - color_1[1])),
            (int)(color_1[2] + f * (color_2[2] - color_1[2])));
    }
}

ulong* calc_mandelbrot(
    uint width,
    uint height,
    double pixel_length,
    uint max_iter,
    ushort worker_num,
    ushort worker_idx)
{
    for (uint y = worker_idx; y < height; y += worker_num) {
        for (uint x = 0; x < width; ++x) {
            // algorithm
            double z_re = 0.0;
            double z_im = 0.0;

            double z_re_sq = z_re * z_re;
            double z_im_sq = z_im * z_im;
            double c_re = X_TO_COMPLEX_REAL(x, width, pixel_length);
            double c_im = Y_TO_COMPLEX_IMAGINARY(y, height, pixel_length);
            uint iter = 0;
            while (z_re_sq + z_im_sq <= 4.0) {
                if (iter == max_iter)
                    break;
                z_im = z_re * z_im;
                z_im += z_im;
                z_im += c_im;
                z_re = z_re_sq - z_im_sq + c_re;
                z_re_sq = z_re * z_re;
                z_im_sq = z_im * z_im;
                iter += 1;
            }
            if (iter >= max_iter) {
                // pixel belongs to mandelbrot set = black
                base_pointer[PIXEL_INDEX(x, y, width)] = 0xff000000;
            } else {
                // pixel outside of mandelbrot set = colorized
                base_pointer[PIXEL_INDEX(x, y, width)] = (ulong)get_hex_color((double)iter / (double)max_iter * 40);
            }
        }
    }
    // debug
    // base_pointer[0] = get_hex_color()
    return base_pointer;
}

// void iteration(double* z, double* c)
// {
//     double real = z[0] * z[0] + z[1] * z[1] * -1 + c[0];
//     double imaginary = 2 * z[0] * z[1] + c[1];
//     z[0] = real;
//     z[1] = imaginary;
// }

// double mandelbrot(short boundary, int iterations, double c_re, double c_im)
// {
//     double complex_number[2] = { c_re, c_im };
//     double* z = bump_alloc(sizeof(double) * 2);
//     z[0] = 0;
//     z[1] = 0;
//     for (int i = 0; i < iterations; i++) {
//         iteration(z, complex_number);
//         if (fabs(z[0]) > boundary || fabs(z[1]) > boundary) {
//             bump_reset(z);
//             return (double)get_hex_color((double)i / (double)iterations *
//             35);
//         }
//     }
//     bump_reset(z);
//     return (double)0xff000000;
// }

/*
PIXEL INDEX LOGIC

###
###
###

(2, 2) -> ( 1, -1)
(1, 1) -> ( 0,  0)
(0, 0) -> (-1,  1)

*/