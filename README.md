# Notes of Three.js Journey by Bruno Simon

## 1. Introduction

Three.js is a JavaScript library that enables developers to create 3D experiences for the wev.
It works with WebGL, but you can make it work with SVG and CSS but those too are quite limited, and not as performant as WebGL.

- WebGL is so fast because it uses the GPU to render the scene. WebGL can be used to draw both _2D_ and _3D_ graphics.
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

All classes that inherit from **Object3D** have these properties, like _PerspectiveCamera_, _Mesh_, _Group_ and _Scene_. See inheritance in [documentation](https://threejs.org/docs/#api/en/core/Object3D).

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
  - It pauses when the user navigates to another browser tab, hence not wasting their precious processing power and battery life.

- Don't use `getDelta()` , use `getElapsedTime()` instead.
- _GSAP_ is a JavaScript animation library for creating high-performance animations that work in every major browser. It's a great alternative to `requestAnimationFrame()`.

## 5. Cameras

**PerspectiveCamera(透视相机)** is like the human eye, the closer object appears larger, and vice versa. It's used in photography, film and 3d video games.
**OrthographicCamera(正交相机)** is like a camera with a fixed lens, the object appears the same size regardless of how far it is from the camera. It's used in architecture, engineering and 2d video games(object sizes must be consistent).

- Don't use extreme values like 0.0001 or 99999 for the near and far clipping plane. It will cause z-fighting (glitching).
- Math.sin() starts at 0, Math.cos() starts at 1. Math.PI is half a circle, Math.PI \* 2 is a full circle.

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

1. `camera.updateProjectionMatrix()` updates the camera's projection matrix in Three.js, which is used to calculate how 3D objects are projected onto a 2D screen or window. This method needs to be called whenever the _camera's properties_ or _canvas size_ change to ensure the scene is rendered correctly. If you have multiple cameras in your Three.js application, you may need to manually call this method for each camera. However, if you only have one camera, Three.js will automatically update its projection matrix in each frame.

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

_Note_: `document.fullscreenElement` is not supported by IE and Safari. Instead, use `document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement`.

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
- _Shared vertices_ are vertices that are shared by multiple faces. To avoid this, you can use `geometry.setIndex()` to specify the order in which the vertices should be drawn.

## 8. Debug GUI

**dat.GUI** [Demo](https://jsfiddle.net/ikatyang/182ztwao/)

- Types of elements (tweaks): `Range`, `Color`, `Text`, `Checkbox`, `Button`, `Select`, `Folder`...
- Use `gui.add(object, key)` to add a tweak.
- To change **color**, use `gui.addColor(object, key)` instead, and chain `.onChange()` to it.

```javascript
const parameters = {
  color: 0xc18dd4,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});

gui.add(parameters, "spin");

gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
```

## 9. Textures

1. **UV Coordinates**:

- UV coordinates are 2D, like the result of unwrapping a 3D object, such as a candy bar or a box. Each vertex of the 3D object has a corresponding UV coordinate.
- Use `geometry.attributes.uv` to access the UV coordinates of the vertices.
- `repeat` is the number of times the texture is repeated in each direction. `wrapS` and `wrapT` are the wrapping modes for the texture in the `x` and `y` directions. `repeatWrapping` is used to repeat the texture in both directions. `mirroredRepeatWrapping` is similar to `repeatWrapping`, but the texture is mirrored in each direction.
- A `Vector2` ranges from 0 to 1. If you want to center the pivot, you can use `0.5` as the `x` and `y` values.

2. **MipMaps(纹理贴图)**:

- Mipmaps (also known as pyramid textures) are a texture mapping technique used to improve performance and image quality when **viewing textures at different distances and angles**. In a mipmap texture, the original texture is processed to generate a series of images of _decreasing size_, forming a pyramid structure. These images are stored together, so that smaller textures are used when viewing at greater distances or angles, improving rendering efficiency and reducing texture distortion. For example, if we have a `8*8` texture, mipmapping technique will cut the texture into smaller ones, each time in half, the result is a `4*4` texture, and `2*2` and a `1*1`. When the object is close to us, the computer will choose the biggest texture(in this case, `8*8`), likewise, when the object is far away, the computer will use the smaller one. 
- We can change the minification filter of texture with `minFilter` and `maxFilter`, the value can be `THREE.NearestFilter`, which is precise and gives a sharp feeling.
- When setting `NearestFilter` as the minification filter, we don't need mipmaps. We can deactivate it with `texture.generateMipmaps = false`.

1. **Considerations**:

- Weight: each pixel of texture will be stored in GPU regardless of the image's weight. GPU has storage limitations, so it's even worse because mipmapping increases the number of pixels. Try to reduce the size of image as much as possible.
- Size: size (width and height) must be a power of 2.
- Data

## 10. Materials

1. **Materials** are used to put a color on each visible pixel of the geometry. The algorithm that determines the color of each pixel is called a **shader**.

- `MeshBasicMaterial` is the simplest material. It doesn't react to light and doesn't have any texture. It's used for debugging.
- `MeshNormalMaterial` is used to show lighting, reflections, and shadows. It's usually used to debug normals, but the color looks great too. [Cool Demo](https://www.ilithya.rocks/)
- `MeshMatcapMaterial` gives an illusion that objects are being illuminated.
- `MeshDepthMaterial` will simply color the geometry in white if it's close to the `near` and in black if it's close to the `far` value of the camera.
- `MeshLambertMaterial` is a material that reacts to light and is used to simulate some surfaces (such as untreated wood or stone), but not shiny surfaces (such as varnished wood). It's performant, but it's not physically accurate.
- `MeshPhongMaterial` is similar to `MeshLambertMaterial`, but it can simulate shiny surfaces.
- `MeshToonMaterial` is a cartoon-like material. When the gradient is too small, the `magFilter` will fix it with `mipmapping`. We can set `minFilter` and `magFilter` to `THREE.NearestFilter` to fix it. We can also deactivate `mipmapping` with `texture.generateMipmaps = false`.
- `MeshStandardMaterial` is a physically accurate material. It reacts to light and shadows, and it supports `roughness` and `metalness`. Since `PBR` is gradually being adopted as the _STANDARD_ of rendering realistic material, it's probably why it's called `MeshStandardMaterial`.
- `meshPhysicalMaterial` is the same as `MeshStandardMaterial` but with support of a clear coat layer. It's like a glass material that can reflect the environment.
- `shaderMaterial` and `RawShaderMaterial` can both be used to customize materials.

2. **Maps**:

- `aoMap` (Ambient Occlusion Map) will add shadows to where the texture is dark. We must add a second set of UV named `uv2` to the geometry. The name `uv2` is mandated by Three.js. We can use `geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))` to add it. After that, we can update the material with `material.aoMap = texture` and `material.aoMapIntensity = 5`.
- `displacementMap` will show the ups and downs of the texture. We can use `material.displacementScale = 0.1` to control the intensity. For the height map texture, if the color is white, it will be elevated, and if it's black, it will be depressed. Don't forget to adjust the subdivisions of the geometry to provide enough vertices to show the details.
- `metalnessMap` and `roughnessMap` will add more details to the material. But we shouldn't mix `metalness` and `roughness` maps with `metalness` and `roughness` values. If we do, the result will look weird.
- `normalMap` will fake the normals orientation and details on the surface regardless of the subdivision. And we can use `material.normalScale` (a Vector2) to control the intensity.
- `alphaMap` will make the texture transparent. We can use `material.transparent = true` to make it work.
- `enviromentMap` is an image of what's surrounding the scene. It can be used for reflections and refractions but also for general lighting. Environment maps are supported by multiple materials. [HDRI Haven](https://hdrihaven.com/) is a great place to find free environment maps. But HDR file needs to be divided, use [this tool](https://matheowis.github.io/HDRI-to-CubeMap/), note that the converted images are png by default.

```javascript
const cubeTextureLoader = new THREE.CubeTextureLoader();
// provide 6 directions
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg", // right
  "/textures/environmentMaps/0/nx.jpg", // left
  "/textures/environmentMaps/0/py.jpg", // top
  "/textures/environmentMaps/0/ny.jpg", // bottom
  "/textures/environmentMaps/0/pz.jpg", // front
  "/textures/environmentMaps/0/nz.jpg", // back
]);
```

## 11. 3D Texts

- `FontLoader` is used to load fonts. We can use `fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {})` to load a font. The font is a JSON file, so we can use `JSON.parse(font)` to convert it to a JavaScript object.
- a **bevel** is a technique to make the edges of a 3D object look more rounded. It's usually used to make 3D text look more realistic.
  ![alt](./images/bevel.png)
  ![alt](./images/bevel_segments.png)

```js
const fontLoader = new FontLoader();
fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    const textGeometry = new TextGeometry(
        'Hello Three.js',
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5, // how smooth the curve is
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4 // how smooth the bevel is
        }
    );
```

- a **bounding** can be a box or a sphere, it's the information with the geometry that tells what **space is taken by that geometry**. By default, Three.js uses sphere bounding
  [alt](./images/bounding.png)
- **Frustum culling** is a technique used in computer graphics to improve performance by _eliminating objects_ that are outside of the camera's view frustum, which is the portion of space that is visible in the camera's view. In a 3D scene, a frustum is a pyramid-shaped volume that defines the view of the camera. It's like **a truncated pyramid with the top cut off, and it's positioned so that the camera is at the narrow end of the frustum**. Frustum culling is done by testing each object's bounding volume (e.g. a bounding box or sphere) against the view frustum, and if the object is outside of the frustum, it is culled or not drawn. This can significantly reduce the number of objects that need to be rendered, improving the overall performance of the system.
- To center the 3D text, there are two ways: one way is to use `textGeometry.computeBoundingBox()` to get the bounding box max, which is the entire width of the text. Then use `textGeometry.translate(-textGeometry.boundingBox.max.x / 2, 0, 0)` to center the text. It's like absolute centering a text in CSS. Another way is to use `textGeometry.center()` to center the text, which is much simpler.

## 12. Lights

#### Types of lights
---
1. **Ambient Light**:
   - used to simulate the light that comes from all directions (light bouncing).
2. **Hemisphere Light**:
   - similar to `AmbientLight`, but with a different color from the **sky** than the **ground**.
   - `hemisphereLight.color` is the color of the sky. `hemisphereLight.groundColor` is the color of the ground. `hemisphereLight.intensity` is the intensity of the light.
3. **Directional Light**:
   - used to simulate the light that comes from a specific direction.
   - `directionalLight.position.set(1, 0.25, 0)`. `directionalLight.intensity` is the intensity of the light.
4. **Point Light**:
   - almost like a lighter, the light starts at an infinitely small point and spreads uniformly in every direction.
   - the `distance` determines how far the light will spread out. The `decay` determines how fast the light will fade out with distance.
5. **RectArea Light**:
   - works light the big rectangle lights you can see on the photoshoot set. It's a mix between a directional light and a diffuse light.
   - works **only** with `MeshStandardMaterial` and `MeshPhysicalMaterial`.
   - an empty `Vector3` is positioned as (0, 0, 0). If we want the light to point to the center, we can use `rectAreaLight.lookAt(new THREE.Vector3())`.
6. **Spot Light**:
   - works like a flashlight.
   - In math, radian is the angle formed by an arc that is equal to the radius of the circle. Since the circumference of a circle is `2πr`, and the length of the arc is the same as radius, the angle of a circle can be represented as `2π rad`.  In Three.js, `Math.PI` is a half circle, so `Math.PI * 2` is a full circle. A radian is approximately `57.3` degrees.
   - When an object blocks light, it creates a shadow with a darker central part (umbra) and a lighter surrounding part (penumbra). If `penumbra` is set to 0, then the shadow will be sharp.
   - To rotate the spotlight, we need to add its target property to the scene. Then we can use `spotLight.target.position.set(0, 0, 0)` to rotate the spotlight.

#### Performance of lights
---
1. minimal costs: `AmbientLight`, `HemisphereLight`
2. moderate costs: `DirectionalLight`, `PointLight`
3. high costs: `RectAreaLight`, `SpotLight`

#### Baking
---
- When we really need a lot of lights, we can use light baking. The idea is to bake the light into the texture. This can be done in a 3D software. The *drawback* is that we cannot move the light anymore and we ave to load huge textures.

#### Helpers
---
- `DirectionalLightHelper`
- `HemisphereLightHelper`
- `PointLightHelper`
- `SpotLightHelper`
- `RectAreaLightHelper`: manually imported

## 13. Shadows

#### Types of shadows
---
1. **Core Shadows**:
2. **Drop Shadows**:

#### Rate tracing
---
- Shadows have always been a **challenge for real-time** 3D rendering (because you need shadows at a good frame rate), rate tracing (one technique) can take a long time to render, maybe hours to do one render, we can't afford to do that in real-time. Developers must find tricks to display realistic shadows at a reasonable frame rate. Three.js has a built-in solution -- **shadow maps**. It's not perfect, but it's convenient.
- Before you do one scene-render, Three.js will do a pre-render for each _light-supporting shadows_(PointLight, Directional Light, SpotLight), these light renders will simulate what the light sees as if it was a camera. During these light renders, a ```MeshDepthMaterial``` replaces all mesh materials.
- The light renders are stored as textures and we call them **shadow maps**. They are then used on every material supposed to receive shadows and projected on the geometry. [Demo](https://threejs.org/examples/webgl_shadowmap_viewer.html)

#### Solution 1: Shadow maps
---
- **Shadow maps** are textures that contain the depth information of the scene as seen from the light. They are used to determine if a fragment is in shadow or not. The shadow map is a black and white texture, where black is the closest to the light and white is the farthest. The shadow map is then projected on the geometry to determine if a fragment is in shadow or not. 
![alt](./images/shadow_map.png)
- Steps: first, activate the shadow maps on the renderer by `renderer.shadowMap.enabled = true`. Then, gp through each object and decide if it can cast a shadow with `castShadow` and if it can receive shadow with `receiveShadow`. Finally, activate the shadows on the light.
- We can access the shadow map in the `shadow` property of each light. By default, the shadow map is a 512x512 texture.
- *Amplitude*: reduce to produce a better shadow quality. Since `directionalLight` has a orthographic camera, we can adjust the shadow camera's view size (viewing frustum 视锥体) to improve the shadow quality.
```
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
```
#### Algorithms of shadow maps
---
Different algorithms of shadow maps:
- THREE.BasicShadowMap: very performant, but lousy quality.
- THREE.PCFShadowMap: less performant but smoother edges (default).
- THREE.PCFSoftShadowMap: less performant but even softer edges.
- THREE.VSMShadowMap: less performant, more constraints, can have unexpected results.

- `PointLight`'s shadow camera is a perspective camera, because 3.js uses a cube texture to store the shadow map. which means 3.js will generate shadow maps in all 6 directions of the cube and finishes downward. That's why we get a downward shadow camera helper. Don't change the `fov` of the shadow camera, only change its `aspect` and `near` and `far` properties.

#### Solution 2: Baking shadows
---
- **Shadow baking** is a computer graphics technique mainly used in **games** and **real-time rendering** applications. It **precomputes** the shadow interactions between **static objects** and **light sources** and stores the results in **texture maps**(usually made with softwares like blender). During real-time rendering, the **baked shadow maps** are used directly, eliminating the need to recalculate shadows and **improving performance**. Shadow baking is suitable for **static objects** and **light sources**, as their relationships are determined during the precomputation. For **dynamic objects** and **light sources**, **real-time shadow techniques**, such as **shadow maps**, are needed instead.

#### Solution 3: Simulate shadows with another mesh
---

## 14. Haunted House Practice

- How to set the set the background color: `renderer.setClearColor(0x000000)`.

#### Difference between `renderer.setClearColor()` and `scene.background`

- `renderer.setClearColor(color)`: Sets the clear color for the WebGL renderer, which is used to clear the canvas before each frame. This is a global setting affecting all scenes.
- `scene.background = new THREE.Color(color)`: Sets the background color for a specific scene. If set, the renderer uses this color to clear the canvas when rendering this scene, allowing different scenes to have different backgrounds.

In summary, use `renderer.setClearColor()` for a *single, universal background* color and `scene.background` for *different colors per scene*.

#### Ambient occlusion
- **Ambient Occlusion (AO)**: This is a way to make the shadows in 3D scenes look more realistic. It makes some parts darker—like corners and places where light can't reach easily.  It's often used in games, animation, and movie production.
- **UV Mapping**: In 3D modeling, UV mapping is a technique that allows 2D textures to be painted onto a 3D model's surface. Think of it like wrapping a gift in decorative paper. "U" and "V" are coordinates on the 2D texture image, much like "X", "Y", and "Z" are coordinates in the 3D space. The term "mapping" refers to the process of assigning each point on the 3D model (vertices) to a corresponding point on the 2D texture image.
- **UV Set**: In 3D modeling, a model can have multiple UV maps, and each of these maps is referred to as a UV set. Having multiple UV sets allows different textures to be applied to the model without them overlapping or conflicting with each other. For example, Sometimes, you want to wrap more than one type of paper (texture) around your 3D gift box (model). Each type of paper (texture) you use is called a UV set.
- **Why AO maps often use a second UV set**: Your AO map (shadow map) is like a special kind of gift paper that only affects how shadows look. To avoid messing up your regular gift paper (main texture), you wrap this special paper (AO map) separately using another UV set. This way, you can change your shadows without messing up the color and details of your main texture.
- **How does Three.js knows to use that UV2 set for my aoMap?**: 
  In Three.js, it is implicitly understood that if a second set of UV coordinates (`uv2`) exists in the geometry, it will be used for certain texture maps such as the Ambient Occlusion map (`aoMap`), the Bump Map (`bumpMap`), and the Displacement Map (`displacementMap`).

  So when you create a material and set an `aoMap`, Three.js checks for the `uv2` attribute in the geometry. If it exists, it will use `uv2` for the `aoMap`. If not, the `aoMap` won't function properly because it doesn't have the necessary UV coordinates to map the texture onto the geometry. In short, `uv2` is a required name for the second UV set.

#### Repeat Wrapping
- In Three.js, the `repeat` property of a texture is used to control the number of repetitions of the texture on the surface of a model. It takes two parameters representing the horizontal (U-axis) and vertical (V-axis) repetitions.

 - `texture.repeat.set(8, 8)` sets the texture to repeat 8 times both horizontally and vertically.
- The `wrapS` and `wrapT` properties are used to control how the texture wraps when the UV coordinates go beyond the defined range.

 - `texture.wrapS = THREE.RepeatWrapping` sets the wrapping behavior for the horizontal direction.
 - `texture.wrapT = THREE.RepeatWrapping` sets the wrapping behavior for the vertical direction.

- Common wrap modes include `THREE.ClampToEdgeWrapping`, `THREE.RepeatWrapping`, and `THREE.MirroredRepeatWrapping`.

## 14. Particles

#### Understanding BufferGeometry
- `position` attribute: the position of each vertex in the geometry. It is a `Float32Array` array of length `3 * number of vertices` (3 components per vertex). The first three values are the `x`, `y`, and `z` coordinates of the first vertex, the next three values are the `x`, `y`, and `z` coordinates of the second vertex, and so on.
- So, if we want to randomly assign a position to each vertex, we can do this:
```js
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 500

const positions = new Float32Array(count * 3)

// fill the positions array with random values, each vertex has 3 values (x, y, z)
for (let i = 0; i < count * 3; i++) { 
  // each index is a value of x, y, or z
  positions[i] = (Math.random() - 0.5) * 10
}

// so here we can have 500 vertices, each vertex has 3 values (x, y, z)
// that's why we typed count * 3, and the last parameter is 3
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
```

- [Cool particle website](https://www.kenney.nl/assets/particle-pack)

#### Problems and Fixes
- **Problem**: The particles will have a square shape and their edges will block the view of other particles behind them.
- **Solution 1**: Set the `THREE.PointsMaterial`'s `alphaTest` property to a value between 0 and 1. This will make the material discard any pixels with an alpha value below the specified threshold. This is a quick and easy way to get rid of the edges of the particles.
- **Solution 2**: Set the `THREE.PointsMaterial`'s `depthTest` property to `false`. Three.js will no longer check the depth of the particles, and they will no longer block each other. However, deactivating the depth testing might create bugs if you have other objects in your scene or particles with different colors.
- **Solution 3**: Set the `THREE.PointsMaterial`'s `depthWrite` property to `false`. The depth of what's being drawn is stored in what we call a depth buffer. Instead of not testing if particle is closer than what's in the depth buffer, we can tell WebGL not to write particles in the depth buffer with `depthWrite`.
- **Solution 4**: Set the `THREE.PointsMaterial`'s `blending` property to `THREE.AdditiveBlending`. This will make the particles blend with the background color, which is black by default. This is a quick and easy way to get rid of the edges of the particles. However, the effect will impact the performances, like framerate drop.

## 15. Galaxy
- use `dispose()` to destroy the geometry and material that we don't use anymore, to free up memory. Note, we cannot destroy a mesh.
```js
const generateGalaxy = () => {
  // destroy old galaxy
  if (points !== null) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
  }
  // ...
}
```

- `lerp` means *linear interpolation*(线性插值). It can be useful when we want to find a value between a starting point and an end point based on a factor. The formula goes like this:
```
result = A + factor * (B - A)
```
In Three.js, `lerp` can be useful for achieving animation, transitions and any other smooth effects.

- Basic Trigonometry
- The angle is called `theta` (θ). The three sides are `opposite`, `adjacent`, and `hypotenuse`. A helpful mnemonic is called **SOH CAH TOA**, which means sin = opp / hyp, cos = adj / hyp, tan = opp / adj.
- In 2D Descartes coordinate system, the `x` axis is the `adjacent` side, the `y` axis is the `opposite` side, and the `hypotenuse` is the distance from the origin to the point. So that means x is usually `cos` and y is usually `sin`.

## 16. Raycaster
- A raycaster is an object that can be used for detecting intersections between objects and rays.
- Usage examples:
  - detect if there is a wall in front of the player
  - test if the laser gun hit something
  - test if something is currently under the mouse to simulate mouse events
  - show an alert message if the spaceship is heading towards an asteroid
- use `raycaster.set(origin, direction)` to set the origin and direction of the raycaster. The two parameters are both `THREE.Vector3` objects.
- use `rayDirection.normalize()` to normalize the direction vector. So that the length of the vector is 1.
- use `raycaster.intersectObject(object)` to check if the raycaster intersects with the object. It returns an array of intersections. If the array is empty, it means there is no intersection. And use `raycaster.intersectObjects([objects])` to check if the raycaster intersects with any of the objects in the array.
- use `rayCaster.setFromCamera(mouse, camera)` to set the origin and direction of the raycaster based on the mouse position. The first parameter is a `THREE.Vector2` object representing the mouse position. The second parameter is the camera object.

## 17. Scroll-based Animation
### magFilter in Three.js
- `magFilter` is a property that specifies how a texture should be magnified.
- It is not specific to `MeshToonMaterial`; it applies to all materials in Three.js that use textures.
#### 1. Default Behavior
- If not specified, the default `magFilter` in Three.js is set to `THREE.LinearFilter`.
#### 2. Types of Filters
- `THREE.LinearFilter`: Provides smooth **blending** between colors when a texture is magnified. Creates a gradient effect by **mixing adjacent colors**.
- `THREE.NearestFilter`: Retains the original color blocks without blending when magnified.
#### 3. Importance in MeshToonMaterial
- `MeshToonMaterial` often benefits from `THREE.NearestFilter` to maintain **clear color boundaries**, giving it a cartoon-like appearance.

### manipulate the parallax(视差)
- Project 21's parallax effects are driven by two primary interactions:
  - Vertical scrolling of the webpage.
  - Mouse movement within the viewport.

#### 1. Scroll-Based Parallax
The camera's Y-axis position is influenced by the user's vertical scroll position on the webpage:
```js
let currentScroll = window.scrollY;

window.addEventListener('scroll', () => {
    currentScroll = window.scrollY;
});

// In the animation loop (tick function)
// currentScroll / sizes.height is between 0 and 1, which is the size of one section (100vh)
// Multiply by objectsDistance to get to the next section
// so that camera is positioned correctly in the next section
camera.position.y = - currentScroll / sizes.height * objectsDistance;
```
Here, `currentScroll` holds the Y-axis scroll value, and the camera's Y-axis position is modified based on this value. This manipulation makes the 3D objects appear to move up or down as the user scrolls, creating a vertical parallax effect. Note: the Y-axis value should be negative.

#### 2. Mouse Movement-Based Parallax
```js
const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event) => {
    // it's better to have a value between -0.5 and 0.5
    // instead of 0 and 1
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
});

// In the animation loop (tick function)
// these calculations are made to achieve a delay effect
// instead of moving instantly to the target position
const parallaxX = cursor.x * 0.5;
const parallaxY = - cursor.y * 0.5;
cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
```

## 18. Physics
### 1. How to achieve physics in Three.js
- The trick is to create two worlds, one for Three.js and one for a physics engine like *Cannon.js( or Ammo.js or Oimo.js)*. Then, we need to synchronize the two worlds by updating the position of the Three.js objects based on the position of the physics objects.
- There are also some awesome 2D physics engines like *Matter.js*, *Box2D*, *Planck.js*, and *p2.js*. There are solutions trying to combine Three.js with physics library like *Physijs*.
- `PhysiJs`: uses *Ammo.js* and web workers by default. And instead of creating the Three.js object and physics body separately, we create a `Physijs.Mesh` object that will automatically create a physics body for us.

### 2. Things are a little bit different in Cannon.js world
- Instead of meshes, a Cannon.js world have bodies.
```js
const sphereBody = new CANNON.Body({
    mass: 1, // kg, 0 = static object; if one body is heavier than the other, it will push the other one
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
})
```
- Update Physics(Cannon.js) world in the tick function by calling `world.step()`.
- Update the mesh by copying the position of the Physics(Cannon.js) world body.
- Physics world can only rotate by using `Quaternion`: `body.quaternion.setFromAxisAngle(axis, angle)`.

### 3. Contact Materials
- Create a `ContactMaterial`, which is the combination of two `Materials` and how they should collide. The first two params are the two materials, the third param is an object containing collision properties like `friction` (how much does it rub) and `restitution`(how much does it bounce). The default value for both is `0.3`. Then, add the `ContactMaterial` to the `world`.

### 4. Forces
- `body.applyForce(force, position)` applies a force from a specified point in space (not necessarily on the `Body`'s surface) like the wind, a small push on a domino or a strong force on an angry bird.
- `body.applyImpulse(impulse, position)` is like `applyForce` but instead of adding to the force, it will add to the velocity.
- `body.applyLocalForce(force, position)` is the same as `applyForce` but the coordinates are local to the `Body` (`0, 0, 0` would be the center of the `Body`).
- `body.applyLocalImpulse(impulse, position)` is the same as `applyImpulse` but the coordinates are local to the `Body`.

### 5. Boxes
- In `Cannon.js`, the box is centered at the center of the cube, which means we need to provide the half extents of the box. So we divide the width, height and depth by 2
- Make sure to update the position and the rotation of the mesh based on the position and the rotation of the body.
```js
  // Update objects
  for (let object of objectsToUpdate) {
      object.mesh.position.copy(object.body.position)
      // also make sure the rotation is updated
      object.mesh.quaternion.copy(object.body.quaternion)
  }
```

### 6. Collision Tests
- When testing the collisions between objects, a naive approach to test every `Body` against every other `Body`. This is bas for performances.
- We call this step the **broadphase** and we can use a different broadphase for better performances.
  - `NaiveBroadphase`: default, test every `Body` against every other `Body`.
  - `GridBroadphase`: divides the world in a grid and test only the `Bodies` in the same cell.
  - `SAPBroadphase`: (**S**weep **A**nd **P**rune) - test `Bodies` on arbitrary axes during multiple steps. It's even better than `GridBroadphase`.
- To use a broadphase, we simply instantiate it in the `world.broadphase` property and use the same `world` as parameter.
```js
  world.broadphase = new CANNON.SAPBroadphase(world)
```
- Even if we use an optimized broadphase algorithm, all the `Bodies` are still tested against each other, even those that are not moving. 
- When the `Body` speed gets really slow, the `Body` can fall asleep and won't be tested unless a sufficient force is applied. This is called **sleeping**. We can set the `allowSleep` property to `true` on the `World`.
- You can also set the `sleepSpeedLimit` and `sleepTimeLimit` properties on the `World` to control when a `Body` should fall asleep.

### 7. Events
- We can listen to events on `Body` like `collide`, `sleep`, `wakeup`, etc.
- Play sound when collide - two problems to solve:
  - The sound has to be played from the start while the sound is still playing.
  - When collision is not too strong, the sound should be played at a lower volume.
  ```js
  const playHitSound = (collideEvent) => { 
    // if the collision is not too strong, we want to play the sound at a lower volume
    const impactStrength = collideEvent.contact.getImpactVelocityAlongNormal()

    if (impactStrength > 1.5) {
        // when the sound is playing, we want to reset the time to 0,
        // to achieve the effect of playing the sound again and again
        hitSound.volume = Math.random() // add some randomness to the volume
        hitSound.currentTime = 0 // reset the sound from the beginning
        hitSound.play()
    }
  }
  ```

### 8. Constraints
Constraints enable constraints between bodies. They can be used to simulate joints, motors, and other things that can be modeled as a constraint.
- `HingeConstraint`: acts like a door hinge
- `DistanceConstraint`: forces the bodies to keep a distance from each other
- `LockConstraint`: merges the bodies like if they were one piece
- `PointToPointConstraint`: glues the bodies to a specific point

### 9. Demos
- [Cannon.js Demos](https://schteppe.github.io/cannon.js/)

### 10. Performance
- The component of our computer doing the physics is the CPU
- If the CPU is too busy, the framerate will drop. The solution is to use workers. A worker is a script that runs in the background and doesn't block the main thread. We can use a worker to run the physics simulation and send the results to the main thread. The main thread will then update the Three.js scene based on the results. Here is a [worker demo](https://schteppe.github.io/cannon.js/examples/worker.html).
- A simple usage of worker:
```js
  // In the main thread
  const worker = new Worker('worker.js')
  worker.postMessage({ hello: 'world' })
  worker.onmessage = (event) => {
      console.log(event.data)
  }
```
```js
// In the worker
self.onmessage = (event) => {
    console.log(event.data)
    self.postMessage({ foo: 'bar' })
}
```
- The worker can't access the DOM, so we can't use `window` or `document` in the worker. We can use `self` instead.
- **Cannon.es**: since Cannon.js hasn't been updated for a while, we can use Cannon.es, which is a fork of Cannon.js. It's a modern version of Cannon.js, which is written in ES6 and uses ES modules. It's also more optimized and has a better API. It's also compatible with Three.js.

## 19. Importing Models
### 1. glTF
- glTF has become almost the standard format for 3D models.
- When choosing formats, there are a lot of things to consider, like size, compatibility, features, decompression speed, etc. glTF is a good choice because it's a small file format, it's open source, it's supported by all major 3D softwares, and it supports a lot of features.
- glTF has multiple files: `.gltf` and `.bin` and `.png` or `.jpg`. 
  - The `.gltf` file is a JSON file that contains cameras, lights, scenes, materials, object transformations, but no geometries nor textures. etc. 
  - The `.bin` file is a binary file that usually contains data like the geometry (vertices positions, UV coordinates, normals, colors, etc.). 
  - The `.png` or `.jpg` files are the textures.
We load the `.gltf` file, and it will load the other files automatically.

### 2. glTF-Binary
- Only one file
- Contains all the data (geometry, textures, etc.)
- Binary format, so it's smaller and faster to load
- Usually lighter
- Hard to alter its data

### 3. glTF-Draco
- Like the **glTF default** format, but the buffer data (typically the geometry) is compressed using the **Draco** algorithm.
- Much Lighter
- Not exclusive to glTF but they got popular at the same time and implementation went faster with glTF exporters.
- Google developed the Draco algorithm and it's open source. It's under the Apache license.

### 4. glTF-Embedded
- One file like the **glTF-Binary** format
- JSON (like the **glTF default** format with all the data embedded in the JSON file)
- Heavier (Heaviest of all)

### 5. Load glTF models in Three.js
```js
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/Duck/glTF/Duck.gltf',
    (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
    },
    (progress) => {
        console.log('progress');
        console.log(progress)
    },
    (error) => {
        console.log('error');
        console.log(error)
    }
)
```
- `scene.add(obj)` will remove the object from its current parent and add it to the scene. In order to fix that, we have 2 solutions.
  - use while loop:
  ```js
  while (gltf.scene.children.length) {
      scene.add(gltf.scene.children[0])
  }
  ```
  - or we can duplicate the `children` array of the gltf scene:
  ```js
  const children = [...gltf.scene.children]
  for (const child of children) {
      scene.add(child)
  }
  ```

### 6. Load Draco models in Three.js
- We need to use `DRACOLoader` to load the Draco compressed geometry in the background. Then use `setDecoderPath` to specify the path to the Draco decoder. Finally provide the `DRACOLoader` instance to the `GLTFLoader` instance with `setDRACOLoader`.
```js
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
// the rest of the code is the same as loading glTF models
```
- Draco compression is not a win-win situation. The geometries are lighter but the user has to load the `DRACOLoader` class and the decoder. So it's only worth it if the geometries are big enough.
- It also takes time and resources for your computer to decode a compressed file. You'll have to adapt accordingly to the project.

### 7. Animations
- The loaded `gltf` contains an `animations` property composed of multiple `AnimationClip`. An `AnimationClip` is a `Three.js` class, it's basically a set of keyframe tracks. Each keyframe contains the time and the value of each property of the animated object.
- We need to create an `AnimationMixer`
- An `AnimationMixer` is like a media player associated with an object that can contain one or many `AnimationClips`. `AnimationMixer` is a `Three.js` class which accepts an object as parameter. This object is the object that will be animated. It can be a `Mesh`, a `Group`, a `Camera`, a `Light`, etc.
- Add one of the `AnimationClips` to the mixer with the `clipAction(...)` method. This method returns an `AnimationAction`, and we can call the `play()` method on it.

### 8. Three.js Editor
- [Three.js Editor](https://threejs.org/editor/)
- It's a good way to test models (only models of one file)

## 20. Blender
### 1. Blender Basics
- Area Manipulation: 
  - Move the mouse to the edge of an area, wait for the "+" sign to appear, then click and drag to split (create) a new area.
  - Hold the mouse on the edge of an area, wait for the "+" sign to appear, then click and drag to merge (delete) an area.
- Axes: Z axis is the vertical axis, Y axis is the depth axis, X axis is the horizontal axis.
- [Shortcuts](https://kapeli.com/cheat_sheets/Blender.docset/Contents/Resources/Documents/index):
  - Shortcuts are area-specific. For example, the shortcut `A` is used to select all objects in the 3D Viewport, but it is used to add a new object in the Outliner.
  - Orbit Rotate: Pressing the middle mouse
  - Truck (Horizontal) & Pedestal (Vertical): Pressing Shift + the middle mouse
  - Dolly (Zoom): Mouse wheel. If you hit the end of the zoom, you can press Ctrl + Shift + middle mouse and move the mouse to zoom in and out.
  - Tilt & Pan: Switch to walk mode (fly mode) by pressing Shift + ~ (tilde key). Then use WASD to move around. Use the mouse to look around.
  - Reset Viewport: Shift + C or Home
  - Hide: H; Unhide: Alt + H
  - Focus & Hide Everything Else: Press /
  - Multiple Select: Shift + left click
  - Select All: A; Unselect All: Double Click A
  - Select Portion: B (box select); C (circle select)
  - Create Object: Shift + A
  - Mesh Properties Panel: F9
  - Transform Object: G (grab/position); R (rotate); S (scale). G-Z: move along the Z axis. G-Shift+Z: move along the X and Y axis (exclude Z axis).
  - Mode Switching: Ctrl + Tab
  - Render: F12
  - Search: F3 (I changed it to Ctrl + F because it conflicts with the Snipaste)
- Shading: Give realistic look to the object. Press Z to switch:
  - 1. Solid: Default & performant
  - 2. Material: Like solid but with a preview of the material
  - 3. Wireframe
  - 4. Rendered: Low quality render (realistic but less performant)

### 2. Hamburger Practice
- Data-Normals-Auto Smooth: 30 deg: to make the object look smooth when the angle between two faces is less than 30 deg (to simulate cheese).

## 21. Realistic Render
### 1. Physically Correct Lighting
- Make sure Blender and Three.js have the same light effects.
```js
renderer.physicallyCorrectLights = true
```
- Use environment map to simulate light bouncing. (Cube texture loader)
- Use scene.traverse() to traverse all the objects in the scene and apply the environment map to the model.
```js
// Apply the environment map to the scene
scene.background = environmentMapTexture
// Apply the environment map to the model
scene.environment = environmentMapTexture

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            // no need to add this line, just apply the environment map to the scene
            // child.material.envMap = environmentMapTexture
            child.material.envMapIntensity = debugObject.envMapIntensity
        }
    })
}

gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.position.set(0, - 4, 0)
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        // have to update the gui after the model is loaded
        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('modelRotation')

        updateAllMaterials()
    },
    (progress) => {
    },
    (error) => {
    }
)
```

### 2. Output Encoding
- Meaning: how the color is stored in the texture. It can be linear or sRGB. The default value is `THREE.LinearEncoding`. We should use `THREE.sRGBEncoding`.
```js
renderer.outputEncoding = THREE.sRGBEncoding
```
- Gamma Encoding: a way to store colors while optimizing how bright and dark values are stored according to human eye sensitivity. Gamma usually controls the brightness. When we use `THREE.sRGBEncoding`, it's like using gamma encoding with a gamma value of 2.2.
- Gamma Encoding example: it's easier for human eyes to distinguish between bright colors (0.1 - 0.5) than dark colors (0.5 - 1). So we can use gamma encoding to make the dark colors brighter and the bright colors darker. So that we can have a better contrast between the colors.
- Make sure to apply output encoding to both the renderer and the environment map texture. Model textures through loaders are automatically encoded correctly.
- We use sRGBEncoding for the environment map because it usually adopts a lot of colors, and our eyes cannot distinguish darker colors. We use LinearEncoding the the normal textures because we want the colors to be the exact colors as they are in the texture.

### 3. Tone Mapping
- The tone mapping intends to convert High Dynamic Range (HDR e.g. 0-1.5) values to Low Dynamic Range (LDR e.g. 0-1) values. It's a way to convert the colors of the scene to the colors of the screen.
- Even though we don't use HDR textures, we can still use tone mapping to make the colors look better.
```js
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3 // intensity
```

### 4. Anti-Aliasing (抗锯齿)
- Aliasing an artifact: we can see stair-like effect on the edges of the objects. It's because the screen is made of pixels, and the pixels are square. So when we draw a diagonal line, it's not smooth.
- One solution is to increase the resolution of the screen, so that one pixel can be smaller. But it's not a good solution because it's not performant. This is called **supersampling (SSAA)** or **full-scene (FSAA)**.
- Another solution is to use **multisampling (MSAA)**. It's a technique that only samples the pixels on the edges of the objects. It's more performant than SSAA, but it's still not performant enough.
- In Three.js, make sure to turn on `antialias` during the initialization of the renderer.
```js
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
```
- Screens with a pixel ratio above 1 don't need antialiasing. So we can use `window.devicePixelRatio` to check if the screen has a pixel ratio above 1. If it does, we can turn off antialiasing. The best way to activate antialias only for screens with a pixel ratio below 2.

### 5. Shadows
- Toggle the shadows on `WebGLRenderer` and change the shadow type to `PCFSoftShadowMap`. Then activate it on the light. Also make sure the object in the scene can cast shadow.
```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            // no need to add this line, just apply the environment map to the scene
            // child.material.envMap = environmentMapTexture
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true

            // shadow
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}
```
- Check the shadow camera's size (near and far) by using camera helper. 
```js
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
```
- We can also change the shadow map size to improve the quality of the shadows.
```js
directionalLight.shadow.mapSize.set(1024, 1024)
```
- Shadow Acne: In the burger example, because the burger also casts shadow on itself, so we can see abnormal shadows on the top bun. It's because when the light is generating the shadow, when it hits the burger before hitting the ground, it also generates shadow on the burger surface, so we need to push the shadow a little inside the burger. Then the shadow will be gone. We can solve this problem by using a bias or normalBias. 
  - The `bias` helps flat surfaces.
  - The `normalBias` helps curved surfaces.
```js
// Increase it until the shadow is barely visible
directionalLight.shadow.normalBias = 0.001
```

## 22. Code Structure
### 1. How to structure the code
```
Experience/
┣ Utils/
┃ ┣ Debug.js
┃ ┣ EventEmitter.js
┃ ┣ Resources.js
┃ ┣ Sizes.js
┃ ┗ Time.js
┣ World/
┃ ┣ Environment.js
┃ ┣ Floor.js
┃ ┣ Fox.js
┃ ┗ World.js -> meshes, environment, and lights
┣ Camera.js
┣ Experience.js -> main file, includes browser-related settings (resize, canvas, animation frame etc.) and three.js scene setup (camera, renderer, etc.)
┣ Renderer.js
┗ sources.js
```
### 2. Learn Bruno's Event Emitter
### 3. Be sure to dispose unused objects
- Test if it's a `Mesh`;
- Call the `dispose()` function on the `geometry` property;
- Loop through every key of the `material` property;
- If there is a `dispose()` function available on that key, call it;
- The `Camera` doesn't need to be disposed, but `OrbitControls` do;
- Dispose the `Renderer`, `Debug UI`.
##### The good practice is to create a `destroy` method for each class.