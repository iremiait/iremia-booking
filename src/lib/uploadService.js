// Servizio centralizzato per upload immagini su Cloudinary
const CLOUD_NAME = 'ddxyxcanp';
const UPLOAD_PRESET = 'ml_default';

export const uploadService = {
  async uploadImage(file) {
    if (!file) return null;

    if (file.size > 10 * 1024 * 1024) {
      alert('❌ File troppo grande. Massimo 10MB');
      return null;
    }

    if (!file.type.startsWith('image/')) {
      alert('❌ Seleziona un\'immagine valida (JPG, PNG, WebP)');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Errore upload Cloudinary');
    }

    const data = await response.json();
    // Restituisce URL ottimizzato con q_auto e f_auto
    return data.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');
  }
};
