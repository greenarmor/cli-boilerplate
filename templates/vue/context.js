import { provide, inject, ref } from 'vue';

export function provide__NAME__() {
  const state = ref(null);
  provide('__NAME__', state);
  return state;
}

export function use__NAME__() {
  return inject('__NAME__');
}
