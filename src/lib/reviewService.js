import { supabase } from './supabase';

export const reviewService = {
  // Get tutte le recensioni attive (per il sito pubblico)
  async getActiveReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento recensioni attive:', error);
      return [];
    }
  },

  // Get tutte le recensioni (per admin)
  async getAllReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Errore caricamento tutte le recensioni:', error);
      return [];
    }
  },

  // Crea nuova recensione
  async createReview(reviewData) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          author_name: reviewData.author_name,
          author_initials: reviewData.author_initials,
          rating: reviewData.rating || 5,
          review_text: reviewData.review_text,
          time_ago: reviewData.time_ago,
          is_active: reviewData.is_active !== undefined ? reviewData.is_active : true,
          order_position: reviewData.order_position || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore creazione recensione:', error);
      throw error;
    }
  },

  // Aggiorna recensione
  async updateReview(id, reviewData) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          ...reviewData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore aggiornamento recensione:', error);
      throw error;
    }
  },

  // Elimina recensione
  async deleteReview(id) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Errore eliminazione recensione:', error);
      throw error;
    }
  },

  // Toggle attiva/disattiva
  async toggleActive(id, currentStatus) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Errore toggle active:', error);
      throw error;
    }
  },

  // Riordina recensioni
  async reorderReviews(reviewsWithNewOrder) {
    try {
      const updates = reviewsWithNewOrder.map((review, index) => 
        supabase
          .from('reviews')
          .update({ 
            order_position: index,
            updated_at: new Date().toISOString()
          })
          .eq('id', review.id)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Errore riordinamento:', error);
      throw error;
    }
  }
};
