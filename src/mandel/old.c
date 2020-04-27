#include <math.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct mandelbrot_result {
    unsigned int iterations;
    unsigned long color;
} mandelbrot_result;

// char* percentageToColor(double percentage)
// {
//     int maxHue = 120;
//     int minHue = 0;
//     double hue = percentage * (maxHue - minHue) + minHue;
//     char* s = malloc(sizeof(char) * 50);
//     sprintf(s, "hsl(%lf, 100%%, 50%%)", hue);
//     return s;
// }

// long rgb_to_hex(float r, float g, float b)
// {
//     long hex_color = ((short)r << 16) | ((short)g << 8) | ((short)b);
//     return hex_color;
// }

// short* get_rgb_color(double weight)
// {
//     short color_1[] = { 255, 213, 0 };
//     short color_2[] = { 15, 0, 112 };
//     double w2 = 1 - weight;
//     short* res_color = malloc(sizeof(short) * 3);
//     res_color[0] = round(color_1[1] * weight + color_2[1] * w2);
//     res_color[1] = round(color_1[0] * weight + color_2[0] * w2);
//     res_color[2] = round(color_1[2] * weight + color_2[2] * w2);
//     return res_color;
// }

// long get_hex_color(double weight)
// {
//     short color_1[] = { 255, 213, 0 };
//     short color_2[] = { 15, 0, 112 };
//     double w2 = 1 - weight;
//     float r = round(color_1[1] * weight + color_2[1] * w2);
//     float g = round(color_1[0] * weight + color_2[0] * w2);
//     float b = round(color_1[2] * weight + color_2[2] * w2);
//     return ((short)r << 16) | ((short)g << 8) | ((short)b);
// }

unsigned long rgb_to_hex(short r, short g, short b)
{
    return ((short)r << 16) | ((short)g << 8) | ((short)b);
}

unsigned long get_hex_color(double val)
{
    // config
    int min = 0;
    int max = 1;
    short colors[2][3] = { { 255, 0, 0 }, { 0, 255, 0 } };
    // algorithm
    double i_f = (val - (double)min) / ((double)max - (double)min) * (2 - 1); // number of colors - 1
    int i = (int)i_f;
    float f = i_f - (float)i;
    // printf("[C] f : %lf\n", (double)f);
    // printf("[C] EPSILON : %lf\n", nextafter(0, INFINITY));
    // printf("[C] f smaller than EPSILON: %s\n", ((double)f < nextafter(0, INFINITY)) ? "true" : "false");
    if ((double)f < nextafter(0, INFINITY)) {
        // printf("[C] rgb {epsilon} : %i %i %i\n", colors[i][0], colors[i][1], colors[i][2]);
        return rgb_to_hex(colors[i][0], colors[i][1], colors[i][2]);
    } else {
        short* color_1 = colors[i];
        short* color_2 = colors[i + 1];
        // printf("[C] rgb : %i %i %i\n",
        // (short)(color_1[0] + f * (color_2[0] - color_1[0])),
        // (short)(color_1[1] + f * (color_2[1] - color_1[1])),
        // (short)(color_1[2] + f * (color_2[2] - color_1[2])));
        return rgb_to_hex(
            (int)(color_1[0] + f * (color_2[0] - color_1[0])),
            (int)(color_1[1] + f * (color_2[1] - color_1[1])),
            (int)(color_1[2] + f * (color_2[2] - color_1[2])));
    }
}

void iteration(double* z, double* c)
{
    double real = z[0] * z[0] + z[1] * z[1] * -1 + c[0];
    double imaginary = 2 * z[0] * z[1] + c[1];
    z[0] = real;
    z[1] = imaginary;
}

mandelbrot_result* mandelbrot(short boundary, int iterations, double* complex_number)
{
    mandelbrot_result* res = (mandelbrot_result*)malloc(sizeof(mandelbrot_result));
    double* z = malloc(sizeof(double) * 2);
    z[0] = 0;
    z[1] = 0;
    for (int i = 0; i < iterations; i++) {
        iteration(z, complex_number);
        if (fabs(z[0]) > boundary || fabs(z[1]) > boundary) {
            res->color = get_hex_color((double)i / (double)iterations);
            res->iterations = i;
            free(z);
            return res;
        }
    }
    res->color = 0xff000000;
    res->iterations = iterations;
    free(z);
    return res;
}

double mandelbrot2(short boundary, int iterations, double* complex_number)
{
    double* z = malloc(sizeof(double) * 2);
    z[0] = 0;
    z[1] = 0;
    for (int i = 0; i < iterations; i++) {
        iteration(z, complex_number);
        if (fabs(z[0]) > boundary || fabs(z[1]) > boundary) {
            free(z);
            return (double)get_hex_color((double)i / (double)iterations);
        }
    }
    free(z);
    return (double)0xff000000;
}

int mandelbrot3(short boundary, int iterations, double* complex_number)
{
    mandelbrot_result* res = (mandelbrot_result*)malloc(sizeof(mandelbrot_result));
    double* z = malloc(sizeof(double) * 2);
    z[0] = 0;
    z[1] = 0;
    for (int i = 0; i < iterations; i++) {
        iteration(z, complex_number);
        if (fabs(z[0]) > boundary || fabs(z[1]) > boundary) {
            free(z);
            return i;
        }
    }
    free(z);
    return iterations;
}

int main(int argc, char const* argv[])
{
    double* c = malloc(sizeof(double) * 2);
    c[0] = 0.2;
    c[1] = -0.55;
    mandelbrot_result* res = mandelbrot(2, 5000, c);
    printf("[C] mandelbrot color 2 %lu\n", res->color);
    printf("[C] mandelbrot color 2b %f\n", (float)mandelbrot2(2, 5000, c));
    // printf("[C] mandelbrot color %li\n", res->color);
    // printf("[C] mandelbrot iterations %i\n", res->iterations);
    // printf("[C] float to short %i\n", (short)125.62349);
    // double a = 0.257;
    // printf("[C] hex color : %li\n", get_hex_color(a));
    return 0;
}
