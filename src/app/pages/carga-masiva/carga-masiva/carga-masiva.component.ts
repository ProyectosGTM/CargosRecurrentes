import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit {

  public formExcel: FormGroup;
  archivoSeleccionado: File | null = null;

  
  tableHeaders: string[] = [];
  tableData: any[] = [];

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
  ) {}

  ngOnInit(): void {   
    this.initForm();
  }

  initForm() {
    this.formExcel = this.fb.group({
      archivo: []
    });
  }

  getArchivo(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.type === 'text/csv')) {
      this.archivoSeleccionado = file;
      this.formExcel.get('archivo').setValue(file);
      Swal.fire({
        title: 'Cargando...',
        text: 'Espera mientras se sube el archivo.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setTimeout(() => {
        Swal.close();
        this.leerExcel(file);
      }, 2000);
    } else {
      Swal.fire('Archivo no válido', 'Por favor, selecciona un archivo en formato Excel (.xls, .xlsx, .csv)', 'error');
      this.formExcel.get('archivo').reset();
      this.archivoSeleccionado = null;
    }
  }

  leerExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      
      this.tableHeaders = jsonData[0] as string[];

      
      this.tableData = jsonData.slice(1)
        .filter((row: any[]) => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
        .map((row: any[]) => {
          const rowData: any = {};
          this.tableHeaders.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

      
      if (this.tableData.length === 0) {
        Swal.fire('Sin datos', 'El archivo solo contiene los encabezados sin datos adicionales.', 'info');
      } else {
        Swal.fire({
          title: 'Archivo listo',
          text: `El archivo se ha cargado correctamente y los datos están listos.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  guardar() {
    if (!this.archivoSeleccionado) {
      Swal.fire('Error', 'No hay ningún archivo cargado', 'error');
      return;
    }

    Swal.fire({
      title: 'Sincronizando',
      text: 'Espera mientras se sincronizan los datos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.close();
      Swal.fire('Sincronización completa', 'Los datos se han sincronizado correctamente.', 'success');
    }, 3000);
  }
}
