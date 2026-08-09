export type TrashCategory = 'RECYCLABLE' | 'NON_RECYCLABLE';

export interface TrashItemData {
  id: string;
  name: string;
  category: TrashCategory;
  type: string; // e.g. 'chai_nuoc', 'vo_bim_bim'
  icon: string; // Emoji or SVG key
  description: string; // Kid-friendly description
  color: string;
  bgGradient: string;
  detailText: string;
}

export type GameStage =
  | 'INTRO'
  | 'TUTORIAL'
  | 'ROUND_1'
  | 'ROUND_2'
  | 'ROUND_3'
  | 'ROUND_4'
  | 'FINAL_MISSION'
  | 'VICTORY';

export interface DragPosition {
  x: number;
  y: number;
}
