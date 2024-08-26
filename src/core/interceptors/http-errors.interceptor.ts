import {
  HttpErrorResponse,
  type HttpInterceptorFn,
} from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { catchError, throwError } from 'rxjs';

export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleHttpErrors(error);
      return throwError(Error);
    })
  );
};

const handleHttpErrors = (error: HttpErrorResponse): void => {
  const description = Array.isArray(error.error['message'])
    ? error.error['message'][0] ?? ''
    : error.error['message'];

  switch (error.status) {
    case 500:
      toast.success('Error interno', {
        description: 'Se ha producido un error en el servidor',
      });
      break;

    case 400:
      toast.warning('Solicitud incorrecta', {
        description,
      });
      break;

    default:
      toast.info('Ha ocurrido un error', {
        description: 'Error desconocido',
      });
      break;
  }
};
