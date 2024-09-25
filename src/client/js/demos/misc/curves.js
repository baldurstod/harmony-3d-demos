import { InitDemoStd, Harmony3D, GlMatrix } from '/js/application.js';

let perspectiveCamera;
let orbitCameraControl;
export function initDemo(renderer, scene) {
	[perspectiveCamera, orbitCameraControl] = InitDemoStd(renderer, scene);
	perspectiveCamera.position = [500, 500, 6000];
	orbitCameraControl.target.position = [500, 500, 0];
	perspectiveCamera.farPlane = 10000;
	perspectiveCamera.nearPlane = 0.1;
	perspectiveCamera.verticalFov = 10;
	TestCurves(renderer, scene);

}

async function TestCurves(renderer, scene) {
	let curve = new Harmony3D.LinearBezierCurve([0, 0, 0], [10, 10, 10]);
	curve = new Harmony3D.QuadraticBezierCurve([0, 0, 0], [10, 0, 0], [10, 10, 0]);
	curve = new Harmony3D.CubicBezierCurve([0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 10]);
	curve = new Harmony3D.Path();
	//curve.fromSvgPath('m -2 0 l 380 994 l 522 994 l 928 0 l 779 0 l 663 301 l 247 301 l 138 0 l -2 0 m 285 408 l 622 408 l 518 684 q 448 890 471 809 q 394 700 429 794 l 285 408 z');
	curve.fromSvgPath("m 102 0 l 102 994 l 475 994 q 657 964 589 994 q 765 871 726 934 q 804 740 804 808 q 770 620 804 676 q 665 529 735 564 q 804 439 755 503 q 852 288 852 375 q 823 158 852 218 q 750 66 793 98 q 641 17 707 33 q 481 0 576 0 l 102 0 m 233 576 l 448 576 q 574 588 536 576 q 649 637 624 603 q 675 724 675 672 q 651 811 675 774 q 583 863 627 849 q 432 877 539 877 l 233 877 l 233 576 m 233 117 l 481 117 q 570 122 545 117 q 646 149 616 130 q 696 204 677 168 q 716 288 716 241 q 688 385 716 344 q 609 443 659 426 q 463 459 558 459 l 233 459 l 233 117 z ");

	//curve.fromSvgPath('"m 0 0 q 10 0 10 10 q 20 10 0 0 z');
	//curve.fromSvgPath('m 102 0 l 102 994 l 475 994 q 657 964 589 994 q 765 871 726 934');
	//curve.fromSvgPath('m 10 10 c 20 20 40 20 50 10');
	console.error(curve.curves);
	/*
		scene.addChild(new Harmony3D.Sphere()).position = curve.p0;
		scene.addChild(new Harmony3D.Sphere()).position = curve.p1;
		scene.addChild(new Harmony3D.Sphere()).position = curve.p2;
		scene.addChild(new Harmony3D.Sphere()).position = curve.p3;
		*/

	let box = scene.addChild(new Harmony3D.Box({ width: 20, height: 20, depth: 20 }));
	let grid = scene.addChild(new Harmony3D.Grid(undefined, 5));

	let t = 0;
	let pos = GlMatrix.vec3.create();
	function animate(event) {
		event.detail.delta;
		t += event.detail.delta / 20;
		t = t % 1;
		curve.getPosition(t, pos);
		box.position = pos;

	}
	Harmony3D.GraphicsEvents.addEventListener(Harmony3D.GraphicsEvent.Tick, animate);

	let line = scene.addChild(new Harmony3D.LineSegments());
	let segments = [];
	let division = 1000;
	for (let i = 0; i < division; i++) {
		segments.push(...curve.getPosition(i / division));
	}

	line.setSegments(segments);

	console.error(curve.getArcLength(10));


}
