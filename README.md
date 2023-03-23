# Notes of Three.js Journey by Bruno Simon

## 1. Introduction  

Three.js is a JavaScript library that enables developers to create 3D experiences for the wev.
It works with WebGL, but you can make it work with SVG and CSS but those too are quite limited, and not as performant as WebGL.

- WebGL is so fast because it uses the GPU to render the scene. WebGL can be used to draw both *2D* and *3D* graphics.
- The CPU can do calculations really fast but one by one, while the GPU is a little slower but can do thousands of parallel calculations.
- The instructions to place the points (geometry) and draw the pixels (color) are written in **shaders**. We provide information to those shaders like the points positions, model transformations, camera coordinates and things to get positions and colorized the way we want.

## 2. Basic Scene

A basic scene in Three.js is composed of FOUR elements: a **scene**, an **object**, a **camera** and a **renderer**.
- The **scene** is the like a set in a movie.
- The object in Three.js is called a **mesh**, which requires a geometry(shape) and a material(how it looks).
- The **camera** is what makes the object visible. Take perspective camera for example, it usually has a **field of view** (FOV), aspect ratio (width / height), a **near** and **far** clipping plane.
- a **renderer** is the result that gets drawn to the canvas, usually the HTML canvas element. We have to specify the size of the canvas, and call the render method to make the magic happen.

## 3. Transform Objects

There are 4 properties to transform objects:
- **position**
- **scale**
- **rotation**
- **quaternion**: the rotation of the object in a different way.

