import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from 'src/dto/create-producto.dto';
import { Producto } from '../interfaces/productos/producto.interface';
import { v4 as uuid } from 'uuid';
import { UpdateProductoDto } from 'src/dto/update-producto.dto';

@Injectable()
export class ProductosService {
  private readonly productos: Producto[] = [];

  getAll(): Producto[] {
    return this.productos;
  }
  getById(id: string): object | string {
    let index = this.productos.findIndex((prod) => prod.id == id);

    if (index != -1) {
      return this.productos[index];
    } else {
      return 'producto no encontrado.';
    }
  }

  createProd(producto: CreateProductoDto): object {
    let nuevoProd: Producto = { ...producto, id: uuid() };
    this.productos.push(nuevoProd);
    return nuevoProd;
  }

  updateProd(producto: UpdateProductoDto): string | object {
    let index = this.productos.findIndex((prod) => prod.id == producto.id);
    if (index != -1) {
      this.productos[index] = { ...this.productos[index], ...producto };
      return this.productos[index];
    } else {
      return 'producto no encontrado.';
    }
  }
  deleteProd(id: string): string {
    let index = this.productos.findIndex((prod) => prod.id == id);
    if (index != -1) {
      this.productos.splice(index, 1);
      return 'producto borrado.';
    } else {
      return 'producto no encontrado.';
    }
  }
}
