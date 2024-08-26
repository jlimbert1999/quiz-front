import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { questionResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly url = `${environment.base_url}/questions`;
  private http = inject(HttpClient);

  constructor() {}

  createQuestion(form: Object) {
    return this.http.post<questionResponse>(this.url, form);
  }

  updateQeustion(id: string, form: Object) {
    return this.http.patch<questionResponse>(`${this.url}/${id}`, form);
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

  getRandom(group: string) {
    return this.http.get<questionResponse>(`${this.url}/play/${group}`);
  }

  getGroups() {
    return this.http.get<string[]>(`${environment.base_url}/questions/groups`);
  }
}
