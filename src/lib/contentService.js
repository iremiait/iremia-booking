import { supabase } from './supabase';

export const contentService = {
  // ==========================================
  // ABOUT SECTION (Chi Siamo)
  // ==========================================
  async getAboutSection() {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Errore caricamento about section:', error);
      return null;
    }
  },

  async updateAboutSection(aboutData) {
    try {
      const { data: existing } = await supabase
        .from('about_section')
        .select('id')
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('about_section')
          .update({ ...aboutData, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('about_section')
          .insert([aboutData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Errore aggiornamento about:', error);
      throw error;
    }
  },

  // ==========================================
  // APARTMENT DETAILS
  // ==========================================
  async getApartmentDetails() {
    try {
      const { data, error } = await supabase
        .from('apartment_details')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Errore caricamento apartment:', error);
      return null;
    }
  },

  async updateApartmentDetails(apartmentData) {
    try {
      const { data: existing } = await supabase
        .from('apartment_details')
        .select('id')
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('apartment_details')
          .update({ ...apartmentData, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('apartment_details')
          .insert([apartmentData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Errore aggiornamento apartment:', error);
      throw error;
    }
  },

  // ==========================================
  // SERVICES (Servizi)
  // ==========================================
  async getAllServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento servizi:', error);
      return [];
    }
  },

  async getActiveServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento servizi attivi:', error);
      return [];
    }
  },

  async createService(serviceData) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione servizio:', error);
      throw error;
    }
  },

  async updateService(id, serviceData) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ ...serviceData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento servizio:', error);
      throw error;
    }
  },

  async deleteService(id) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Errore eliminazione servizio:', error);
      throw error;
    }
  },

  // ==========================================
  // ACTIVITIES (Attività)
  // ==========================================
  async getAllActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('season', { ascending: true })
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento attività:', error);
      return [];
    }
  },

  async getActiveActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('season', { ascending: true })
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento attività attive:', error);
      return [];
    }
  },

  async createActivity(activityData) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activityData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione attività:', error);
      throw error;
    }
  },

  async updateActivity(id, activityData) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update({ ...activityData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento attività:', error);
      throw error;
    }
  },

  async deleteActivity(id) {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Errore eliminazione attività:', error);
      throw error;
    }
  },

  // ==========================================
  // RESTAURANTS (Ristoranti)
  // ==========================================
  async getAllRestaurants() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento ristoranti:', error);
      return [];
    }
  },

  async getActiveRestaurants() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento ristoranti attivi:', error);
      return [];
    }
  },

  async createRestaurant(restaurantData) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([restaurantData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione ristorante:', error);
      throw error;
    }
  },

  async updateRestaurant(id, restaurantData) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({ ...restaurantData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento ristorante:', error);
      throw error;
    }
  },

  async deleteRestaurant(id) {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Errore eliminazione ristorante:', error);
      throw error;
    }
  },

  // ==========================================
  // POI (Punti di Interesse)
  // ==========================================
  async getAllPOI() {
    try {
      const { data, error } = await supabase
        .from('poi')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento POI:', error);
      return [];
    }
  },

  async getActivePOI() {
    try {
      const { data, error } = await supabase
        .from('poi')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento POI attivi:', error);
      return [];
    }
  },

  async createPOI(poiData) {
    try {
      const { data, error } = await supabase
        .from('poi')
        .insert([poiData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione POI:', error);
      throw error;
    }
  },

  async updatePOI(id, poiData) {
    try {
      const { data, error } = await supabase
        .from('poi')
        .update({ ...poiData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento POI:', error);
      throw error;
    }
  },

  async deletePOI(id) {
    try {
      const { error } = await supabase
        .from('poi')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Errore eliminazione POI:', error);
      throw error;
    }
  },

  // ==========================================
  // FAQ
  // ==========================================
  async getAllFAQs() {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true })
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento FAQ:', error);
      return [];
    }
  },

  async getActiveFAQs() {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento FAQ attive:', error);
      return [];
    }
  },

  async createFAQ(faqData) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faqData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione FAQ:', error);
      throw error;
    }
  },

  async updateFAQ(id, faqData) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update({ ...faqData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento FAQ:', error);
      throw error;
    }
  },

  async deleteFAQ(id) {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Errore eliminazione FAQ:', error);
      throw error;
    }
  },

  // ==========================================
  // SECTION VISIBILITY
  // ==========================================
  async getSectionVisibility() {
    try {
      const { data, error } = await supabase
        .from('section_visibility')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento visibilità sezioni:', error);
      return [];
    }
  },

  async updateSectionVisibility(sectionName, isVisible) {
    try {
      const { data, error } = await supabase
        .from('section_visibility')
        .update({ 
          is_visible: isVisible,
          updated_at: new Date().toISOString()
        })
        .eq('section_name', sectionName)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento visibilità:', error);
      throw error;
    }
  },

  // Helper per riordinare elementi
  async reorderItems(tableName, itemsWithNewOrder) {
    try {
      const updates = itemsWithNewOrder.map((item, index) => 
        supabase
          .from(tableName)
          .update({ 
            order_position: index,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Errore riordinamento:', error);
      throw error;
    }
  }
};
