import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { questionResponse } from '../../infrastructure';

interface filterQuestionsParams {
  limit: number;
  offset: number;
  term?: string;
  group?: string;
}
@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly url = `${environment.base_url}/questions`;
  private http = inject(HttpClient);

  constructor() {}

  create(form: Object) {
    return this.http.post<questionResponse>(this.url, form);
  }

  update(id: string, form: Object) {
    return this.http.patch<questionResponse>(`${this.url}/${id}`, form);
  }

  findQuestions({ limit, offset, term, group }: filterQuestionsParams) {
    const params = new HttpParams({
      fromObject: {
        limit: limit,
        offset: offset,
        ...(term && { term }),
        ...(group && { group }),
      },
    });
    return this.http.get<{
      questions: questionResponse[];
      length: number;
    }>(`${environment.base_url}/questions`, { params });
  }

  upload(data: any[]) {
    return this.http.post(`${this.url}/upload`, data);
  }

  getGroups() {
    return this.http.get<string[]>(`${environment.base_url}/questions/groups`);
  }
}
