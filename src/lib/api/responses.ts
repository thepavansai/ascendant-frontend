import apiClient from './client';
import { EvaluationResult, ResponseSubmitResult } from '../types/evaluation.types';

export const responsesApi = {
  submit: (data: {
    userId: string;
    missionId: string;
    scenarioId: string;
    answerText: string;
    selectedChoice?: string;
  }) => apiClient.post<ResponseSubmitResult>('/responses', data),
  getEvaluation: (id: string) =>
    apiClient.get<EvaluationResult>(`/responses/${id}/evaluation`),
};
