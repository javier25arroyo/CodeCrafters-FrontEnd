import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, IResponse } from '../interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GameService extends BaseService<IGame>{
  protected override source: string = 'games';
  private itemListSignal = signal<IGame[]>([]);
  private snackBar = inject(MatSnackBar);
  

  
  get items$() {
    return this.itemListSignal
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: IResponse<IGame[]>) => {
        const data = (response?.data ?? []).slice().reverse();
        this.itemListSignal.set(data);
      },
      error: (error : any) => {
        
      }
    });
  }

  public save(item: IGame) {
    item.status = 'active';
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((games: IGame[]) => [response, ...games]);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  } 

  public update(item: IGame) {
    this.edit(item.id, item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(game => game.id === item.id ? item : game);
        this.itemListSignal.set(updatedItems);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  public delete(game: IGame) {
    this.del(game.id).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().filter((g: IGame) => g.id != game.id);
        this.itemListSignal.set(updatedItems);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
getAllGames(): Observable<IGame[]> {
  return this.http.get<IResponse<IGame[]>>(`games`)
    .pipe(map(response => response.data));
}

}
