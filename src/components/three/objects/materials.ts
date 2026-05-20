"use client";

import * as THREE from "three";

/**
 * Shared material factories so every detailed object pulls from the same
 * palette. Memoize at the call site if you create many copies per frame.
 */

export const matChassis = () =>
  new THREE.MeshStandardMaterial({
    color: "#0e1224",
    metalness: 0.85,
    roughness: 0.32,
  });

export const matAluminum = () =>
  new THREE.MeshStandardMaterial({
    color: "#cdd2dc",
    metalness: 0.95,
    roughness: 0.18,
  });

export const matDarkMetal = () =>
  new THREE.MeshStandardMaterial({
    color: "#1a1f33",
    metalness: 0.9,
    roughness: 0.35,
  });

export const matBlackPlastic = () =>
  new THREE.MeshStandardMaterial({
    color: "#0a0d18",
    metalness: 0.4,
    roughness: 0.55,
  });

export const matKeycap = () =>
  new THREE.MeshStandardMaterial({
    color: "#1c2236",
    metalness: 0.3,
    roughness: 0.7,
  });

export const matGlassScreen = (emissive = "#1d4ed8", intensity = 0.18) =>
  new THREE.MeshStandardMaterial({
    color: "#05070f",
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    metalness: 0.85,
    roughness: 0.1,
    transparent: true,
    opacity: 0.96,
  });

export const matGold = () =>
  new THREE.MeshStandardMaterial({
    color: "#f5c84a",
    emissive: "#7a4a00",
    emissiveIntensity: 0.2,
    metalness: 0.95,
    roughness: 0.18,
  });

export const matSilver = () =>
  new THREE.MeshStandardMaterial({
    color: "#dadde6",
    metalness: 0.95,
    roughness: 0.25,
  });

export const matWoodDark = () =>
  new THREE.MeshStandardMaterial({
    color: "#3a2410",
    metalness: 0.05,
    roughness: 0.85,
  });

export const matMarble = () =>
  new THREE.MeshStandardMaterial({
    color: "#1c2238",
    metalness: 0.7,
    roughness: 0.4,
  });

export const matEmissive = (color: string, intensity = 1.4) =>
  new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    metalness: 0.4,
    roughness: 0.4,
  });

export const matGlow = (color: string, opacity = 0.6) =>
  new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
