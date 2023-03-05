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