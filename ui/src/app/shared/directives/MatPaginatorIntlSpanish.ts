import {MatPaginatorIntl} from "@angular/material";
import {Injectable} from "@angular/core";

@Injectable()
export class MatPaginatorIntlSpanish extends MatPaginatorIntl {
  itemsPerPageLabel = 'Elementos por página: ';
  nextPageLabel = 'Siguiente';
  previousPageLabel = 'Anterior';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    return ((page * pageSize) + 1) + ' - ' + ((page * pageSize) + pageSize) + ' de ' + length;
  }
}