All classes that inherit from **Object3D** have these properties, like *PerspectiveCamera*, *Mesh*, *Group* and *Scene*. See inheritance in [documentation](https://threejs.org/docs/#api/en/core/Object3D).

These properties will be compile into **matrices**(singular: **matrix**). The matrix is a 4x4 matrix that contains all the information about the position, rotation and scale of the object. The matrix is used to transform the object in the scene.

- `Axis` in Three.js: **x** is right, **y** is up, **z** is forward, just like coordinate system in math.
- `position` inherits from `Vector3`, which has `x`, `y` and `z` properties and many useful methods. You can get the length of a vector by calling `mesh.position.length()`. You can normalize a vector by calling `mesh.position.normalize()`, which will make the vector have a length of 1, just like an interval of the x-axis in math.
- `AxesHelper` is a useful tool to visualize the axes of an object. It takes the size of the axes as the only argument.
- `rotation` also has `x`, `y` and `z` properties, but it's a **Euler**. When you change the `x`, `y` or `z` property, you can imagine putting a stick through your object's center in the axis's direction and then rotating that object on that stick. The value of these properties is in **radians**. Half a circle is `Math.PI`, a full circle is `Math.PI * 2`.
- `reorder` is a method of `Euler` that takes a string as the only argument. The string can be `XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY`, `ZYX`. It will change the order of the rotation. Why do we need this? For example, if you rotate an object 90 degrees around the x-axis, then 90 degrees around the y-axis, the result will be different from rotating 90 degrees around the y-axis, then 90 degrees around the x-axis. The first one will rotate the object 90 degrees around the z-axis, while the second one will rotate the object 90 degrees around the x-axis.
- `Quaternion` also expresses a rotation, but in a more mathematical way. Remember: `quaternion` updates when you change the `rotation`.
- `Object3D` instances have a `lookAt()` method which rotates the object so that its `-z` faces the target you provided. The target must be a `Vector3`.
- scene graph: you can put objects inside groups and use `position`, `rotation` and `scale` to transform the group. To do that, use the `Group` class.

## 4. Animations

The purpose of `requestAnimationFrame()` is to call the function provided on the **next** frame. It's not doing animation. Basically, when you pass a callback function to `requestAnimationFrame()`, the browser will call that function approximately 60 times per second.

- The advantages of `requestAnimationFrame()` over `setInterval()` and `setTimeout()` are:
  - It's synchronized with the browser's repaint cycle, which means that the animation is updated only when the browser is ready to repaint the screen. This allows the animation to be updated at the optimal time, resulting in a smoother and more efficient animation. However, `setTimeout()` and `setInterval()` are not synchronized with the browser's repaint cycle, which can result in janky or stuttering animations. For example, let's say you use setInterval() to update the position of an element every 10 milliseconds. If the browser is able to repaint the screen faster than every 10 milliseconds, the animation may appear janky or stuttering because it's updating at a fixed interval, regardless of whether the browser has finished rendering the previous frame.
  -  It pauses when the user navigates to another browser tab, hence not wasting their precious processing power and battery life.

- Don't use `getDelta()` , use `getElapsedTime()` instead.
- *GSAP* is a JavaScript animation library for creating high-performance animations that work in every major browser. It's a great alternative to `requestAnimationFrame()`.

## 5. Cameras

**PerspectiveCamera(透视相机)** is like the human eye, the closer object appears larger, and vice versa. It's used in photography, film and 3d video games.
**OrthographicCamera(正交相机)** is like a camera with a fixed lens, the object appears the same size regardless of how far it is from the camera. It's used in architecture, engineering and 2d video games(object sizes must be consistent).

- Don't use extreme values like 0.0001 or 99999 for the near and far clipping plane. It will cause z-fighting (glitching).
- Math.sin() starts at 0, Math.cos() starts at 1. Math.PI is half a circle, Math.PI * 2 is a full circle.

![alt](./images/sin-x.png)
![alt](./images/cos-x.png)

**Controls**:
- `OrbitControls` is like a camera orbiting around a target. Except it doesn't goes under the plane.
- `TrackballControls` is like `OrbitControls`, but it goes under the plane.
- `FlyControls` and `FirstPersonControls` are alike, but `FlyControls` is more like a plane, it can roll over.
- `PointerLockControls` is like minecraft, you can move and jump,
- `ArcballControls` is like examining a prop in a game, like purchasing a gun in Counter-Strike.
- `DragControls` can drag objects. It has nothing to do with the camera.
- `TransformControls` can move, rotate and scale objects.

For `OrbitControls`, The damping will smooth the animation by adding some kind of acceleration and friction. It's like real-life motion, with inertia.


## 6. Resizing & Fullscreen

1. `camera.updateProjectionMatrix()` updates the camera's projection matrix in Three.js, which is used to calculate how 3D objects are projected onto a 2D screen or window. This method needs to be called whenever the *camera's properties* or *canvas size* change to ensure the scene is rendered correctly. If you have multiple cameras in your Three.js application, you may need to manually call this method for each camera. However, if you only have one camera, Three.js will automatically update its projection matrix in each frame.

2. `pixelRatio`：
- History: few years ago, all screens had a pixel ratio of 1. Constructors like Apple started building screens with a pixel ratio of 2. Now, there are even higher pixel ratios like 3.
- A pixel ratio of 2 means 4 times more pixels than a pixel ratio of 1. A pixel ratio of 3 means 9 times more pixels than a pixel ratio of 1. Highest pixel ratios are usually on the weakest devices - mobiles.

![alt](./images/pixel-ratio.png)
- Why update pixel ratio when resizing window?
  - When you resize the window, you are actually changing the size and resolution of the visible area of the window, even on the same monitor. This may cause the pixel ratio to be incorrect, which can result in a loss of rendering quality and clarity. Therefore, it is necessary to update the pixel ratio to ensure that the rendered image always has the correct clarity and quality, even when resizing the window on the same monitor. In Three.js, the pixel ratio needs to be updated every time the window is resized.

3. **FullScreen**:
- `document.fullscreenElement` returns the element that is currently displayed in full screen mode. If there is no element in full screen mode, it returns `null`.
- `document.exitFullscreen()` exits full screen mode. 
- `canvas.requestFullscreen()` requests full screen mode for the canvas element.
  
*Note*: `document.fullscreenElement` is not supported by IE and Safari. Instead, use `document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement`.

## 7. Geometries
1. Geometry Basics:
- Composed of vertices(point coordinates), faces(triangles that join those vertices to create a surface).
- Can be used for meshes but also for particles.
- Can store more data than positions (UV coordinates, normals, colors, etc).

2. Parameters
- `width`: The size on the `x` axis
- `height`: The size on the `y` axis
- `depth`: The size on the `z` axis
- `widthSegments`: How many subdivisions in the `x` axis
- `heightSegments`: How many subdivisions in the `y` axis
- `depthSegments`: How many subdivisions in the `z` axis

- Subdivisions correspond to how much triangles should compose a face
  - `1` = 2 triangles per face
  - `2` = 8 triangles per face
- The more subdivisions, the detailed the geometry will be. Because you can manipulate the vertices and triangles, you can create a lot of different shapes.

3. BufferGeometry (more efficient than Geometry)
- `THREE.Geometry` is no longer renderable and can’t be used to create 3D objects (meshes, lines, points) anymore.
- All geometry generators (like `THREE.BoxGeometry`) produce `THREE.BufferGeometry` now
- To create buffer geometry, we need to use `Float32Array` instead of `Array` to store the data. It's a typed array that can only store a fixed length of 32-bit floating point numbers. It's easier for computers to process `Float32Array`.
- *Shared vertices* are vertices that are shared by multiple faces. To avoid this, you can use `geometry.setIndex()` to specify the order in which the vertices should be drawn.

## 8. Debug GUI
**dat.GUI** [Demo](https://jsfiddle.net/ikatyang/182ztwao/)
- Types of elements (tweaks): `Range`, `Color`, `Text`, `Checkbox`, `Button`, `Select`, `Folder`...
- Use `gui.add(object, key)` to add a tweak.
- To change **color**, use `gui.addColor(object, key)` instead, and chain `.onChange()` to it.

```javascript
const parameters = {
    color: 0xc18dd4,
    spin: () => { 
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
    }
}

gui
    .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

gui
    .add(parameters, 'spin')

gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')
```

## 9. Textures
1. **UV Coordinates**:
- UV coordinates are 2D, like the result of unwrapping a 3D object, such as a candy bar or a box. Each vertex of the 3D object has a corresponding UV coordinate.
- Use `geometry.attributes.uv` to access the UV coordinates of the vertices.
- `repeat` is the number of times the texture is repeated in each direction. `wrapS` and `wrapT` are the wrapping modes for the texture in the `x` and `y` directions. `repeatWrapping` is used to repeat the texture in both directions. `mirroredRepeatWrapping` is similar to `repeatWrapping`, but the texture is mirrored in each direction.
- A `Vector2` ranges from 0 to 1. If you want to center the pivot, you can use `0.5` as the `x` and `y` values.

2. **MipMaps**:
- Mipmaps (also known as pyramid textures) are a texture mapping technique used to improve performance and image quality when **viewing textures at different distances and angles**. In a mipmap texture, the original texture is processed to generate a series of images of *decreasing size*, forming a pyramid structure. These images are stored together, so that smaller textures are used when viewing at greater distances or angles, improving rendering efficiency and reducing texture distortion.
- We can change the minification filter of texture with `minFilter` and `maxFilter`, the value can be `THREE.NearestFilter`, which is precise and gives a sharp feeling.
- When setting `NearestFilter` as the minification filter, we don't need mipmaps. We can deactivate it with `texture.generateMipmaps = false`.

3. **Considerations**:
- Weight: each pixel of texture will be stored in GPU regardless of the image's weight. GPU has storage limitations, so it's even worse because mipmapping increases the number of pixels. Try to reduce the size of image as much as possible.
- Size: size (width and height) must be a power of 2.
- Data