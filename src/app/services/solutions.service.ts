import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Solutions } from '../models/solutions.model';

const DB_URL: string = 'https://ng-wordle-default-rtdb.europe-west1.firebasedatabase.app';

@Injectable({
  providedIn: 'root'
})
export class SolutionsService {
  turn: any = 0;
  history: any[] = [];
  isCorrect: boolean = false;
  solution: string = '';

  public guesses$: BehaviorSubject<any> = new BehaviorSubject<any>([...Array(6)]);
  public currentGuess$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public keyUpEvents$ = fromEvent(document, 'keyup').pipe(map((e: any) => this.handleKeyUp(e)));

  constructor(private http: HttpClient) {}

  public getSolutions(): Observable<Solutions> {
    return this.http.get<Solutions>(`${DB_URL}/solutions.json`).pipe(
      tap((solutions: any) => {
        this.solution = solutions[Math.floor(Math.random() * solutions.length)].word;
      })
    );
  }

  public handleKeyUp({ key }: any) {
    const guess: string = this.currentGuess$.getValue();

    if (key === 'Enter') {
      // only add guess if turn is less than 5
      if (this.turn > 5) {
        console.log('You used all your guesses!');
        return;
      }

      //do not allow duplicate words
      if (this.history.includes(guess)) {
        console.log('You already tried that word!');
        return;
      }

      // check word is 5 chars long
      if (guess.length !== 5) {
        console.log('Word must be 5 chars long!');
        return;
      }

      const formatted = this.formatGuess(guess);
      console.log('before addNewGuess', formatted);
      this.addNewGuess(formatted);
    }

    if (key === 'Backspace') {
      this.currentGuess$.next(guess?.slice(0, -1));
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (guess.length < 5) {
        this.currentGuess$.next(guess + key);
      }
    }
  }

  private formatGuess(guess: string): any {
    let solutionArr: any = [...this.solution];
    let formattedGuess = [...guess].map((l: string) => {
      return { key: l, color: 'grey' };
    });

    // find any green letters
    formattedGuess.forEach((l, i) => {
      if (solutionArr[i] === l.key) {
        formattedGuess[i].color = 'green';
        solutionArr[i] = null;
      }
    });

    // find any yellow letters
    formattedGuess.forEach((l, i) => {
      if (solutionArr.includes(l.key) && l.color !== 'green') {
        formattedGuess[i].color = 'yellow';
        solutionArr[solutionArr.indexOf(l.key)] = null;
      }
    });

    return formattedGuess;
  }

  private addNewGuess(formatted: string): any {
    const guess: string = this.currentGuess$.getValue();
    const guesses: string = this.guesses$.getValue();

    if (guess === this.solution) {
      this.isCorrect = true;
    }

    // set guesses
    let newGuesses = [...guesses];
    newGuesses[this.turn] = formatted;
    this.guesses$.next(newGuesses);

    // set history
    let newHistory = [...this.history, guess];
    this.history = newHistory;

    // set turn
    this.turn++;

    // set current guess
    this.currentGuess$.next('');
  }
}
