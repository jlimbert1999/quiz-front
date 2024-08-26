import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { gameResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly url = `${environment.base_url}/game`;

  private http = inject(HttpClient);

  create(form: Object) {
    return this.http.post<any>(this.url, form);
  }

  update(id: string, form: Object) {
    return this.http.patch<any>(`${this.url}/${id}`, form);
  }

  findAll(pagination: { limit: number; offset: number }) {
    const params = new HttpParams({
      fromObject: { limit: pagination.limit, offset: pagination.offset },
    });
    return this.http.get<{ games: any[]; length: number }>(this.url, {
      params,
    });
  }

  getPendings() {
    return this.http.get<gameResponse[]>(`${this.url}/pendings`);
  }
}
