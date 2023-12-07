import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';



// PrimeNG Imports
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';




const PRIME_NG_MODULES = [ToolbarModule, TableModule, ButtonModule];

@NgModule({
    imports: [...PRIME_NG_MODULES, CommonModule, HttpClientModule],
    exports: [...PRIME_NG_MODULES, CommonModule, HttpClientModule ]
})
export class SharedModule {};