// Framework-free three.js scene for the 3D model preview. Loaded only in the browser
// (the React component imports this module dynamically), so it never runs during SSR.
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import URDFLoader from 'urdf-loader';

const MOVABLE = new Set(['revolute', 'continuous', 'prismatic']);

function disposeTree(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
  });
}

export function createViewer(container, {onStatus = () => {}, onJoints = () => {}} = {}) {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'urdf-viewer__canvas';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x80888d, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(2.5, 4, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.7);
  fill.position.set(-3, 2, -2);
  scene.add(fill);
  // Neutral body color: the exported URDF colors are placeholders, not the product finish.
  const material = new THREE.MeshStandardMaterial({color: 0xd2d7db, metalness: 0.15, roughness: 0.55, flatShading: true});

  let robot = null;
  let grid = null;
  let disposed = false;
  let frame = 0;
  let token = 0;
  const home = {target: new THREE.Vector3(), position: new THREE.Vector3()};

  const render = () => {
    if (disposed || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      renderer.render(scene, camera);
    });
  };
  controls.addEventListener('change', render);

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  function fit(model) {
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const radius = size.length() / 2;
    const dist = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.78;
    const dir = new THREE.Vector3(0.9, 0.45, 1.1).normalize();
    camera.near = dist / 100;
    camera.far = dist * 100;
    camera.position.copy(center).addScaledVector(dir, dist);
    camera.updateProjectionMatrix();
    controls.target.copy(center);
    controls.update();
    home.target.copy(controls.target);
    home.position.copy(camera.position);
    if (grid) {
      scene.remove(grid);
      grid.geometry.dispose();
    }
    const span = Math.max(size.x, size.z, 0.2) * 3;
    grid = new THREE.GridHelper(span, 20, 0x8f989d, 0xc3c9cc);
    grid.material.transparent = true;
    grid.material.opacity = 0.45;
    grid.position.set(center.x, box.min.y, center.z);
    scene.add(grid);
  }

  function jointsOf(model) {
    return Object.values(model.joints)
      .filter((j) => MOVABLE.has(j.jointType) && !j.isURDFMimicJoint)
      .map((j) => {
        const continuous = j.jointType === 'continuous';
        const lower = continuous || j.limit.lower === j.limit.upper ? -Math.PI : j.limit.lower;
        const upper = continuous || j.limit.lower === j.limit.upper ? Math.PI : j.limit.upper;
        const start = Math.min(upper, Math.max(lower, 0));
        return {name: j.name, type: j.jointType, lower, upper, value: start};
      });
  }

  function load(url) {
    const mine = ++token;
    if (robot) {
      scene.remove(robot);
      disposeTree(robot);
      robot = null;
    }
    onJoints([]);
    onStatus('loading');
    render();
    const manager = new THREE.LoadingManager();
    const urdf = new URDFLoader(manager);
    const gltf = new GLTFLoader(manager);
    urdf.loadMeshCb = (path, mgr, mat, done) => {
      gltf.load(path, (g) => {
        g.scene.traverse((o) => {
          if (o.isMesh) o.material = material;
        });
        done(g.scene);
      }, undefined, (err) => done(null, err));
    };
    let model = null;
    let failed = false;
    manager.onError = () => {
      failed = true;
    };
    manager.onLoad = () => {
      if (disposed || mine !== token || !model) return;
      fit(model);
      onStatus(failed ? 'partial' : 'ready');
      render();
    };
    urdf.load(url, (m) => {
      if (disposed || mine !== token) {
        disposeTree(m);
        return;
      }
      model = m;
      m.rotation.x = -Math.PI / 2; // URDF is Z-up; three.js is Y-up
      const joints = jointsOf(m);
      joints.forEach((j) => m.setJointValue(j.name, j.value));
      robot = m;
      scene.add(m);
      onJoints(joints);
    }, undefined, () => {
      if (mine === token) onStatus('error');
    });
  }

  return {
    load,
    setJoint(name, value) {
      if (!robot) return;
      robot.setJointValue(name, value);
      render();
    },
    resetView() {
      controls.target.copy(home.target);
      camera.position.copy(home.position);
      controls.update();
      render();
    },
    dispose() {
      disposed = true;
      token++;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      if (robot) disposeTree(robot);
      if (grid) grid.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
