declare module 'three/examples/jsm/controls/OrbitControls.js' {
    import { Camera, Object3D } from 'three';
    
    export class OrbitControls {
      constructor(camera: Camera, domElement?: HTMLElement);
      
      enabled: boolean;
      target: Object3D;
      minDistance: number;
      maxDistance: number;
      minZoom: number;
      maxZoom: number;
      minPolarAngle: number;
      maxPolarAngle: number;
      minAzimuthAngle: number;
      maxAzimuthAngle: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      enablePan: boolean;
      panSpeed: number;
      screenSpacePanning: boolean;
      keyPanSpeed: number;
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableKeys: boolean;
      
      update(): boolean;
      dispose(): void;
    }
  }