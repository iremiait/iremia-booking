import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Image as ImageIcon, GripVertical, Plus, Link, Edit2, Check, X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadService } from '../../lib/uploadService';

const ImageManager = () => {
  const [heroImage, setHeroImage] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingAlt, setEditingAlt] = useState('');
  const [dbId, setDbId] = useState(null);
  const galleryRef = useRef([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Errore caricamento:', error);
        return;
      }

      if (data) {
        setDbId(data.id);
        setHeroImage(data.hero_url || '');
        setLogoImage(data.logo_url || '');
        const urls = data.gallery_urls || [];
        const normalized = urls.map((item, i) =>
          typeof item === 'string'
            ? { url: item, alt: `Foto ${i + 1}` }
            : item
        );
        setGalleryImages(normalized);
        galleryRef.current = normalized;
      }
    } catch (error) {
      console.error('❌ Errore catch:', error);
    }
    setLoading(false);
  };

  const saveField = async (updates) => {
    setSaving(true);
    try {
      if (dbId) {
        const { error } = await supabase
          .from('site_images')
          .update(updates)
          .eq('id', dbId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('site_images')
          .insert([updates])
          .select();
        if (error) throw error;
        if (data?.[0]) setDbId(data[0].id);
      }
      alert('✅ Salvato!');
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
      alert('❌ Errore: ' + error.message);
    }
    setSaving(false);
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      if (url) {
        setHeroImage(url);
        await saveField({ hero_url: url });
      }
    } catch (error) {
      alert('❌ Errore upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      if (url) {
        setLogoImage(url);
        await saveField({ logo_url: url });
      }
    } catch (error) {
      alert('❌ Errore upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const saveHeroUrl = async () => {
    if (!heroImage.trim()) return;
    await saveField({ hero_url: heroImage.trim() });
  };

  const saveLogoUrl = async () => {
    if (!logoImage.trim()) return;
    await saveField({ logo_url: logoImage.trim() });
  };

  const addImage = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) { alert('❌ Inserisci un URL valido'); return; }
    if (galleryImages.find(img => img.url === trimmed)) { alert('❌ Immagine già presente'); return; }
    const newImage = { url: trimmed, alt: newAlt.trim() || `Foto ${galleryImages.length + 1}` };
    const updated = [...galleryImages, newImage];
    setGalleryImages(updated);
    galleryRef.current = updated;
    setNewUrl('');
    setNewAlt('');
  };

  const deleteImage = (index) => {
    if (!confirm('Eliminare questa immagine?')) return;
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    galleryRef.current = updated;
  };

  const startEditAlt = (index) => {
    setEditingIndex(index);
    setEditingAlt(galleryImages[index].alt);
  };

  const saveAlt = async (index) => {
    const updated = galleryImages.map((img, i) =>
      i === index ? { ...img, alt: editingAlt.trim() || img.alt } : img
    );
    setGalleryImages(updated);
    galleryRef.current = updated;
    setEditingIndex(null);
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_images')
        .update({ gallery_urls: updated })
        .eq('id', dbId);
      if (error) throw error;
    } catch (error) {
      console.error('❌ Errore salvataggio alt:', error);
      alert('❌ Errore nel salvataggio del titolo: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveGallery = async () => {
    await saveField({ gallery_urls: galleryRef.current });
  };

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newGallery = [...galleryRef.current];
    const draggedItem = newGallery[draggedIndex];
    newGallery.splice(draggedIndex, 1);
    newGallery.splice(index, 0, draggedItem);
    setGalleryImages(newGallery);
    galleryRef.current = newGallery;
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Hero Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={22} className="text-teal-600" />
          Immagine Hero (sfondo principale)
        </h3>

        {heroImage && (
          <div className="mb-4 rounded-xl overflow-hidden h-48">
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex gap-3 mb-3">
          <input
            type="url"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="https://..."
          />
          <button
            onClick={saveHeroUrl}
            disabled={saving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            Salva URL
          </button>
        </div>

        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition text-center">
            <Upload className="mx-auto mb-1 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">
              {uploading ? '⏳ Caricamento su Cloudinary...' : 'oppure carica un file'}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP (max 10MB) · Le immagini vengono caricate su Cloudinary</p>
          </div>
          <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={22} className="text-teal-600" />
          Logo
        </h3>

        {logoImage && (
          <div className="mb-4 bg-gray-100 rounded-xl p-6 flex justify-center">
            <img src={logoImage} alt="Logo" className="h-24 object-contain" />
          </div>
        )}

        <div className="flex gap-3 mb-3">
          <input
            type="url"
            value={logoImage}
            onChange={(e) => setLogoImage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="https://..."
          />
          <button
            onClick={saveLogoUrl}
            disabled={saving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            Salva URL
          </button>
        </div>

        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition text-center">
            <Upload className="mx-auto mb-1 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">
              {uploading ? '⏳ Caricamento su Cloudinary...' : 'oppure carica un file'}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP (max 10MB) · Le immagini vengono caricate su Cloudinary</p>
          </div>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Galleria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Link size={22} className="text-teal-600" />
          Galleria Foto (Cloudinary)
        </h3>

        <div className="space-y-3 mb-6">
          {/* Upload diretto su Cloudinary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo / Descrizione (per l'upload)</label>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Es: Soggiorno, Camera da letto, Biglietto da visita..."
            />
          </div>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition text-center">
              <Upload className="mx-auto mb-1 text-gray-400" size={24} />
              <p className="text-sm text-gray-600">
                {uploading ? '⏳ Caricamento su Cloudinary...' : '📤 Carica foto su Cloudinary'}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP (max 10MB) · Le immagini vengono caricate su Cloudinary</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUploading(true);
                try {
                  const url = await uploadService.uploadImage(file);
                  if (url) {
                    const newImage = { url, alt: newAlt.trim() || `Foto ${galleryImages.length + 1}` };
                    const updated = [...galleryImages, newImage];
                    setGalleryImages(updated);
                    galleryRef.current = updated;
                    setNewAlt('');
                    alert('✅ Foto caricata! Clicca "💾 Salva Galleria" per confermare.');
                  }
                } catch (error) {
                  alert('❌ Errore upload: ' + error.message);
                } finally {
                  setUploading(false);
                  e.target.value = '';
                }
              }}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* Separatore */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">oppure aggiungi URL</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Immagine</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://res.cloudinary.com/..."
            />
          </div>
          <button
            onClick={addImage}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Aggiungi da URL
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-700">
            Foto in galleria ({galleryImages.length})
          </h4>
          <button
            onClick={saveGallery}
            disabled={saving}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Salvataggio...
              </>
            ) : '💾 Salva Galleria'}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700">
            💡 <strong>Modifica titolo:</strong> clicca ✏️ sulla foto, modifica e premi ✓ — salva automaticamente.
            <br />
            <strong>Aggiungi / elimina / riordina foto:</strong> clicca "💾 Salva Galleria" per confermare.
          </p>
        </div>

        {galleryImages.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <ImageIcon className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-500">Nessuna foto nella galleria</p>
            <p className="text-sm text-gray-400 mt-1">Aggiungi i tuoi URL Cloudinary qui sopra</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">💡 Trascina per riordinare · Hover sulla foto per modificare titolo o eliminare · Poi clicca "Salva Galleria"</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group rounded-xl overflow-hidden border-2 transition cursor-move ${
                    draggedIndex === index
                      ? 'border-teal-500 opacity-50'
                      : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  <div className="aspect-square">
                    <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                  </div>

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    <button onClick={() => startEditAlt(index)} className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition" title="Modifica titolo">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteImage(index)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition" title="Elimina">
                      <Trash2 size={16} />
                    </button>
                    <div className="bg-white/20 text-white p-2 rounded-lg">
                      <GripVertical size={16} />
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                    #{index + 1}
                  </div>

                  {image.alt?.toLowerCase().includes('biglietto da visita') && (
                    <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-lg">
                      📇
                    </div>
                  )}

                  {editingIndex === index ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-white p-2 flex gap-1">
                      <input
                        type="text"
                        value={editingAlt}
                        onChange={(e) => setEditingAlt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveAlt(index)}
                        className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
                        autoFocus
                        placeholder="Titolo foto..."
                      />
                      <button onClick={() => saveAlt(index)} className="p-1 bg-teal-500 text-white rounded" title="Salva">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingIndex(null)} className="p-1 bg-gray-300 text-gray-700 rounded" title="Annulla">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                      {image.alt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageManager;
