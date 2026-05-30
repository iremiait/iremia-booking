import { supabase } from './supabase';

const handleQuery = async (query) => {
  const { data, error } = await query;
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const contentService = {
  // ==========================================
  // ABOUT SECTION
  // ==========================================
  async getAbout() {
    return await handleQuery(
      supabase.from('about_section').select('*').maybeSingle()
    );
  },

  async createAbout(aboutData) {
    const { data, error } = await supabase
      .from('about_section')
      .insert([aboutData])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async updateAbout(id, aboutData) {
    const { data, error } = await supabase
      .from('about_section')
      .update({ ...aboutData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  // ==========================================
  // ACTIVITIES
  // ==========================================
  async getActivities() {
    return await handleQuery(
      supabase.from('activities').select('*')
        .order('season', { ascending: true })
        .order('order_position', { ascending: true })
    ) || [];
  },

  async createActivity(activityData) {
    const { data, error } = await supabase
      .from('activities')
      .insert([activityData])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async updateActivity(id, activityData) {
    const { data, error } = await supabase
      .from('activities')
      .update({ ...activityData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async deleteActivity(id) {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ==========================================
  // RESTAURANTS
  // ==========================================
  async getRestaurants() {
    return await handleQuery(
      supabase.from('restaurants').select('*')
        .order('order_position', { ascending: true })
    ) || [];
  },

  async createRestaurant(restaurantData) {
    const { data, error } = await supabase
      .from('restaurants')
      .insert([restaurantData])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async updateRestaurant(id, restaurantData) {
    const { data, error } = await supabase
      .from('restaurants')
      .update({ ...restaurantData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async deleteRestaurant(id) {
    const { error } = await supabase.from('restaurants').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ==========================================
  // POI
  // ==========================================
  async getPOIs() {
    return await handleQuery(
      supabase.from('poi').select('*')
        .order('order_position', { ascending: true })
    ) || [];
  },

  async createPOI(poiData) {
    const { data, error } = await supabase
      .from('poi')
      .insert([poiData])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async updatePOI(id, poiData) {
    const { data, error } = await supabase
      .from('poi')
      .update({ ...poiData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async deletePOI(id) {
    const { error } = await supabase.from('poi').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ==========================================
  // FAQ
  // ==========================================
  async getAllFAQs() {
    return await handleQuery(
      supabase.from('faqs').select('*')
        .order('category', { ascending: true })
        .order('order_position', { ascending: true })
    ) || [];
  },

  async getActiveFAQs() {
    return await handleQuery(
      supabase.from('faqs').select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('order_position', { ascending: true })
    ) || [];
  },

  async createFAQ(faqData) {
    const { data, error } = await supabase
      .from('faqs')
      .insert([faqData])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async updateFAQ(id, faqData) {
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...faqData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async deleteFAQ(id) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ==========================================
  // SECTION VISIBILITY
  // ==========================================
  async getSectionVisibility() {
    return await handleQuery(
      supabase.from('section_visibility').select('*')
        .order('order_position', { ascending: true })
    ) || [];
  },

  async updateSectionVisibility(sectionName, isVisible, orderPosition = null) {
    const updateData = { updated_at: new Date().toISOString() };
    if (typeof isVisible === 'boolean') updateData.is_visible = isVisible;
    if (typeof orderPosition === 'number') updateData.order_position = orderPosition;

    const { data, error } = await supabase
      .from('section_visibility')
      .update(updateData)
      .eq('section_name', sectionName)
      .select();
    if (error) throw error;
    return data;
  },

  // ==========================================
  // HOUSE RULES
  // ==========================================
  async getHouseRules() {
    return await handleQuery(
      supabase.from('house_rules_section').select('*').maybeSingle()
    );
  },

  async updateHouseRules(id, rulesData) {
    const { data, error } = await supabase
      .from('house_rules_section')
      .update({ ...rulesData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  // ==========================================
  // CONTACT INFO
  // ==========================================
  async getContactInfo() {
    return await handleQuery(
      supabase.from('contact_info').select('*').maybeSingle()
    );
  },

  async updateContactInfo(id, contactData) {
    const { data, error } = await supabase
      .from('contact_info')
      .update({ ...contactData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  // ==========================================
  // HERO SECTION
  // ==========================================
  async getHeroSection() {
    return await handleQuery(
      supabase.from('hero_section').select('*').maybeSingle()
    );
  },

  async updateHeroSection(id, heroData) {
    const { data, error } = await supabase
      .from('hero_section')
      .update({ ...heroData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  }
};
