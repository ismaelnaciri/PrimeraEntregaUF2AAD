import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {response} from "express";

@Injectable({
  providedIn: 'root',
})
export class ConnectorBDService {

  operaris: any[] = [];
  seccions: any[] = [];

  constructor(private http: HttpClient) {

  }

  getOperaris() {
    this.operaris = [];

    this.http.get<any>("http://127.0.0.1:3080/operaris").subscribe(
      response => {
        console.log("  OPERARIS  ");
        response.forEach((element: any) => {
          this.operaris.push(element);
        })

        console.log(this.operaris);

      }
    )
  }

  getSeccions() {
    this.seccions = [];

    this.http.get<any>("http://127.0.0.1:3080/seccions").subscribe(
      response => {
        console.log("  SECCIONS  ");
        response.forEach((element: any) => {
          this.seccions.push(element);
        })
        console.log(this.seccions);

      }
    )
  }

  createTable(data: any) {
    this.http.post<any>("http://127.0.0.1:3080/createTable", data).subscribe(
      response => {
        console.log("Creada?");
        console.log(response.message);
      }
    )
  }

  insertIntoAllTables(data: any) {
    this.http.post<any>("http://127.0.0.1:3080/insertIntoAllTables", data).subscribe(
      response => {
        console.log(response.message);
      }
    )
  }

  updateValuesAllTables(data: any) {
    this.http.post<any>("http://127.0.0.1:3080/updateValuesAllTables", data).subscribe(
      response => {
        console.log(response.message);
      }
    )
  }

  getTableValues(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>("http://127.0.0.1:3080/getTableValues?id=2").subscribe(
        response => {
          console.log(response);
          resolve(response.data);
        },
        error => {
          console.error("Error fetching table values:", error);
          reject(error);
        }
      );
    });
  }

  deleteTableValues() {
    this.http.delete<any>("http://127.0.0.1:3080/deleteTableValue?id=3&table=operaris").subscribe(
      response => {
        console.log(response.message);
      }
    )
  }

  deleteTableValuesWithErrors() {
    this.http.delete<any>("http://127.0.0.1:3080/deleteTableValueWithError?id=2&table=seccions").subscribe(
      response => {
        console.log(response.message);
      }
    )
  }

  getTableValuesPool(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>("http://127.0.0.1:3080/ex8Pool?id=2").subscribe(
        response => {
          console.log(response);
          resolve(response.data);
        },
        error => {
          console.error("Error fetching table values:", error);
          reject(error);
        }
      );
    });
  }
}
