import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SolutionsService } from './services/solutions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public currentGuess$: Observable<string> = this.solutionsService.currentGuess$;

  private keyUpSubscription!: Subscription;

  constructor(private solutionsService: SolutionsService) {
  }

  ngOnInit(): void {
    this.keyUpSubscription = this.solutionsService.keyUpEvents$.subscribe();
  }

  ngOnDestroy(): void {
    this.keyUpSubscription.unsubscribe();
  }
}
