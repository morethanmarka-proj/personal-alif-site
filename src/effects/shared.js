import * as THREE from "three";

export function instancedPlane(cols, rows) {
  const plane = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry().copy(plane);
  plane.dispose();
  const positions = new Float32Array(cols * rows * 2);
  for (let r = 0, i = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++, i++) {
      positions[i * 2] = c - (cols - 1) / 2;
      positions[i * 2 + 1] = r - (rows - 1) / 2;
    }
  }
  geometry.setAttribute(
    "aPos",
    new THREE.InstancedBufferAttribute(positions, 2),
  );
  geometry.instanceCount = cols * rows;
  return geometry;
}

export function planePointer(group, camera) {
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane();
  const point = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  return (pointer) => {
    group.updateMatrixWorld();
    camera.updateMatrixWorld();
    ndc.copy(pointer).multiplyScalar(2).subScalar(1);
    ray.setFromCamera(ndc, camera);
    plane.setFromNormalAndCoplanarPoint(
      normal.set(0, 0, 1).transformDirection(group.matrixWorld),
      group.getWorldPosition(point),
    );
    return ray.ray.intersectPlane(plane, point)
      ? group.worldToLocal(point)
      : null;
  };
}

export function disposeScene(scene) {
  scene.traverse((object) => {
    object.geometry?.dispose();
    if (object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) material.dispose();
    }
  });
}
