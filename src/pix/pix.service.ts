import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class PixService {
  constructor(private httpService: HttpService) {}

  createPix(data: any): Observable<AxiosResponse<any>> {
    console.log('Imprimindo conteudo do pix', data);

    // return this.httpService.post('https://example.com/api/resource', data);
    return this.httpService.get('https://example.com/api/resource');
  }

  getPix(id: number): Observable<AxiosResponse<any>> {
    return this.httpService.get(`https://example.com/api/resource/${id}`);
  }
}
