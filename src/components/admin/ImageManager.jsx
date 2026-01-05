import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, GripVertical, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ImageManager = () => {
  const [heroImage, setHeroImage] = useState(null);
  const [heroHistory, setHeroHistory] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const [logoHistory, setLogoHistory] = useState([]);
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
        setHeroHistory(data.hero_history || []);
        setGalleryImages(data.gallery_urls || []);
        setLogoImage(data.logo_url);
        setLogoHistory(data.logo_history || []);
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
      // Aggiungi URL corrente allo storico (se esiste)
      const newHistory = heroImage ? [...heroHistory, heroImage] : heroHistory;
      
      setHeroImage(url);
      setHeroHistory(newHistory);
      await saveImages({ 
        hero_url: url,
        hero_history: newHistory
      });
    }
  };

  const selectHeroFromHistory = async (url) => {
    // Aggiungi hero corrente allo storico
    const newHistory = heroImage ? [...heroHistory.filter(h => h !== url), heroImage] : heroHistory.filter(h => h !== url);
    
    setHeroImage(url);
    setHeroHistory(newHistory);
    await saveImages({ 
      hero_url: url,
      hero_history: newHistory
    });
  };

  const deleteHeroFromHistory = async (urlToDelete) => {
    if (!confirm('Eliminare questa immagine dallo storico?')) return;
    
    const newHistory = heroHistory.filter(url => url !== urlToDelete);
    setHeroHistory(newHistory);
    await saveImages({ hero_history: newHistory });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImage(file, 'logo');
    if (url) {
      // Aggiungi logo corrente allo storico (se esiste)
      const newHistory = logoImage ? [...logoHistory, logoImage] : logoHistory;
      
      setLogoImage(url);
      setLogoHistory(newHistory);
      await saveImages({ 
        logo_url: url,
        logo_history: newHistory
      });
    }
  };

  const selectLogoFromHistory = async (url) => {
    // Aggiungi logo corrente allo storico
    const newHistory = logoImage ? [...logoHistory.filter(l => l !== url), logoImage] : logoHistory.filter(l => l !== url);
    
    setLogoImage(url);
    setLogoHistory(newHistory);
    await saveImages({ 
      logo_url: url,
      logo_history: newHistory
    });
  };

  const deleteLogoFromHistory = async (urlToDelete) => {
    if (!confirm('Eliminare questo logo dallo storico?')) return;
    
    const newHistory = logoHistory.filter(url => url !== urlToDelete);
    setLogoHistory(newHistory);
    await saveImages({ logo_history: newHistory });
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

  const deleteGalleryImage = async (index) => {
    if (!confirm('Eliminare questa immagine?')) return;

    const newGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGallery);
    await saveImages({ gallery_urls: newGallery });
  };

  const saveImages = async (updates) => {
    try {
      console.log('💾 Salvataggio su Supabase...', updates);

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

  const formatDate = (url) => {
    // Estrai timestamp dal nome file (es: hero_1234567890.jpg)
    const match = url.match(/_([\d]+)\./);
    if (match) {
      const timestamp = parseInt(match[1]);
      return new Date(timestamp).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Data sconosciuta';
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
      {/* Hero Image con Storico */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={24} className="text-teal-600" />
          Immagine Hero Principale
        </h3>
        
        <div className="space-y-4">
          {/* Hero Corrente */}
          {heroImage && (
            <div className="border-2 border-teal-500 rounded-lg overflow-hidden">
              <div className="bg-teal-50 px-3 py-2 flex items-center gap-2">
                <Check size={16} className="text-teal-600" />
                <span className="text-sm font-medium text-teal-900">Immagine Attuale</span>
              </div>
              <div className="relative aspect-video">
                <img src={heroImage} alt="Hero corrente" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Storico Hero */}
          {heroHistory.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Storico Immagini ({heroHistory.length})
              </p>
              <div className="space-y-2">
                {heroHistory.map((url, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer group"
                    onClick={() => selectHeroFromHistory(url)}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 group-hover:border-teal-600"></div>
                    <div className="w-32 h-20 rounded overflow-hidden flex-shrink-0">
                      <img src={url} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Caricata il {formatDate(url)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHeroFromHistory(url);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload Nuova Hero */}
          <label className="block cursor-pointer">
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

      {/* Logo con Storico */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={24} className="text-teal-600" />
          Logo
        </h3>
        
        <div className="space-y-4">
          {/* Logo Corrente */}
          {logoImage && (
            <div className="border-2 border-teal-500 rounded-lg overflow-hidden">
              <div className="bg-teal-50 px-3 py-2 flex items-center gap-2">
                <Check size={16} className="text-teal-600" />
                <span className="text-sm font-medium text-teal-900">Logo Attuale</span>
              </div>
              <div className="relative bg-gray-100 p-8 flex justify-center">
                <img src={logoImage} alt="Logo corrente" className="h-32 object-contain" />
              </div>
            </div>
          )}

          {/* Storico Logo */}
          {logoHistory.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Storico Logo ({logoHistory.length})
              </p>
              <div className="space-y-2">
                {logoHistory.map((url, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer group"
                    onClick={() => selectLogoFromHistory(url)}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 group-hover:border-teal-600"></div>
                    <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                      <img src={url} alt={`Logo ${index + 1}`} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Caricato il {formatDate(url)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLogoFromHistory(url);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload Nuovo Logo */}
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
