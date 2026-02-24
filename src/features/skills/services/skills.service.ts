import api from '@/lib/api';

export const getCategories = async () => {
  return api.get('/skills/categories') as Promise<any>;
};

export const getSkillsByCategory = async (categoryId: number) => {
  return api.get(`/skills/categories/${categoryId}`) as Promise<any>;
};
