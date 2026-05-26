import { supabase } from './supabase';

export const contentService = {
  // ==========================================
  // ABOUT SECTION (Chi Siamo)
  // ==========================================
  async getAbout() {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento about section:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Errore caricamento about section:', error);
      return null;
    }
  },

  async createAbout(aboutData) {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .insert([aboutData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione about:', error);
      throw error;
    }
  },

  async updateAbout(id, aboutData) {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .update({ ...aboutData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento about:', error);
      throw error;
    }
  },

  // ==========================================
  // ACTIVITIES (Attività)
  // ==========================================
  async getActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('season', { ascending: true })
        .order('order_position', { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento attività:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Errore caricamento attività:', error);
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
  async getRestaurants() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('order_position', { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento ristoranti:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Errore caricamento ristoranti:', error);
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
  async getPOIs() {
    try {
      const { data, error } = await supabase
        .from('poi')
        .select('*')
        .order('order_position', { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento POI:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Errore caricamento POI:', error);
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

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento FAQ:', error);
        return [];
      }
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

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento FAQ attive:', error);
        return [];
      }
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

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento visibilità sezioni:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Errore caricamento visibilità sezioni:', error);
      return [];
    }
  },

  async updateSectionVisibility(sectionName, isVisible, orderPosition = null) {
    try {
      const updateData = { 
        is_visible: isVisible,
        updated_at: new Date().toISOString()
      };
      
      if (orderPosition !== null) {
        updateData.order_position = orderPosition;
      }

      const { data, error } = await supabase
        .from('section_visibility')
        .update(updateData)
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

  // ==========================================
  // HOUSE RULES SECTION
  // ==========================================
  async getHouseRules() {
    try {
      const { data, error } = await supabase
        .from('house_rules_section')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento house rules:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Errore caricamento house rules:', error);
      return null;
    }
  },

  async updateHouseRules(id, rulesData) {
    try {
      const { data, error } = await supabase
        .from('house_rules_section')
        .update({ ...rulesData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento house rules:', error);
      throw error;
    }
  },

  // ==========================================
  // CONTACT INFO
  // ==========================================
  async getContactInfo() {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento contact info:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Errore caricamento contact info:', error);
      return null;
    }
  },

  async updateContactInfo(id, contactData) {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .update({ ...contactData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento contact info:', error);
      throw error;
    }
  },

  // ==========================================
  // HERO SECTION
  // ==========================================
  async getHeroSection() {
    try {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Errore caricamento hero section:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Errore caricamento hero section:', error);
      return null;
    }
  },

  async updateHeroSection(id, heroData) {
    try {
      const { data, error } = await supabase
        .from('hero_section')
        .update({ ...heroData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento hero section:', error);
      throw error;
    }
  }
};
