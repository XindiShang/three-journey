# Notes of Three.js Journey by Bruno Simon

## 1. Introduction  

Three.js is a JavaScript library that enables developers to create 3D experiences for the wev.
It works with WebGL, but you can make it work with SVG and CSS but those too are quite limited, and not as performant as WebGL.

- WebGL is so fast because it uses the GPU to render the scene. WebGL can be used to draw both *2D* and *3D* graphics.
- The CPU can do calculations really fast but one by one, while the GPU is a little slower but can do thousands of parallel calculations.
- The instructions to place the points (geometry) and draw the pixels (color) are written in **shaders**. We provide information to those shaders like the points positions, model transformations, camera coordinates and things to get positions and colorized the way we want.