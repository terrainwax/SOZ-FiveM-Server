import { OrbitControls, PerspectiveCamera, TransformControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FunctionComponent, useRef } from 'react';
import THREE from 'three';
import * as Utils from 'three/src/math/MathUtils';

import { useNuiEvent } from '../../hook/nui';
import { isEnvBrowser, modeType, spaceType } from '../../utils/misc';
import { fetchNui } from '../../fetch';
import { NuiEvent } from '../../../shared/event';

export const HousingEditor: FunctionComponent = () => {
    let propPosition = new THREE.Vector3(0, 0, 0);
    let propRotation = new THREE.Euler(Utils.degToRad(-90), 0, 0);
    let cameraPosition = new THREE.Vector3(propPosition.x + 1, propPosition.y + 1, propPosition.z + 1);
    let entity: number;
    const camera = useRef<THREE.PerspectiveCamera>();
    const mesh = useRef<THREE.Mesh>();

    const mode: modeType = 'translate';
    const space: spaceType = 'world';
    let offset: THREE.Vector3;

    const planeSize = isEnvBrowser() ? new THREE.PlaneGeometry(2, 2) : new THREE.PlaneGeometry(0, 0);

    const updatePositions = (updateCamera = true) => {
        const data: { prop: any; camera?: any } = {
            prop: {
                entity: entity,
                position: propPosition,
                rotation: {
                    x: Utils.radToDeg(propRotation.x),
                    y: Utils.radToDeg(propRotation.y),
                    z: Utils.radToDeg(propRotation.z),
                },
            },
        };

        if (updateCamera && camera) {
            data.camera = {
                position: camera.current.position,
            };
        }

        !isEnvBrowser() && fetchNui(NuiEvent.HousingUpdatePropsPreview, data);
    };

    useNuiEvent('housing', 'setupProps', (data) => {
        entity = data.entity;
        propPosition = data.position;
        propRotation = data.rotation;
    });

    const mouseDown = () => {
        offset = new THREE.Vector3(
            camera.current.position.x - mesh.current.position.x,
            camera.current.position.y - mesh.current.position.y,
            camera.current.position.z - mesh.current.position.z,
        );
    };

    const mouseUp = () => {
        propPosition = mesh.current.position;
        propRotation = mesh.current.rotation;
        cameraPosition = new THREE.Vector3().addVectors(offset, mesh.current.position);
        camera.current.lookAt(propPosition);
    };

    return (
        <Canvas>
            <PerspectiveCamera ref={camera} position={cameraPosition} fov={70} />
            <OrbitControls
                camera={camera.current}
                target={propPosition}
                enablePan={false}
                onChange={() => updatePositions(true)}
            />
            <ambientLight intensity={0.5} />
            <mesh
                ref={mesh}
                geometry={planeSize}
                material={
                    new THREE.MeshStandardMaterial({
                        color: 'white',
                        side: THREE.DoubleSide,
                    })
                }
                position={propPosition}
                rotation={propRotation}
            >
                <TransformControls
                    mode={mode}
                    size={0.75}
                    space={space}
                    onMouseUp={mouseUp}
                    onMouseDown={mouseDown}
                    onObjectChange={() => updatePositions(false)}
                />
            </mesh>
        </Canvas>
    );
};
