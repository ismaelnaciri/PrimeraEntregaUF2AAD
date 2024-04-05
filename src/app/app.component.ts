import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConnectorBDService} from "../connector-bd.service";
import {HttpHeaders} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'PrimeraEntregaUF2';
  ex8Data: any[] = [];

  constructor(private service: ConnectorBDService) {
    // this.service.deleteTableValuesWithErrors();

    this.service.getTableValuesPool().then((data: any[]) => {
      this.ex8Data = [];
      this.ex8Data = data;
      console.log("Data Received  | ", this.ex8Data);
    }).catch((error: any) => {
      console.error("Error fetching table values:", error);
    });
  }

  protected readonly Object = Object;
}
