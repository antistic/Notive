import Vue from 'vue';
import { Directory } from '@/model';

export interface StateUpdate {
  ready?: boolean;
  availableAttributes?: string[];
  fsRoot?: Directory;
}

export interface State {
  ready: boolean;
  availableAttributes: string[];
  fsRoot?: Directory;
}

export const state = Vue.observable<State>({
  ready: false,
  availableAttributes: [],
});

export const reduce = (update: StateUpdate) => {
  for(const [key, value] of Object.entries(update)) {
    state[key as keyof State] = value;
  }
  return state;
}
