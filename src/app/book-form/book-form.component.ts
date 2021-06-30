import { Component, OnInit, OnChanges, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Book, Thumbnail } from '../shared/book';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges {

  bookForm!: FormGroup;

  @Output() 
  submitBook = new EventEmitter<Book>();

  @Input()
  book!: Book;

  @Input()
  editing = false;

  constructor(private fb: FormBuilder) { }
  

  submitForm() {
    const formValue = this.bookForm.value;
    const authors = formValue.authors.filter((author: any) => author);
    const thumbnails = formValue.thumbnails.filter((thumbnail: { url: any; }) => thumbnail.url);
    const isbn = this.editing ? this.book.isbn : formValue.isbn;

    const newBook: Book = {
      ...formValue,
      isbn,
      authors,
      thumbnails
    };

    this.submitBook.emit(newBook);
    this.bookForm.reset();      
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    this.initForm();
    this.setFormValues(this.book);
  }

  private setFormValues(book: Book) {
    this.bookForm.patchValue(book);
    this.bookForm.setControl(
      'authors',
      this.buildAuthorsArray(book.authors)
    );

    this.bookForm.setControl(
      'thumbnails',
      this.buildThumbnailsArray(book.thumbnails)
    );
  }

  private initForm() {
    if (this.bookForm) return;

    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      isbn: [{value: '', disabled: this.editing}, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13)
      ]],
      description: [''],
      authors: this.buildAuthorsArray(['']),
      thumbnails: this.buildThumbnailsArray([
        {title: '', url: ''}
      ]),
      published: []
    });
  }

  private buildAuthorsArray(values: string[]): FormArray {
    return this.fb.array(values, Validators.required);
  }

  private buildThumbnailsArray(values: Thumbnail[] | undefined): FormArray{
    if (values) {
      return this.fb.array(
        values.map(t => this.fb.group(t))
      );
    }

    //should not happen...
    return this.fb.array([{title: '', url: ''}]);
  }

  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  get thumbnails(): FormArray {
    return this.bookForm.get('thumbnails') as FormArray;
  }

  addAuthorControl() {
    this.authors.push(this.fb.control(''));
  }

  addThumbnailsControl() {
    this.thumbnails.push(this.fb.group({url: '', title: ''}));
  }

}


