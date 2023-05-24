import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface DialogData {
  seats: number,
  max_seats: number,
  table_num: number,
}

@Component({
  standalone: true,
  selector: 'app-book-table-seats',
  templateUrl: './book-table-seats.component.html',
  styleUrls: ['./book-table-seats.component.scss'],
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class BookTableSeatsComponent {
  constructor(
    public dialogRef: MatDialogRef<BookTableSeatsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
