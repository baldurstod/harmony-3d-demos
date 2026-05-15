// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// See https://github.com/nv-tlabs/kimodo/blob/main/kimodo/skeleton/definitions.py

import { Bone, Entity, Skeleton } from 'harmony-3d';

export type Skel = {
	readonly name: string,
	readonly rightFootJointNames: string[],
	readonly leftFootJointNames: string[],
	readonly rightHandJointNames: string[],
	readonly leftHandJointNames: string[],
	readonly hipJointNames: string[],
	readonly boneOrderNamesWithParents: [string, string | null][],
	getParentBone: (boneId: number) => number | null,
}


export class SOMASkeleton {
	static readonly name: string;
	static readonly rightFootJointNames: string[];
	static readonly leftFootJointNames: string[];
	static readonly rightHandJointNames: string[];
	static readonly leftHandJointNames: string[];
	static readonly hipJointNames: string[];
	static readonly boneOrderNamesWithParents: [string, string | null][];

	static getParentBone(boneId: number): number | null {
		const b = this.boneOrderNamesWithParents[boneId];
		if (!b) {
			return null;
		}

		const [, parentName] = b;

		for (const [parentId, [name]] of this.boneOrderNamesWithParents.entries()) {
			if (parentName === name) {
				return parentId;
			}
		}

		return null;
	}
}

/**
 * High-detail 77-joint SOMA skeleton with full finger and toe chains.
 */
export class SOMASkeleton77 extends SOMASkeleton {
	static readonly name = 'somaskel77' as const;

