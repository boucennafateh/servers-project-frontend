import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { observable, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custome-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService { 

  private readonly apiUrl = 'any';

  constructor(private http: HttpClient) { }

  servers$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/servers`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  save$ = (server : Server) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiUrl}/servers`, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  ping$ = (ipAddress : string) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/servers/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  delete$ = (id : string) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiUrl}/servers/${id}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  filter$ = (status : Status, response : CustomResponse) => <Observable<CustomResponse>>
  new Observable<CustomResponse>(
    subscriber => {
      console.log(response);
      subscriber.next(
        status === Status.ALL ? {...response, message : `servers filtred by ${status} status `} :
        {
          ...response,
          message : response.data.servers.filter(server => server.status === status).length > 0 ?
          `servers filtred by ${status === Status.SERVER_UP ? 'Server up' : 'Server down'} status ` :
          `no server of ${status} found`,
          data : {servers : response.data.servers.filter(server => server.status === status)}
        }
      );
      subscriber.complete();
      
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);    
    return throwError(`An error code occured - status code ${error.status}`);
  }
}
