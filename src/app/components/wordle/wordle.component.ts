import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SolutionsService } from 'src/app/services/solutions.service';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit, OnDestroy {
  public guesses: any = this.solutionsService.guesses$.asObservable();

  private keyUpSubscription!: Subscription;
  private solutionSubscription!: Subscription;

  constructor(private solutionsService: SolutionsService) {}

  ngOnInit(): void {
    this.keyUpSubscription = this.solutionsService.keyUpEvents$.subscribe();
    this.solutionSubscription = this.solutionsService.getSolutions().subscribe();
  }

  ngOnDestroy(): void {
    this.keyUpSubscription.unsubscribe();
    this.solutionSubscription.unsubscribe();
  }
}
