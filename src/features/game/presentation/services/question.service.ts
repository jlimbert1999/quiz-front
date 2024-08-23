import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { questionResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private http = inject(HttpClient);

  constructor() {}

  createQuestion(form: any) {
    return this.http.post(`${environment.base_url}/question`, form);
  }

  updateQeustion(form: any) {
    return this.http.post(`${environment.base_url}/question`, form);
  }


  getQuestions(pagination: { limit: number; offset: number }) {
    const params = new HttpParams({
      fromObject: { limit: pagination.limit, offset: pagination.offset },
    });
    return this.http.get<{
      questions: questionResponse[];
      length: number;
    }>(`${environment.base_url}/questions`, { params });
  }

  getGroups() {
    return this.http.get<string[]>(`${environment.base_url}/groups`);
  }
}
