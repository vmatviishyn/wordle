import { HostListener, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, fromEvent, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Solutions } from '../models/solutions.model';

@Injectable({
  providedIn: 'root'
})
export class SolutionsService {
  turn: any = 0;
  guesses: any = [];
  history: any = [];
  isCorrect: boolean = false;

  public currentGuess$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public keyUpEvents$ = fromEvent(document, 'keyup').pipe(
    map((e: any) => this.handleKeyUp(e))
  );

  constructor(private http: HttpClient) {}

  public getSolutions(): Observable<Solutions> {
    return this.http.get<Solutions>('https://ng-wordle-default-rtdb.europe-west1.firebasedatabase.app/solutions.json');
  }

  public handleKeyUp({ key }: any) {
    const guess: string = this.currentGuess$.getValue();

    if (key === 'Backspace') {
      this.currentGuess$.next(guess?.slice(0, -1));
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (guess.length < 5) {
        this.currentGuess$.next(guess + key);
      }
    }
  }
}
