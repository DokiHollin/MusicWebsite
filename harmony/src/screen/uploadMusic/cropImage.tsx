import React, { useState } from 'react';
import { Area } from 'react-easy-crop';

export default function getCroppedImg(imageSrc: string, croppedAreaPixels: Area) {
  
 

  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { x, y, width, height } = croppedAreaPixels;  // Use croppedAreaPixels instead of crop

  canvas.width = width;
  canvas.height = height;

  ctx?.drawImage(image, x, y, width, height, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}
