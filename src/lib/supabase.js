import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funzioni helper per Popup
export const popupService = {
  // Get configurazione popup attiva
  async getActivePopup() {
    const { data, error } = await supabase
      .from('popup_config')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching popup:', error)
      return null
    }
    
    return data
  },

  // Get tutti i popup
  async getAllPopups() {
    const { data, error } = await supabase
      .from('popup_config')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching popups:', error)
      return []
    }
    
    return data
  },

  // Crea nuovo popup
  async createPopup(popupData) {
    const { data, error } = await supabase
      .from('popup_config')
      .insert([popupData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Aggiorna popup
  async updatePopup(id, popupData) {
    const { data, error } = await supabase
      .from('popup_config')
      .update(popupData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Elimina popup
  async deletePopup(id) {
    const { error } = await supabase
      .from('popup_config')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get statistiche popup
  async getPopupStats(popupId, days = 30) {
    const { data, error } = await supabase
      .from('popup_stats')
      .select('*')
      .eq('popup_id', popupId)
      .order('date', { ascending: false })
      .limit(days)
    
    if (error) {
      console.error('Error fetching stats:', error)
      return []
    }
    
    return data
  },

  // Incrementa views
  async incrementViews(popupId) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing } = await supabase
      .from('popup_stats')
      .select('*')
      .eq('popup_id', popupId)
      .eq('date', today)
      .single()

    if (existing) {
      await supabase
        .from('popup_stats')
        .update({ views: existing.views + 1 })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('popup_stats')
        .insert({ popup_id: popupId, date: today, views: 1, clicks: 0 })
    }
  },

  // Incrementa clicks
  async incrementClicks(popupId) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing } = await supabase
      .from('popup_stats')
      .select('*')
      .eq('popup_id', popupId)
      .eq('date', today)
      .single()

    if (existing) {
      await supabase
        .from('popup_stats')
        .update({ clicks: existing.clicks + 1 })
        .eq('id', existing.id)
    }
  }
}
