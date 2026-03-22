import type { FC } from 'react';

// Category Editor Icons
import CareerSelected from '@/assets/icons/category/editor/career-selected.svg';
import CareerUnselected from '@/assets/icons/category/editor/career-unselected.svg';
import EtcSelected from '@/assets/icons/category/editor/etc-selected.svg';
import EtcUnselected from '@/assets/icons/category/editor/etc-unselected.svg';
import ExerciseSelected from '@/assets/icons/category/editor/exercise-selected.svg';
import ExerciseUnselected from '@/assets/icons/category/editor/exercise-unselected.svg';
import HobbySelected from '@/assets/icons/category/editor/hobby-selected.svg';
import HobbyUnselected from '@/assets/icons/category/editor/hobby-unselected.svg';
import MoneySelected from '@/assets/icons/category/editor/money-selected.svg';
import MoneyUnselected from '@/assets/icons/category/editor/money-unselected.svg';
import RestaurantSelected from '@/assets/icons/category/editor/restaurant-selected.svg';
import RestaurantUnselected from '@/assets/icons/category/editor/restaurant-unselected.svg';
import ShoppingSelected from '@/assets/icons/category/editor/shopping-selected.svg';
import ShoppingUnselected from '@/assets/icons/category/editor/shopping-unselected.svg';
import StudySelected from '@/assets/icons/category/editor/study-selected.svg';
import StudyUnselected from '@/assets/icons/category/editor/study-unselected.svg';
import TipsSelected from '@/assets/icons/category/editor/tips-selected.svg';
import TipsUnselected from '@/assets/icons/category/editor/tips-unselected.svg';
import TravelSelected from '@/assets/icons/category/editor/travel-selected.svg';
import TravelUnselected from '@/assets/icons/category/editor/travel-unselected.svg';

import type { ArchiveCategory } from './category';

type SvgComponent = FC<{ width?: number; height?: number }>;

export const CategoryEditorIconImage: Record<
  ArchiveCategory,
  { selected: SvgComponent; unselected: SvgComponent }
> = {
  restaurant: {
    selected: RestaurantSelected,
    unselected: RestaurantUnselected,
  },
  hobby: {
    selected: HobbySelected,
    unselected: HobbyUnselected,
  },
  travel: {
    selected: TravelSelected,
    unselected: TravelUnselected,
  },
  money: {
    selected: MoneySelected,
    unselected: MoneyUnselected,
  },
  shopping: {
    selected: ShoppingSelected,
    unselected: ShoppingUnselected,
  },
  exercise: {
    selected: ExerciseSelected,
    unselected: ExerciseUnselected,
  },
  career: {
    selected: CareerSelected,
    unselected: CareerUnselected,
  },
  study: {
    selected: StudySelected,
    unselected: StudyUnselected,
  },
  tips: {
    selected: TipsSelected,
    unselected: TipsUnselected,
  },
  etc: {
    selected: EtcSelected,
    unselected: EtcUnselected,
  },
} as const;
