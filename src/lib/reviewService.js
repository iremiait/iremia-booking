import { supabase } from './supabase';

const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays < 7) return `${diffDays} giorni fa`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'mese' : 'mesi'} fa`;
  return `${diffYears} ${diffYears === 1 ? 'anno' : 'anni'} fa`;
};

const enrichReview = (r) => ({
  ...r,
  time_ago: r.review_date ? timeAgo(r.review_date) : r.time_ago
});

export const reviewService = {
  async getActiveReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true });
    if (error) throw error;
    return (data || []).map(enrichReview);
  },

  async getAllReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('order_position', { ascending: true });
    if (error) throw error;
    return (data || []).map(enrichReview);
  },

  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        author_name: reviewData.author_name,
        author_initials: reviewData.author_initials,
        rating: reviewData.rating || 5,
        review_text: reviewData.review_text,
        review_date: reviewData.review_date || null,
        time_ago: reviewData.time_ago,
        is_active: reviewData.is_active !== undefined ? reviewData.is_active : true,
        order_position: reviewData.order_position || 0
      }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async updateReview(id, reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ ...reviewData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async deleteReview(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async toggleActive(id, currentStatus) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async reorderReviews(reviewsWithNewOrder) {
    const updates = reviewsWithNewOrder.map((review, index) =>
      supabase
        .from('reviews')
        .update({ order_position: index, updated_at: new Date().toISOString() })
        .eq('id', review.id)
    );
    await Promise.all(updates);
    return true;
  }
};
