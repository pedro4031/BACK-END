import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateProductoDto } from 'src/dto/create-producto.dto';
import { UpdateProductoDto } from 'src/dto/update-producto.dto';
import { Producto } from 'src/interfaces/productos/producto.interface';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly ProductosService: ProductosService) {}
  @Get()
  buscarTodos() {
    return this.ProductosService.getAll();
  }
  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.ProductosService.getById(id);
  }
  @Post()
  creacion(@Body() createProductoDto: CreateProductoDto) {
    return this.ProductosService.createProd(createProductoDto);
  }
  @Put()
  actualizacion(@Body() updateProductoDto: UpdateProductoDto) {
    return this.ProductosService.updateProd(updateProductoDto);
  }
  @Delete()
  eliminacion(@Body() prodId) {
    return this.ProductosService.deleteProd(prodId.id);
  }
}
