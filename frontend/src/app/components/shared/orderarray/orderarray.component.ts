import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-orderarray',
  templateUrl: './orderarray.component.html',
  styleUrls: ['./orderarray.component.scss']
})
export class OrderarrayComponent {
  @Output() buttonFunction: EventEmitter<any> = new EventEmitter<any>();
  @Input() buttonText?: string
  @Input() ordersProcessing?: Order[]
  @Input() showButton: boolean = true
  @Input() iconName?: string

  ordersProcessingMessage?: string

  finishOrder(table_num: number) {
    this.buttonFunction.emit(table_num)
  }
}