	static readonly rightFootJointNames: string[] = [
		'RightFoot',
		'RightToeBase',
		'RightToeEnd',
	] as const;  // in order of chain
	static readonly leftFootJointNames: string[] = [
		'LeftFoot',
		'LeftToeBase',
		'LeftToeEnd',
	];  // in order of chain
	static readonly rightHandJointNames: string[] = [
		'RightHand',
		'RightHandThumb1',
		'RightHandThumb2',
		'RightHandThumb3',
		'RightHandThumbEnd',
		'RightHandIndex1',
		'RightHandIndex2',
		'RightHandIndex3',
		'RightHandIndex4',
		'RightHandIndexEnd',
		'RightHandMiddle1',
		'RightHandMiddle2',
		'RightHandMiddle3',
		'RightHandMiddle4',
		'RightHandMiddleEnd',
		'RightHandRing1',
		'RightHandRing2',
		'RightHandRing3',
		'RightHandRing4',
		'RightHandRingEnd',
		'RightHandPinky1',
		'RightHandPinky2',
		'RightHandPinky3',
		'RightHandPinky4',
		'RightHandPinkyEnd',
	] as const; // in order of chain
	static readonly leftHandJointNames: string[] = [
		'LeftHand',
		'LeftHandThumb1',
		'LeftHandThumb2',
		'LeftHandThumb3',
		'LeftHandThumbEnd',
		'LeftHandIndex1',
		'LeftHandIndex2',
		'LeftHandIndex3',
		'LeftHandIndex4',
		'LeftHandIndexEnd',
		'LeftHandMiddle1',
		'LeftHandMiddle2',
		'LeftHandMiddle3',
		'LeftHandMiddle4',
		'LeftHandMiddleEnd',
		'LeftHandRing1',
		'LeftHandRing2',
		'LeftHandRing3',
		'LeftHandRing4',
		'LeftHandRingEnd',
		'LeftHandPinky1',
		'LeftHandPinky2',
		'LeftHandPinky3',
		'LeftHandPinky4',
		'LeftHandPinkyEnd',
	] as const;  // in order of chain
	static readonly hipJointNames: string[] = ['RightLeg', 'LeftLeg'];  // in order [right, left]
	static readonly boneOrderNamesWithParents: [string, string | null][] = [
		['Hips', null],
		['Spine1', 'Hips'],
		['Spine2', 'Spine1'],
		['Chest', 'Spine2'],
		['Neck1', 'Chest'],
		['Neck2', 'Neck1'],
		['Head', 'Neck2'],
		['HeadEnd', 'Head'],
		['Jaw', 'Head'],
		['LeftEye', 'Head'],
		['RightEye', 'Head'],
		['LeftShoulder', 'Chest'],
		['LeftArm', 'LeftShoulder'],
		['LeftForeArm', 'LeftArm'],
		['LeftHand', 'LeftForeArm'],
		['LeftHandThumb1', 'LeftHand'],
		['LeftHandThumb2', 'LeftHandThumb1'],
		['LeftHandThumb3', 'LeftHandThumb2'],
		['LeftHandThumbEnd', 'LeftHandThumb3'],
		['LeftHandIndex1', 'LeftHand'],
		['LeftHandIndex2', 'LeftHandIndex1'],
		['LeftHandIndex3', 'LeftHandIndex2'],
		['LeftHandIndex4', 'LeftHandIndex3'],
		['LeftHandIndexEnd', 'LeftHandIndex4'],
		['LeftHandMiddle1', 'LeftHand'],
		['LeftHandMiddle2', 'LeftHandMiddle1'],
		['LeftHandMiddle3', 'LeftHandMiddle2'],
		['LeftHandMiddle4', 'LeftHandMiddle3'],
		['LeftHandMiddleEnd', 'LeftHandMiddle4'],
		['LeftHandRing1', 'LeftHand'],
		['LeftHandRing2', 'LeftHandRing1'],
		['LeftHandRing3', 'LeftHandRing2'],
		['LeftHandRing4', 'LeftHandRing3'],
		['LeftHandRingEnd', 'LeftHandRing4'],
		['LeftHandPinky1', 'LeftHand'],
		['LeftHandPinky2', 'LeftHandPinky1'],
		['LeftHandPinky3', 'LeftHandPinky2'],
		['LeftHandPinky4', 'LeftHandPinky3'],
		['LeftHandPinkyEnd', 'LeftHandPinky4'],
		['RightShoulder', 'Chest'],
		['RightArm', 'RightShoulder'],
		['RightForeArm', 'RightArm'],
		['RightHand', 'RightForeArm'],
		['RightHandThumb1', 'RightHand'],
		['RightHandThumb2', 'RightHandThumb1'],
		['RightHandThumb3', 'RightHandThumb2'],
		['RightHandThumbEnd', 'RightHandThumb3'],
		['RightHandIndex1', 'RightHand'],
		['RightHandIndex2', 'RightHandIndex1'],
		['RightHandIndex3', 'RightHandIndex2'],
		['RightHandIndex4', 'RightHandIndex3'],
		['RightHandIndexEnd', 'RightHandIndex4'],
		['RightHandMiddle1', 'RightHand'],
		['RightHandMiddle2', 'RightHandMiddle1'],
		['RightHandMiddle3', 'RightHandMiddle2'],
		['RightHandMiddle4', 'RightHandMiddle3'],
		['RightHandMiddleEnd', 'RightHandMiddle4'],
		['RightHandRing1', 'RightHand'],
		['RightHandRing2', 'RightHandRing1'],
		['RightHandRing3', 'RightHandRing2'],
		['RightHandRing4', 'RightHandRing3'],
		['RightHandRingEnd', 'RightHandRing4'],
		['RightHandPinky1', 'RightHand'],
		['RightHandPinky2', 'RightHandPinky1'],
		['RightHandPinky3', 'RightHandPinky2'],
		['RightHandPinky4', 'RightHandPinky3'],
		['RightHandPinkyEnd', 'RightHandPinky4'],
		['LeftLeg', 'Hips'],
		['LeftShin', 'LeftLeg'],
		['LeftFoot', 'LeftShin'],
		['LeftToeBase', 'LeftFoot'],
		['LeftToeEnd', 'LeftToeBase'],
		['RightLeg', 'Hips'],
		['RightShin', 'RightLeg'],
		['RightFoot', 'RightShin'],
		['RightToeBase', 'RightFoot'],
		['RightToeEnd', 'RightToeBase'],
	] as const;
}

export function createSOMASkeleton77(params?: { name?: string, parent?: Entity }): Skeleton {
	const skeleton = new Skeleton(params);

	const bones = new Map<string, Bone>();
	for (const [boneId, [boneName, parentName]] of SOMASkeleton77.boneOrderNamesWithParents.entries()) {
		const bone = skeleton.addBone(boneId, boneName);

		bones.set(boneName, bone);

		const parentBone = bones.get(parentName!);
		if (parentBone) {
			parentBone.addChild(bone);
		} else {
			skeleton.addChild(bone);
		}
	}
	return skeleton;
}
