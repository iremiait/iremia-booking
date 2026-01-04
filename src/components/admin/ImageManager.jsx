import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ImageManager = () => {
  const [heroImage, setHeroImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      console.log('🔍 Caricamento immagini da Supabase...');
      
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('❌ Errore caricamento:', error);
        if (error.code !== 'PGRST116') {
          alert('Errore nel caricamento: ' + error.message);
        }
        return;
      }

      console.log('✅ Dati caricati:', data);

      if (data) {
        setHeroImage(data.hero_url);
        setGalleryImages(data.gallery_urls || []);
        setLogoImage(data.logo_url);
      }
    } catch (error) {
      console.error('❌ Errore catch:', error);
      alert('Errore nel caricamento immagini');
    }
    setLoading(false);
  };

  const uploadImage = async (file, type) => {
    if (!file) return null;

    if (file.size > 5 * 1024 * 1024) {
      alert('File troppo grande. Max 5MB');
      return null;
    }

    if (!file.type.startsWith('image/')) {
      alert('Seleziona un\'immagine valida');
      return null;
    }

    setUploading(true);
    try {
      console.log('📤 Upload file:', file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('popup-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Errore upload:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('popup-images')
        .getPublicUrl(filePath);

      console.log('✅ Upload completato:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('❌ Errore upload:', error);
      alert('Errore durante l\'upload: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImage(file, 'hero');
    if (url) {
      setHeroImage(url);
      await saveImages({ hero_url: url });
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadedUrls = [];
    for (const file of files) {
      const url = await uploadImage(file, 'gallery');
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      const newGallery = [...galleryImages, ...uploadedUrls];
      setGalleryImages(newGallery);
      await saveImages({ gallery_urls: newGallery });
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImage(file, 'logo');
    if (url) {
      setLogoImage(url);
      await saveImages({ logo_url: url });
    }
  };

  const deleteGalleryImage = async (index) => {
    if (!confirm('Eliminare questa immagine?')) return;

    const newGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGallery);
    await saveImages({ gallery_urls: newGallery });
  };

  const saveImages = async (updates) => {
    try {
      console.log('💾 Salvataggio su Supabase...', updates);

      // Prima controlla se esiste già un record
      const { data: existing, error: checkError } = await supabase
        .from('site_images')
        .select('id')
        .maybeSingle();

      console.log('🔍 Record esistente:', existing);

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Errore check:', checkError);
        throw checkError;
      }

      if (existing) {
        // UPDATE del record esistente
        console.log('🔄 Aggiorno record esistente:', existing.id);
        
        const { data: updated, error: updateError } = await supabase
          .from('site_images')
          .update(updates)
          .eq('id', existing.id)
          .select();
        
        if (updateError) {
          console.error('❌ Errore update:', updateError);
          throw updateError;
        }
        
        console.log('✅ Update completato:', updated);
      } else {
        // INSERT nuovo record
        console.log('➕ Creo nuovo record');
        
        const { data: inserted, error: insertError } = await supabase
          .from('site_images')
          .insert([updates])
          .select();
        
        if (insertError) {
          console.error('❌ Errore insert:', insertError);
          throw insertError;
        }
        
        console.log('✅ Insert completato:', inserted);
      }

      alert('✅ Immagini salvate con successo!');
      
      // Ricarica per verificare
      await loadImages();
      
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
      alert('❌ Errore nel salvataggio: ' + error.message);
    }
  };

  // Drag & Drop per riordinare galleria
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newGallery = [...galleryImages];
    const draggedItem = newGallery[draggedIndex];
    newGallery.splice(draggedIndex, 1);
    newGallery.splice(index, 0, draggedItem);

    setGalleryImages(newGallery);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    await saveImages({ gallery_urls: galleryImages });
  };

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
          <ImageIcon size={24} className="text-teal-600" />
          Immagine Hero Principale
        </h3>
        
        <div className="space-y-4">
          {heroImage && (
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 transition text-center">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600">
                  {uploading ? 'Caricamento...' : 'Clicca per caricare nuova foto Hero'}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            <ImageIcon size={24} className="text-teal-600" />
            Galleria Foto ({galleryImages.length})
          </h3>
          
          <label className="cursor-pointer">
            <div className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2">
              <Upload size={18} />
              Aggiungi Foto
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {galleryImages.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <ImageIcon className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-500">Nessuna foto nella galleria</p>
            <p className="text-sm text-gray-400 mt-1">Carica le tue prime foto</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((url, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-teal-500 transition cursor-move"
              >
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => deleteGalleryImage(index)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="bg-white/20 text-white p-2 rounded-lg">
                    <GripVertical size={18} />
                  </div>
                </div>

                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          💡 Trascina le immagini per riordinarle
        </p>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={24} className="text-teal-600" />
          Logo
        </h3>
        
        <div className="space-y-4">
          {logoImage && (
            <div className="relative rounded-lg overflow-hidden bg-gray-100 p-8 flex justify-center">
              <img src={logoImage} alt="Logo" className="h-32 object-contain" />
            </div>
          )}
          
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 transition text-center">
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600">
                {uploading ? 'Caricamento...' : 'Clicca per caricare nuovo logo'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG trasparente consigliato (max 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageManager;
