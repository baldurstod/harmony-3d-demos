import { vec3 } from 'gl-matrix';
import { Box, GraphicsEvent, GraphicsEvents, GraphicTickEvent, Grid, LineSegments, Path, Scene } from 'harmony-3d';
import { InitDemoStd } from '../../utils/utils';
import { Demo, InitDemoParams, registerDemo } from '../demos';

class CurvesDemo implements Demo {
	static readonly path = 'misc/curves';

	initDemo(scene: Scene, params: InitDemoParams): void {
		const [perspectiveCamera, orbitCameraControl] = InitDemoStd(scene);
		perspectiveCamera.position = [500, 500, 6000];
		orbitCameraControl.target.position = [500, 500, 0];
		perspectiveCamera.farPlane = 10000;
		perspectiveCamera.nearPlane = 0.1;
		perspectiveCamera.verticalFov = 10;
		testCurves(scene);
	}
}

registerDemo(CurvesDemo);

async function testCurves(scene: Scene) {
	//let curve = new LinearBezierCurve([0, 0, 0], [10, 10, 10]);
	//curve = new QuadraticBezierCurve([0, 0, 0], [10, 0, 0], [10, 10, 0]);
	//curve = new CubicBezierCurve([0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 10]);
	let curve = new Path();
	//curve.fromSvgPath('m -2 0 l 380 994 l 522 994 l 928 0 l 779 0 l 663 301 l 247 301 l 138 0 l -2 0 m 285 408 l 622 408 l 518 684 q 448 890 471 809 q 394 700 429 794 l 285 408 z');
	curve.fromSvgPath("m 102 0 l 102 994 l 475 994 q 657 964 589 994 q 765 871 726 934 q 804 740 804 808 q 770 620 804 676 q 665 529 735 564 q 804 439 755 503 q 852 288 852 375 q 823 158 852 218 q 750 66 793 98 q 641 17 707 33 q 481 0 576 0 l 102 0 m 233 576 l 448 576 q 574 588 536 576 q 649 637 624 603 q 675 724 675 672 q 651 811 675 774 q 583 863 627 849 q 432 877 539 877 l 233 877 l 233 576 m 233 117 l 481 117 q 570 122 545 117 q 646 149 616 130 q 696 204 677 168 q 716 288 716 241 q 688 385 716 344 q 609 443 659 426 q 463 459 558 459 l 233 459 l 233 117 z ");

	//curve.fromSvgPath('"m 0 0 q 10 0 10 10 q 20 10 0 0 z');
	//curve.fromSvgPath('m 102 0 l 102 994 l 475 994 q 657 964 589 994 q 765 871 726 934');
	//curve.fromSvgPath('m 10 10 c 20 20 40 20 50 10');
	console.error(curve.curves);
	/*
		scene.addChild(new Sphere()).position = curve.p0;
		scene.addChild(new Sphere()).position = curve.p1;
		scene.addChild(new Sphere()).position = curve.p2;
		scene.addChild(new Sphere()).position = curve.p3;
		*/

	let box = scene.addChild(new Box({ width: 20, height: 20, depth: 20 }))!;
	let grid = scene.addChild(new Grid({ spacing: 5 }));

	let t = 0;
	let pos = vec3.create();
	function animate(event: Event) {
		(event as CustomEvent<GraphicTickEvent>).detail.delta;
		t += (event as CustomEvent<GraphicTickEvent>).detail.delta / 20;
		t = t % 1;
		curve.getPosition(t, pos);
		box.position = pos;

	}
	GraphicsEvents.addEventListener(GraphicsEvent.Tick, animate);

	let line = scene.addChild(new LineSegments()) as LineSegments;
	let segments = [];
	let division = 1000;
	for (let i = 0; i < division; i++) {
		segments.push(...curve.getPosition(i / division));
	}

	line.setSegments(segments);

	console.error(curve.getArcLength(10));


}
