import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Image as ImageIcon, GripVertical, Plus, Link } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ImageManager = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
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
        setGalleryImages(urls);
        galleryRef.current = urls;
      }
    } catch (error) {
      console.error('❌ Errore catch:', error);
    }
    setLoading(false);
  };

  const saveGallery = async (urls) => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('site_images')
        .select('id')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_images')
          .update({ gallery_urls: urls })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_images')
          .insert([{ gallery_urls: urls }]);
        if (error) throw error;
      }
      alert('✅ Galleria salvata!');
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
    setSaving(false);
  };

  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) {
      alert('❌ Inserisci un URL valido');
      return;
    }
    if (galleryImages.includes(trimmed)) {
      alert('❌ Questa immagine è già presente');
      return;
    }
    const updated = [...galleryImages, trimmed];
    setGalleryImages(updated);
    galleryRef.current = updated;
    setNewUrl('');
  };

  const addMultipleUrls = (text) => {
    const urls = text
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.startsWith('http') && !galleryImages.includes(u));

    if (urls.length === 0) {
      alert('❌ Nessun URL valido trovato');
      return;
    }
    const updated = [...galleryImages, ...urls];
    setGalleryImages(updated);
    galleryRef.current = updated;
    setNewUrl('');
    alert(`✅ Aggiunte ${urls.length} immagini`);
  };

  const deleteImage = (index) => {
    if (!confirm('Eliminare questa immagine dalla galleria?')) return;
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    galleryRef.current = updated;
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

      {/* Aggiungi Immagini */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Link size={22} className="text-teal-600" />
          Aggiungi Immagini Cloudinary
        </h3>

        {/* Singolo URL */}
        <div className="flex gap-3 mb-4">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="https://res.cloudinary.com/..."
          />
          <button
            onClick={addUrl}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Aggiungi
          </button>
        </div>

        {/* Incolla più URL */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Oppure incolla più URL (uno per riga):</p>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-28 font-mono text-xs"
            placeholder={"https://res.cloudinary.com/...\nhttps://res.cloudinary.com/...\nhttps://res.cloudinary.com/..."}
            onBlur={(e) => {
              if (e.target.value.trim()) {
                addMultipleUrls(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <p className="text-xs text-gray-400 mt-1">Incolla e clicca fuori per aggiungere tutte le immagini in una volta</p>
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
              '💾 Salva Ordine'
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
            <p className="text-xs text-gray-400 mb-4">💡 Trascina le immagini per riordinarle, poi clicca "Salva Ordine"</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((url, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition cursor-move ${
                    draggedIndex === index
                      ? 'border-teal-500 opacity-50'
                      : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => deleteImage(index)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="bg-white/20 text-white p-2 rounded-lg">
                      <GripVertical size={18} />
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                    #{index + 1}
                  </div>
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
