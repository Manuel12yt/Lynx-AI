import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';

export default async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('El archivo proporcionado no es válido.');
  }

  const { ext, mime } = await fileTypeFromBuffer(buffer);
  if (!ext || !mime) {
    throw new Error('No se pudo determinar el tipo de archivo.');
  }

  const form = new FormData();
  const blob = new Blob([buffer], { type: mime });
  form.append('file', blob, `tmp.${ext}`);

  try {
    const res = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      throw new Error(`Error en la subida: ${res.status} ${res.statusText}`);
    }

    const img = await res.json();
    if (img.error) {
      throw new Error(`Error en la respuesta: ${img.error}`);
    }

    return 'https://telegra.ph' + img[0].src;
  } catch (error) {
    console.error('Error al subir a Telegraph:', error);
    throw error;
  }
};
