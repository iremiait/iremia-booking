import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Image as ImageIcon, GripVertical, Plus, Link, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ImageManager = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingAlt, setEditingAlt] = useState('');
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
        const urls = data.gallery_urls || [];
        // Supporta sia il vecchio formato (stringhe) che il nuovo ({url, alt})
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

  const saveGallery = async (images) => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('site_images')
        .select('id')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_images')
          .update({ gallery_urls: images })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_images')
          .insert([{ gallery_urls: images }]);
        if (error) throw error;
      }
      alert('✅ Galleria salvata!');
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const addImage = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) {
      alert('❌ Inserisci un URL valido');
      return;
    }
    if (galleryImages.find(img => img.url === trimmed)) {
      alert('❌ Questa immagine è già presente');
      return;
    }
    const newImage = { url: trimmed, alt: newAlt.trim() || `Foto ${galleryImages.length + 1}` };
    const updated = [...galleryImages, newImage];
    setGalleryImages(updated);
    galleryRef.current = updated;
    setNewUrl('');
    setNewAlt('');
  };

  const deleteImage = (index) => {
    if (!confirm('Eliminare questa immagine dalla galleria?')) return;
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    galleryRef.current = updated;
  };

  const startEditAlt = (index) => {
    setEditingIndex(index);
    setEditingAlt(galleryImages[index].alt);
  };

  const saveAlt = (index) => {
    const updated = galleryImages.map((img, i) =>
      i === index ? { ...img, alt: editingAlt.trim() || img.alt } : img
    );
    setGalleryImages(updated);
    galleryRef.current = updated;
    setEditingIndex(null);
    setEditingAlt('');
  };

  // Drag & Drop
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

      {/* Aggiungi Immagine */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Link size={22} className="text-teal-600" />
          Aggiungi Immagine Cloudinary
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Immagine *</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://res.cloudinary.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo / Descrizione</label>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Es: Soggiorno, Camera da letto, Balcone..."
            />
          </div>
          <button
            onClick={addImage}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Aggiungi Foto
          </button>
        </div>
      </div>

      {/* Galleria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            <ImageIcon size={22} className="text-teal-600" />
            Galleria ({galleryImages.length} foto)
          </h3>
          <button
            onClick={() => saveGallery(galleryRef.current)}
            disabled={saving}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Salvataggio...
              </>
            ) : (
              '💾 Salva'
            )}
          </button>
        </div>

        {galleryImages.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <ImageIcon className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-500">Nessuna foto nella galleria</p>
            <p className="text-sm text-gray-400 mt-1">Aggiungi i tuoi URL Cloudinary qui sopra</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">💡 Trascina per riordinare · Clicca ✏️ per modificare il titolo · Poi clicca "Salva"</p>
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
                  {/* Immagine */}
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay azioni */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => startEditAlt(index)}
                      className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition"
                      title="Modifica titolo"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteImage(index)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      title="Elimina"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="bg-white/20 text-white p-2 rounded-lg">
                      <GripVertical size={16} />
                    </div>
                  </div>

                  {/* Numero */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                    #{index + 1}
                  </div>

                  {/* Titolo - editing inline */}
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
                      <button onClick={() => saveAlt(index)} className="p-1 bg-teal-500 text-white rounded">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingIndex(null)} className="p-1 bg-gray-300 text-gray-700 rounded">
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
