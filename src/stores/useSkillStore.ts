import { create } from 'zustand';

interface SkillStore {
  pendingSkill: string | null;
  setPendingSkill: (skill: string | null) => void;
}

export const useSkillStore = create<SkillStore>()((set) => ({
  pendingSkill: null,
  setPendingSkill: (skill) => set({ pendingSkill: skill }),
}));
