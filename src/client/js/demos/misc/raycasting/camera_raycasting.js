import {  InitDemoStd, Harmony3D, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	testRaycasting(renderer, scene);
}

async function testRaycasting(renderer, scene) {
	perspectiveCamera.position = [500, 0, 0];
	orbitCameraControl.target.position = [0, 0, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 10;
	perspectiveCamera.verticalFov = 50;
	//scene.addChild(new Harmony3D.Box({width: 200, height: 200, depth: 200}));
	scene.addChild(new Harmony3D.Sphere({ position: [0, 0, 100], radius: 100, scale: [1, 1, 2], segments: 32, rings: 32 }));

	await testCastray(renderer, scene);
}


async function testCastray(renderer, scene) {
	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GraphicsEvent.MouseDown, (event) => {
		let normalizedX = (event.detail.x / Harmony3D.Graphics.canvas.width) * 2 - 1;
		let normalizedY = 1 - (event.detail.y / Harmony3D.Graphics.canvas.height) * 2;

		let raycaster = new Harmony3D.Raycaster();
		let intersections = raycaster.castCameraRay(perspectiveCamera, normalizedX, normalizedY, [scene], true);
		console.error(intersections);


		for (let intersection of intersections) {
			let sphere = new Harmony3D.Sphere({radius:5});
			sphere.position = intersection.position;
			sphere.material.setMeshColor([1, 0, 0, 1]);
			scene.addChild(sphere);
		}
		return;


		console.error(normalizedX, normalizedY);

		let projectionMatrixInverse = perspectiveCamera.projectionMatrixInverse;
		let nearP = GlMatrix.vec3.fromValues(normalizedX, normalizedY, -0.9);
		let farP = GlMatrix.vec3.fromValues(normalizedX, normalizedY, 1);

		GlMatrix.vec3.transformMat4(nearP, nearP, projectionMatrixInverse);
		GlMatrix.vec3.transformMat4(farP, farP, projectionMatrixInverse);

		GlMatrix.vec3.transformQuat(nearP, nearP, perspectiveCamera.quaternion);
		GlMatrix.vec3.transformQuat(farP, farP, perspectiveCamera.quaternion);

		GlMatrix.vec3.add(nearP, nearP, perspectiveCamera.position);
		GlMatrix.vec3.add(farP, farP, perspectiveCamera.position);

		/*let sphere = new Harmony3D.Sphere(5);
		sphere.position = nearP;
		sphere.material.setMeshColor([1, 0, 0, 1]);
		scene.addChild(sphere);*/
		let rayLine = new Harmony3D.Line({ start: nearP, end: farP });
		rayLine.material.setMeshColor([0, 0, 1, 1]);
		scene.addChild(rayLine);


	});
	return;
	let rayOrigin = GlMatrix.vec3.fromValues(0, 1, 0);
	let rayDirection = GlMatrix.vec3.fromValues(-1, 0, 0);


	rayOrigin = GlMatrix.vec3.fromValues(0.7294220328330994, 0, 0);
	rayDirection = GlMatrix.vec3.fromValues(0.31372106075286865, -0.9005221128463745, 0);


	let raycaster = new Harmony3D.Raycaster();
	GlMatrix.vec3.normalize(rayDirection, rayDirection);
	let intersections = raycaster.castRay(rayOrigin, rayDirection, [scene], true);
	console.error(intersections);

	let rayLine = new Harmony3D.Line({ start: rayOrigin, end: GlMatrix.vec3.scaleAndAdd(GlMatrix.vec3.create(), rayOrigin, rayDirection, 1000000)});
	rayLine.material.setMeshColor([0, 0, 1, 1]);
	scene.addChild(rayLine);


	for (let intersection of intersections) {
		let sphere = new Harmony3D.Sphere({radius:5});
		sphere.position = intersection.position;
		sphere.material.setMeshColor([1, 0, 0, 1]);
		scene.addChild(sphere);
	}
}
