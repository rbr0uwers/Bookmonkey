import { Component } from '@angular/core';
import { Book } from './shared/book';

type Viewstate = 'list' | 'details';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  book!: Book;
  viewstate : Viewstate = 'list';

  showList() : void{
    this.viewstate = 'list';
  }

  showDetails(book: Book) : void {
    this.book = book;
    this.viewstate = 'details';
  }
}
